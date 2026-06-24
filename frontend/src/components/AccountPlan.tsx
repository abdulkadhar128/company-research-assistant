import { 
    Building2, FileText, Target, Activity, 
    Lightbulb, ShieldAlert, LineChart, Briefcase, Search
} from "lucide-react";
import { motion } from "framer-motion";

interface Props {
    result: {
        company: string;
        status: string;
        message: string;
    } | null;
}

function Section({ icon: Icon, title, children, delay }: { icon: any, title: string, children: React.ReactNode, delay: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="group mt-6 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md dark:shadow-none"
        >
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-6 py-4 transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20">
                    <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">{title}</h3>
            </div>
            <div className="p-6 text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">
                {children}
            </div>
        </motion.div>
    );
}

function SkeletonBlock() {
    return (
        <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
            <div className="h-4 w-4/6 animate-pulse rounded bg-slate-100 dark:bg-slate-800"></div>
        </div>
    );
}

function AccountPlan({ result }: Props) {
    if (!result) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full min-h-[600px] flex-col items-center justify-center rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300"
            >
                <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 text-blue-500 dark:text-slate-400 shadow-inner">
                    <FileText size={48} />
                    <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-700 shadow-md">
                        <Search size={20} className="text-indigo-500 dark:text-indigo-400" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">Start researching a company</h2>
                <p className="mt-4 max-w-md text-lg text-slate-500 dark:text-slate-400 transition-colors">
                    Search for a company using the bar above to automatically generate a comprehensive AI-powered account plan.
                </p>
                <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="mt-8 rounded-xl bg-slate-900 dark:bg-slate-800 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-slate-800 dark:hover:bg-slate-700 hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-none"
                >
                    Start Research
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300"
        >
            <div className="flex items-start justify-between pb-6">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors">
                        {result.company}
                    </h2>
                    <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-500/20">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        {result.status.toUpperCase()}
                    </span>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors">
                    <Building2 size={32} />
                </div>
            </div>

            <div className="mt-2 space-y-6">
                <Section icon={Activity} title="Executive Summary" delay={0.1}>
                    <p className="text-lg text-slate-700 dark:text-slate-300 transition-colors">{result.message}</p>
                </Section>

                <div className="grid gap-6 md:grid-cols-2">
                    <Section icon={Briefcase} title="Business Overview" delay={0.2}>
                        <SkeletonBlock />
                    </Section>

                    <Section icon={Target} title="Competitors" delay={0.3}>
                        <SkeletonBlock />
                    </Section>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                    <Section icon={ShieldAlert} title="SWOT" delay={0.4}>
                        <SkeletonBlock />
                    </Section>
                    
                    <Section icon={LineChart} title="Sales Strategy" delay={0.5}>
                        <SkeletonBlock />
                    </Section>
                </div>

                <Section icon={Lightbulb} title="Opportunities" delay={0.6}>
                    <SkeletonBlock />
                </Section>
            </div>
        </motion.div>
    );
}

export default AccountPlan;