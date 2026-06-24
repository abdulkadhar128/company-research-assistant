import { useState, useEffect } from "react";
import { Rocket, Moon, Sun, Settings, History, Home, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' || 
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-6 py-4 backdrop-blur-xl transition-colors duration-300">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                
                {/* Logo & Name */}
                <div className="flex cursor-pointer items-center gap-3 group">
                    <motion.div 
                        whileHover={{ rotate: 10, scale: 1.05 }}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/20"
                    >
                        <Rocket size={20} />
                    </motion.div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
                        Company Research Assistant
                    </span>
                </div>

                {/* Navigation */}
                <nav className="hidden items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400 md:flex">
                    <a href="#" className="flex items-center gap-2 transition-colors hover:text-slate-900 dark:hover:text-white">
                        <Home size={16} /> Home
                    </a>
                    <a href="#" className="flex items-center gap-2 transition-colors hover:text-slate-900 dark:hover:text-white">
                        <History size={16} /> Research History
                    </a>
                    <a href="#" className="flex items-center gap-2 transition-colors hover:text-slate-900 dark:hover:text-white">
                        <Settings size={16} /> Settings
                    </a>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    >
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-800 sm:block"></div>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white">
                        <User size={16} />
                    </button>
                </div>

            </div>
        </header>
    );
}