import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    "Planning research",
    "Searching company website",
    "Reading latest news",
    "Competitor analysis",
    "AI summarization",
    "Generating account plan",
];

interface Props {
    isResearching?: boolean;
    hasResult?: boolean;
}

function ResearchProgress({ isResearching = false, hasResult = false }: Props) {
    return (
        <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-lg shadow-slate-200/40 dark:shadow-none transition-colors duration-300">
            <h2 className="mb-8 text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
                Research Progress
            </h2>

            <div className="relative space-y-8">
                {/* Vertical connecting line */}
                <div className="absolute left-5 top-5 bottom-5 w-[2px] -translate-x-1/2 bg-slate-100 dark:bg-slate-800"></div>

                {steps.map((step, index) => {
                    let Icon = Circle;
                    let iconBg = "bg-slate-50 dark:bg-slate-800/50";
                    let iconColor = "text-slate-300 dark:text-slate-600";
                    let textColor = "text-slate-500 font-medium dark:text-slate-400";
                    let isCurrent = false;

                    // Simulated logic
                    if (hasResult) {
                        Icon = CheckCircle2;
                        iconBg = "bg-emerald-50 dark:bg-emerald-500/10";
                        iconColor = "text-emerald-500 dark:text-emerald-400";
                        textColor = "text-slate-800 font-medium dark:text-slate-200";
                    } else if (isResearching) {
                        if (index === 0) {
                            Icon = CheckCircle2;
                            iconBg = "bg-emerald-50 dark:bg-emerald-500/10";
                            iconColor = "text-emerald-500 dark:text-emerald-400";
                            textColor = "text-slate-800 font-medium dark:text-slate-200";
                        } else if (index === 1) {
                            Icon = Loader2;
                            iconBg = "bg-blue-50 dark:bg-blue-500/10";
                            iconColor = "text-blue-600 dark:text-blue-400 animate-spin";
                            textColor = "text-blue-700 font-semibold dark:text-blue-400";
                            isCurrent = true;
                        }
                    }

                    return (
                        <motion.div 
                            key={step} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group relative flex items-center gap-4 transition-all duration-300 ${isCurrent ? 'scale-[1.02]' : ''}`}
                        >
                            <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${iconBg} ${iconColor} shadow-sm dark:shadow-none ring-4 ring-white dark:ring-slate-900`}>
                                <Icon size={20} />
                            </div>
                            
                            <span className={`text-base tracking-tight transition-colors ${textColor}`}>
                                {step}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default ResearchProgress;