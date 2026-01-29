import type { ExecutionResponseType, ExecutionStep } from "@n8n-trading/types";
import { sendDiscordNotification } from "./executors/discord";
import { sendEmail } from "./executors/gmail";
import { executeGrowwNode } from "./executors/groww";
import { executeZerodhaNode } from "./executors/zerodha";
import type { EdgeType, NodeType } from "./types";

interface ExecutionContext {
    eventType?: "buy" | "sell" | "price_trigger" | "trade_failed";
    details?: {
        symbol?: string;
        quantity?: number;
        exchange?: string;
        targetPrice?: number;
        condition?: "above" | "below";
        tradeType?: "buy" | "sell";
        failureReason?: string;
    };
}

export async function executeWorkflow(nodes: NodeType[], edges: EdgeType[]): Promise<ExecutionResponseType> {
    const trigger = nodes.find((node) => node?.data?.kind === "trigger" || node?.data?.kind === "TRIGGER");

    const context: ExecutionContext = {};

    if (!trigger) {
        return {
            status: "Failed",
            steps: [{
                step: 1,
                nodeId: "unknown",
                nodeType: "trigger",
                status: "Failed",
                message: "No trigger node found"
            }]
        };
    }
    
    if (trigger.type === "price-trigger") {
        context.eventType = "price_trigger";
        context.details = {
            symbol: trigger.data?.metadata?.asset,
            targetPrice: trigger.data?.metadata?.targetPrice,
            condition: trigger.data?.metadata?.condition,
        };
    }
    
    return await executeRecursive(trigger?.id, nodes, edges, context);
}

export async function executeRecursive(
    sourceId: string, 
    nodes: NodeType[], 
    edges: EdgeType[],
    context: ExecutionContext = {}
): Promise<ExecutionResponseType> {
    const nodesToExecute = edges.filter(({source, target}) => source === sourceId).map(({target}) => target);
    if (!nodesToExecute) return {
        status: "Success",
        steps: []
    }
    const steps: ExecutionStep[] = [];

    await Promise.all(nodesToExecute.map(async (id) => {
        const node = nodes.find((n) => n.id === id);
        if (!node) return { status: "Failed", message: `Node with id ${id} not found` };
        switch (node.type) {
            case "zerodha": 
                try {
                    const Zres = await executeZerodhaNode(
                       node.data?.metadata?.symbol, 
                       node.data?.metadata?.qty, 
                       node.data?.metadata?.type, 
                       node.data?.metadata?.apiKey,
                       node.data?.metadata?.accessToken,
                       node.data?.metadata?.exchange || "NSE"
                    );
                    
                    if (Zres === "SUCCESS") {
                        context.eventType = node.data?.metadata?.type; 
                        context.details = {
                            symbol: node.data?.metadata?.symbol,
                            quantity: node.data?.metadata?.qty,
                            exchange: node.data?.metadata?.exchange || "NSE",
                        };
                        steps.push({
                            step: steps.length + 1,
                            nodeId: node.nodeId,
                            nodeType: "Zerodha Action",
                            status: "Success",
                            message: `${node.data?.metadata?.type.toUpperCase()} order executed for ${node.data?.metadata?.symbol}`
                        });
                        return;
                    } else {
                        context.eventType = "trade_failed";
                        context.details = {
                            symbol: node.data?.metadata?.symbol,
                            quantity: node.data?.metadata?.qty,
                            exchange: node.data?.metadata?.exchange || "NSE",
                            tradeType: node.data?.metadata?.type,
                            failureReason: "Trade execution failed. Please check your broker account and credentials.",
                        };
                        steps.push({
                            step: steps.length + 1,
                            nodeId: node.nodeId,
                            nodeType: "Zerodha Action",
                            status: "Failed",
                            message: `Trade execution failed for ${node.data?.metadata?.symbol}`
                        });
                        return;
                    }
                } catch (error: any) {
                    console.error("Zerodha execution error:", error);
                    context.eventType = "trade_failed";
                    context.details = {
                        symbol: node.data?.metadata?.symbol,
                        quantity: node.data?.metadata?.qty,
                        exchange: node.data?.metadata?.exchange || "NSE",
                        tradeType: node.data?.metadata?.type,
                        failureReason: error.message || "Unknown error occurred during trade execution.",
                    };
                    steps.push({
                        step: steps.length + 1,
                        nodeId: node.nodeId,
                        nodeType: "Zerodha Action",
                        status: "Failed",
                        message: error.message || "Zerodha execution failed"
                    });
                    return;
                }
                
            case "groww":
                try {
                    const Gres = await executeGrowwNode(
                        node.data?.metadata?.symbol, 
                        node.data?.metadata?.qty, 
                        node.data?.metadata?.type, 
                        node.data?.metadata?.exchange || "NSE",
                        node.data?.metadata?.accessToken
                    );
                    
                    if (Gres === "SUCCESS") {
                        context.eventType = node.data?.metadata?.type;
                        context.details = {
                            symbol: node.data?.metadata?.symbol,
                            quantity: node.data?.metadata?.qty,
                            exchange: node.data?.metadata?.exchange || "NSE",
                        };
                        steps.push({
                            step: steps.length + 1,
                            nodeId: node.nodeId,
                            nodeType: "Groww Action",
                            status: "Success",
                            message: `${node.data?.metadata?.type.toUpperCase()} order executed for ${node.data?.metadata?.symbol}`
                        });
                        return;
                    } else {
                        context.eventType = "trade_failed";
                        context.details = {
                            symbol: node.data?.metadata?.symbol,
                            quantity: node.data?.metadata?.qty,
                            exchange: node.data?.metadata?.exchange || "NSE",
                            tradeType: node.data?.metadata?.type,
                            failureReason: "Trade execution failed. Please check your broker account and credentials.",
                        };
                        steps.push({
                            step: steps.length + 1,
                            nodeId: node.nodeId,
                            nodeType: "Groww Action",
                            status: "Failed",
                            message: `Trade execution failed for ${node.data?.metadata?.symbol}`
                        });
                        return;
                    }
                } catch (error: any) {
                    console.error("Groww execution error:", error);
                    context.eventType = "trade_failed";
                    context.details = {
                        symbol: node.data?.metadata?.symbol,
                        quantity: node.data?.metadata?.qty,
                        exchange: node.data?.metadata?.exchange || "NSE",
                        tradeType: node.data?.metadata?.type,
                        failureReason: error.message || "Unknown error occurred during trade execution.",
                    };
                    steps.push({
                        step: steps.length + 1,
                        nodeId: node.nodeId,
                        nodeType: "Groww Action",
                        status: "Failed",
                        message: error.message || "Groww execution failed"
                    });
                    return { status: "Failed", message: error.message || "Groww execution failed" };
                }

            case "gmail": 
                if (context.eventType && context.details) {
                    await sendEmail(
                        node.data?.metadata?.recipientEmail || "",
                        node.data?.metadata?.recipientName || "User",
                        context.eventType,
                        context.details
                    );
                    steps.push({
                        step: steps.length + 1,
                        nodeId: node.nodeId,
                        nodeType: "Gmail Action",
                        status: "Success",
                        message: "Email notification sent"
                    });
                    return;
                }
                steps.push({
                    step: steps.length + 1,
                    nodeId: node.nodeId,
                    nodeType: "Gmail Action",
                    status: "Failed",
                    message: "Failed to send email notification - Missing Context"
                });
                return;

            case "discord": 
                if (context.eventType && context.details) {
                    await sendDiscordNotification(
                        node.data?.metadata?.webhookUrl || "",
                        node.data?.metadata?.recipientName || "User",
                        context.eventType,
                        context.details
                    );
                    steps.push({
                        step: steps.length + 1,
                        nodeId: node.nodeId,
                        nodeType: "Discord Action",
                        status: "Success",
                        message: "Discord notification sent"
                    });
                    return;
                }
                steps.push({
                    step: steps.length + 1,
                    nodeId: node.nodeId,
                    nodeType: "Discord Action",
                    status: "Failed",
                    message: "Failed to send Discord notification - Missing Context"
                });
                return;
        }
    }));

    await Promise.all(nodesToExecute.map(id => executeRecursive(id, nodes, edges, context)));

    if (steps.some(step => step.status === "Failed")) {
        return { status: "Failed", steps: steps };
    }
    return { status: "Success", steps: steps };
}