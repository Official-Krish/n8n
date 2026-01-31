import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

interface WorkflowStatusBadgeProps {
    hasZerodha: boolean;
    marketStatus?: {
        isOpen: boolean;
        message: string;
    };
    tokenStatus?: {
        hasValidToken: boolean;
        needsToken: boolean;
        message: string;
    };
}

export const WorkflowStatusBadge = ({ hasZerodha, marketStatus, tokenStatus }: WorkflowStatusBadgeProps) => {
    if (!hasZerodha) return null;

    const issues: string[] = [];
    
    if (marketStatus && !marketStatus.isOpen) {
        issues.push("Market Closed");
    }
    
    if (tokenStatus && tokenStatus.needsToken) {
        issues.push("Token Required");
    }

    if (issues.length === 0) {
        return (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 border border-green-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ready to Trade
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-2">
            {marketStatus && !marketStatus.isOpen && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-400 border border-yellow-500/20">
                    <Clock className="h-3.5 w-3.5" />
                    {marketStatus.message}
                </div>
            )}
            {tokenStatus && tokenStatus.needsToken && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 border border-red-500/20">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {tokenStatus.message}
                </div>
            )}
        </div>
    );
};
