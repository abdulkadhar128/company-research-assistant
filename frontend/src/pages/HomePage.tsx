import { useState } from "react";
import { motion } from "framer-motion";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ResearchProgress from "../components/ResearchProgress";
import AccountPlan from "../components/AccountPlan";
import Footer from "../components/Footer";

function HomePage() {
    const [result, setResult] = useState<any>(null);
    const [isResearching, setIsResearching] = useState(false);

    const handleResult = (data: any) => {
        setResult(data);
        setIsResearching(false);
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white selection:bg-indigo-100 dark:selection:bg-indigo-500/30 transition-colors duration-300">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden px-8 pt-16 pb-12 text-center">
                    {/* Animated Background Gradients */}
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 transition-colors duration-300"></div>
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.5, 0.3],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[400px] left-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[120px]" 
                    />
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2],
                            x: [0, 100, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[120px]" 
                    />

                    <div className="mx-auto max-w-4xl relative z-10">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl"
                        >
                            AI-Powered Platform
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mx-auto mb-10 max-w-2xl text-xl text-slate-500 dark:text-slate-400"
                        >
                            Research companies using AI and generate professional account plans in seconds.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mx-auto flex max-w-4xl justify-center"
                        >
                            <SearchBar 
                                onSearchStart={() => setIsResearching(true)}
                                onResult={handleResult} 
                            />
                        </motion.div>
                    </div>
                </section>

                {/* Dashboard Layout */}
                <section className="mx-auto max-w-7xl px-8 py-10">
                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Left Panel: Progress */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-28">
                                <ResearchProgress 
                                    isResearching={isResearching} 
                                    hasResult={!!result} 
                                />
                            </div>
                        </div>

                        {/* Right Panel: Account Plan */}
                        <div className="lg:col-span-8">
                            <AccountPlan result={result} />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default HomePage;