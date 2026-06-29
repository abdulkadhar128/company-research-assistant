import { useState } from "react";
import { researchCompany, compareCompanies } from "../services/research";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
    onSearchStart: () => void;
    onResult: (data: any) => void;
}

function SearchBar({ onSearchStart, onResult }: SearchBarProps) {
    const [mode, setMode] = useState<"single" | "compare">("single");
    const [companyA, setCompanyA] = useState("");
    const [companyB, setCompanyB] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    async function handleSearch() {
        if (mode === "single") {
            if (!companyA.trim()) {
                alert("Please enter a company name.");
                return;
            }
            try {
                setLoading(true);
                onSearchStart();
                const result = await researchCompany(companyA);
                onResult(result);
            } catch (error) {
                console.error(error);
                alert("Failed to connect to the backend.");
            } finally {
                setLoading(false);
            }
        } else {
            if (!companyA.trim() || !companyB.trim()) {
                alert("Please enter both company names to compare.");
                return;
            }
            try {
                setLoading(true);
                onSearchStart();
                const result = await compareCompanies(companyA, companyB);
                onResult(result);
            } catch (error) {
                console.error(error);
                alert("Failed to connect to the backend.");
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div className="w-full max-w-4xl flex flex-col items-center gap-4">
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-inner select-none">
                <button
                    onClick={() => setMode("single")}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        mode === "single"
                            ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                    disabled={loading}
                >
                    Single Company
                </button>
                <button
                    onClick={() => setMode("compare")}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        mode === "compare"
                            ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                    disabled={loading}
                >
                    Compare Companies
                </button>
            </div>

            {/* Search Input Box */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className={`relative flex w-full items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 p-2.5 transition-all duration-300 border border-transparent dark:border-slate-800 ${
                    isFocused 
                        ? "shadow-2xl shadow-blue-500/20 ring-4 ring-blue-500/10 dark:ring-blue-500/20" 
                        : "shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/60 dark:shadow-none dark:hover:border-slate-700"
                }`}
            >
                <div className={`pl-4 transition-colors duration-300 ${isFocused ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500'}`}>
                    <Search size={24} />
                </div>
                
                {mode === "single" ? (
                    <input
                        value={companyA}
                        onChange={(e) => setCompanyA(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search Microsoft, Tesla, OpenAI..."
                        className="flex-1 bg-transparent px-2 py-4 text-xl font-medium text-slate-800 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
                        disabled={loading}
                    />
                ) : (
                    <div className="flex-1 flex items-center gap-2">
                        <input
                            value={companyA}
                            onChange={(e) => setCompanyA(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="Company A (e.g. Microsoft)"
                            className="flex-1 bg-transparent px-2 py-4 text-lg font-medium text-slate-800 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal min-w-0"
                            disabled={loading}
                        />
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-600 px-1 font-mono uppercase select-none shrink-0">vs</span>
                        <input
                            value={companyB}
                            onChange={(e) => setCompanyB(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Company B (e.g. Apple)"
                            className="flex-1 bg-transparent px-2 py-4 text-lg font-medium text-slate-800 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal min-w-0"
                            disabled={loading}
                        />
                    </div>
                )}

                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearch}
                    disabled={loading || !companyA.trim() || (mode === "compare" && !companyB.trim())}
                    className="group flex h-14 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 font-semibold text-white shadow-xl shadow-blue-500/30 transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-xl"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            <span className="hidden sm:inline">Researching</span>
                        </>
                    ) : (
                        <>
                            <span className="hidden sm:inline">Research</span>
                            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
}

export default SearchBar;