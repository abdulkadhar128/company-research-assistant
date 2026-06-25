import { Copy } from "lucide-react";
import type { ResearchResponse } from "../services/research";

interface Props {
    visible?: boolean;
    result?: ResearchResponse | null;
}

function ExportActions({ visible = true, result }: Props) {
    if (!visible || !result) return null;

    const handleAction = (label: string) => {
        if (label === "PDF") {
            window.print();
        } else if (label === "JSON") {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `${result.company}_account_plan.json`);
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else if (label === "Excel") {
            // Create a simple CSV representation
            const data = result.data;
            if (!data) return;
            
            const rows = [
                ["Company", result.company],
                ["Industry", data.industry || ""],
                ["Website", data.official_website || ""],
                ["Executive Summary", data.executive_summary || ""],
                [],
                ["Competitors"],
                ...(data.competitors?.map(c => [c]) || []),
                [],
                ["Products & Services"],
                ...(data.products_services?.map(p => [p]) || []),
                [],
                ["SWOT Analysis"],
                ["Strengths", data.swot?.strengths?.join("; ") || ""],
                ["Weaknesses", data.swot?.weaknesses?.join("; ") || ""],
                ["Opportunities", data.swot?.opportunities?.join("; ") || ""],
                ["Threats", data.swot?.threats?.join("; ") || ""],
                [],
                ["Outreach Strategy", data.account_plan?.outreach_strategy || ""]
            ];
            
            const csvContent = "data:text/csv;charset=utf-8," 
                + rows.map(e => e.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(",")).join("\n");
                
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `${result.company}_account_plan.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else if (label === "Share") {
            if (navigator.share) {
                navigator.share({
                    title: `${result.company} Account Plan`,
                    text: `Check out this AI-generated account plan for ${result.company}!`,
                    url: window.location.href,
                }).catch(console.error);
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        }
    };

    const actions = [
        { label: "PDF", icon: "📄" },
        { label: "Excel", icon: "📊" },
        { label: "JSON", icon: "📁" },
        { label: "Share", icon: "📤" },
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="relative rounded-2xl bg-[#f4f4f5] dark:bg-slate-800/50 p-6 font-mono text-sm text-slate-800 dark:text-slate-300 shadow-sm transition-colors duration-300 mt-6">
            <button 
                onClick={handleCopy}
                className="absolute right-4 top-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                title="Copy link"
            >
                <Copy size={18} />
            </button>

            <div className="space-y-4 mt-2">
                {actions.map((action) => (
                    <button 
                        key={action.label} 
                        onClick={() => handleAction(action.label)}
                        className="flex items-center gap-4 w-full text-left hover:opacity-70 transition-opacity"
                    >
                        <span className="inline-block w-4 text-center">
                            {action.icon}
                        </span>
                        <span>{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ExportActions;
