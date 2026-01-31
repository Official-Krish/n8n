import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Pencil, ChevronRight, Activity, Key, Trash2 } from "lucide-react";
import type { Workflow } from "@/types/api";
import { ZerodhaTokenDialog } from "./ZerodhaTokenDialog";
import { DeleteWorkflowDialog } from "./DeleteWorkflowDialog";

interface WorkflowTableProps {
    workflows: Workflow[];
    loading: boolean;
    onWorkflowDeleted?: () => void;
}

export const WorkflowTable = ({ workflows, loading, onWorkflowDeleted }: WorkflowTableProps) => {
    const navigate = useNavigate();
    const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

    const hasZerodhaAction = (workflow: Workflow) => {
        return workflow.nodes?.some((node: any) => 
            node.type?.toLowerCase() === "zerodha"
        ) ?? false;
    };

    if (loading) {
        return (
            <div className="flex h-48 items-center justify-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                    <span className="text-sm">Loading your workflows…</span>
                </div>
            </div>
        );
    }

    if (workflows.length === 0) {
        return (
            <div className="flex h-48 flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-muted-foreground">No workflows yet.</p>
                <Button
                    className="gap-2"
                    onClick={() => navigate("/create")}
                >
                    Start your first workflow
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-4 border-b border-neutral-600 bg-table-header px-5 py-3.5">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Workflow Name
                </span>
                <span className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground md:block">
                    Nodes
                </span>
                <span className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground md:block">
                    Connections
                </span>
                <span className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground md:block">
                    Type
                </span>
                <span className="text-right text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Actions
                </span>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border">
                {workflows.map((wf) => (
                    <div
                        key={wf._id}
                        className="grid grid-cols-5 group items-center gap-4 px-5 py-4 transition-colors hover:bg-table-row-hover"
                    >
                        <div className="flex flex-col gap-0.5">
                            <span className="font-medium text-neutral-200">
                                {wf.workflowName || "Untitled Workflow"}
                            </span>
                            <span className="font-mono text-[11px] text-muted-foreground/70">
                                {wf._id}
                            </span>
                        </div>
                        <span className="hidden text-sm tabular-nums text-muted-foreground md:block">
                            {wf.nodes?.length ?? 0}
                        </span>
                        <span className="hidden text-sm tabular-nums text-muted-foreground md:block">
                            {wf.edges?.length ?? 0}
                        </span>
                        <div className="hidden md:block">
                            {hasZerodhaAction(wf) && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                                    <Key className="h-3 w-3" />
                                    Zerodha
                                </span>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            {hasZerodhaAction(wf) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedWorkflow(wf);
                                        setTokenDialogOpen(true);
                                    }}
                                    title="Manage Zerodha Token"
                                >
                                    <Key className="h-3.5 w-3.5" />
                                    Token
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/workflow/${wf._id}/executions`);
                                }}
                            >
                                <Activity className="h-3.5 w-3.5" />
                                Executions
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/workflow/${wf._id}`);
                                }}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                                Edit
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedWorkflow(wf);
                                    setDeleteDialogOpen(true);
                                }}
                                title="Delete Workflow"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dialogs */}
            {selectedWorkflow && (
                <>
                    <ZerodhaTokenDialog
                        open={tokenDialogOpen}
                        onOpenChange={setTokenDialogOpen}
                        workflowId={selectedWorkflow._id}
                        workflowName={selectedWorkflow.workflowName || "Untitled"}
                    />
                    <DeleteWorkflowDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        workflowId={selectedWorkflow._id}
                        workflowName={selectedWorkflow.workflowName || "Untitled"}
                        onDeleted={() => {
                            onWorkflowDeleted?.();
                        }}
                    />
                </>
            )}
        </div>
    );
};
