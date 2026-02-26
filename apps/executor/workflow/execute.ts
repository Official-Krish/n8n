import type { ExecutionResponseType, ExecutionStep } from "@quantnest-trading/types";
import { evaluateConditionalMetadata } from "../handlers/trigger.handler";
import { executeActionNode } from "./execute.actions";
import {
    initializeExecutionContext,
    resolveConditionalEdges,
    type ExecutionContext,
} from "./execute.context";
import type { EdgeType, NodeType } from "../types";

export async function executeWorkflow(
    nodes: NodeType[],
    edges: EdgeType[],
    userId?: string,
    workflowId?: string,
    condition?: boolean
): Promise<ExecutionResponseType> {
    const trigger = nodes.find((node) => node?.data?.kind === "trigger" || node?.data?.kind === "TRIGGER");
    if (!trigger) {
        return {
            status: "Failed",
            steps: [{
                step: 1,
                nodeId: "unknown",
                nodeType: "trigger",
                status: "Failed",
                message: "No trigger node found",
            }],
        };
    }

    const context = initializeExecutionContext({
        nodes,
        trigger,
        userId,
        workflowId,
        condition,
    });

    return executeRecursive(trigger.id, nodes, edges, context, condition);
}

export async function executeRecursive(
    sourceId: string,
    nodes: NodeType[],
    edges: EdgeType[],
    context: ExecutionContext = {},
    condition?: boolean
): Promise<ExecutionResponseType> {
    const sourceNode = nodes.find((node) => node.id === sourceId);
    const outgoingEdges = edges.filter(({ source }) => source === sourceId);
    if (!outgoingEdges.length) {
        return { status: "Success", steps: [] };
    }

    let nextCondition = condition;
    let targetEdges = outgoingEdges;

    if (sourceNode?.type === "conditional-trigger") {
        const isRootTriggerNode = String(sourceNode.data?.kind || "").toLowerCase() === "trigger";
        const evaluatedCondition =
            typeof condition === "boolean" && isRootTriggerNode
                ? condition
                : await evaluateConditionalMetadata(sourceNode.data?.metadata);

        nextCondition = evaluatedCondition;
        context.details = {
            ...(context.details || {}),
            aiContext: {
                triggerType: "conditional-trigger",
                marketType: sourceNode.data?.metadata?.marketType === "Crypto" ? "Crypto" : "Indian",
                symbol: sourceNode.data?.metadata?.asset || context.details?.symbol,
                connectedSymbols: context.details?.aiContext?.connectedSymbols,
                targetPrice: sourceNode.data?.metadata?.targetPrice,
                condition: sourceNode.data?.metadata?.condition,
                timerIntervalSeconds: context.details?.aiContext?.timerIntervalSeconds,
                expression: sourceNode.data?.metadata?.expression,
                evaluatedCondition,
            },
        };

        targetEdges = resolveConditionalEdges({
            sourceNode,
            nodes,
            outgoingEdges,
            evaluatedCondition,
        });
    }

    const nodesToExecute = targetEdges.map(({ target }) => target);
    if (!nodesToExecute.length) {
        return { status: "Success", steps: [] };
    }

    const steps: ExecutionStep[] = [];
    await Promise.all(
        nodesToExecute.map(async (id) => {
            const node = nodes.find((n) => n.id === id);
            if (!node) return;
            await executeActionNode({
                node,
                nodes,
                edges,
                context,
                nextCondition,
                steps,
            });
        })
    );

    const childResults = await Promise.all(
        nodesToExecute.map((id) => executeRecursive(id, nodes, edges, context, nextCondition))
    );

    const childSteps = childResults.flatMap((result) => result.steps);
    const allSteps = [...steps, ...childSteps];

    if (allSteps.some((step) => step.status === "Failed")) {
        return { status: "Failed", steps: allSteps };
    }
    return { status: "Success", steps: allSteps };
}
