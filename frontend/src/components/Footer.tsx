import { Code2, Cpu, Rocket, LayoutTemplate } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 py-12 backdrop-blur-sm transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-6">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                            <Rocket size={16} />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                            Company Research Assistant
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1.5 transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                            <LayoutTemplate size={14} /> React
                        </span>
                        <span className="flex items-center gap-1.5 transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                            <Code2 size={14} /> FastAPI
                        </span>
                        <span className="flex items-center gap-1.5 transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                            <Cpu size={14} /> OpenAI
                        </span>
                        <span className="flex items-center gap-1.5 transition-colors hover:text-slate-600 dark:hover:text-slate-300">
                            <span className="font-bold">≈</span> Tailwind CSS
                        </span>
                    </div>
                </div>
                
                <div className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500 transition-colors">
                    &copy; {new Date().getFullYear()} Built for modern AI SaaS research.
                </div>
            </div>
        </footer>
    );
}
