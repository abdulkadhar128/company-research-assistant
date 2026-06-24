import { motion } from "framer-motion";
import { Search, Clock, Target, RefreshCw } from "lucide-react";

export default function DashboardStats() {
    const stats = [
        { label: "Companies Researched", value: "125", icon: Search },
        { label: "Research Time", value: "8 sec", icon: Clock },
        { label: "AI Confidence", value: "98%", icon: Target },
        { label: "Latest Update", value: "Just Now", icon: RefreshCw },
    ];

    return (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors duration-300"
                >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
