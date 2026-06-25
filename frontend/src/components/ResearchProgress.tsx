import { useState, useEffect } from "react";
import { Copy } from "lucide-react";

const steps = [
    "Planning",
    "Website Crawling",
    "Reading News",
    "SWOT Analysis",
    "Account Plan",
];

interface Props {
    isResearching?: boolean;
    hasResult?: boolean;
}

function ResearchProgress({ isResearching = false, hasResult = false }: Props) {
    const [currentStep, setCurrentStep] = useState(-1);

    useEffect(() => {
        if (hasResult) {
            setCurrentStep(steps.length);
            return;
        }

        if (isResearching) {
            setCurrentStep(0);
            
            const interval = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    }
                    return prev;
                });
            }, 2500);

            return () => clearInterval(interval);
        } else {
            setCurrentStep(-1);
        }
    }, [isResearching, hasResult]);

    const handleCopy = () => {
        const text = steps.map((step, index) => {
            let status = "o";
            if (hasResult || (isResearching && index < currentStep)) {
                status = "✓";
            } else if (isResearching && index === currentStep) {
                status = "⟳";
            }
            return `${status} ${step}`;
        }).join('\n');
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="relative rounded-2xl bg-[#f4f4f5] dark:bg-slate-800/50 p-6 font-mono text-sm text-slate-800 dark:text-slate-300 shadow-sm transition-colors duration-300">
            <button 
                onClick={handleCopy}
                className="absolute right-4 top-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                title="Copy progress"
            >
                <Copy size={18} />
            </button>

            <div className="space-y-4 mt-2">
                {steps.map((step, index) => {
                    let status = "o";
                    let isSpinning = false;

                    if (hasResult || (isResearching && index < currentStep)) {
                        status = "✓";
                    } else if (isResearching && index === currentStep) {
                        status = "⟳";
                        isSpinning = true;
                    }

                    return (
                        <div key={step} className="flex items-center gap-4">
                            <span className={`inline-block w-4 text-center ${isSpinning ? "animate-spin" : ""}`}>
                                {status}
                            </span>
                            <span>{step}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ResearchProgress;