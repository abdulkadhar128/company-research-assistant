import { 
    Building2, FileText, Target, Activity, 
    Lightbulb, ShieldAlert, LineChart, Briefcase, Rocket, Globe, Newspaper, ArrowRight, History, User,
    Sparkles, Coins, TrendingUp, Handshake, Award, Flag, Cpu
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { ResearchResponse, Source } from "../services/research";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis,
    PieChart, Pie, Cell
} from "recharts";

interface Props {
    result: ResearchResponse | null;
}

function Section({ icon: Icon, title, children, delay, className = "" }: { icon: any, title: string, children: React.ReactNode, delay: number, className?: string }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`group mt-6 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md dark:shadow-none h-full ${className}`}
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

function SourcesList({ sources }: { sources?: Source[] }) {
    if (!sources || sources.length === 0) return null;
    
    return (
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 select-none">
                <Globe size={11} className="text-slate-400" />
                <span>Sources & Citations</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
                {sources.map((src, i) => {
                    const cleanDomain = src.source_name;
                    return (
                        <a 
                            key={i} 
                            href={src.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-start gap-2.5 p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 hover:border-blue-200 dark:hover:border-blue-900/30 transition-all duration-200 group"
                        >
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                                <Globe size={11} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {src.title}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                    <span className="truncate">{cleanDomain}</span>
                                    {src.published_date && (
                                        <>
                                            <span>•</span>
                                            <span>{src.published_date}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

function UnavailablePlaceholder({ message = "Information unavailable" }: { message?: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 my-2">
            <ShieldAlert className="text-slate-400 dark:text-slate-600 mb-2.5" size={24} />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {message}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 select-none">
                No verified source documents were found containing this information.
            </p>
        </div>
    );
}

function isUnavailable(val: any): boolean {
    if (!val) return true;
    if (typeof val === 'string' && val.trim().toLowerCase() === 'information unavailable') {
        return true;
    }
    return false;
}

interface ComparisonProps {
    result: any;
}

function CompanyComparisonDashboard({ result }: ComparisonProps) {
    if (result.status === "error" || !result.data) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-red-200/60 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-8 shadow-xl shadow-red-200/40 dark:shadow-none transition-colors duration-300"
            >
                <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="text-red-500" size={24} />
                    <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Comparison Failed</h2>
                </div>
                <p className="text-red-600 dark:text-red-300">{result.message}</p>
            </motion.div>
        );
    }

    const { data } = result;
    const { company_a, company_b } = data;

    function ComparisonSectionCard({ 
        icon: Icon, 
        title, 
        sectionData, 
        delay 
    }: { 
        icon: any; 
        title: string; 
        sectionData: any;
        delay: number;
    }) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay, duration: 0.5 }}
                className="group mt-6 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md dark:shadow-none"
            >
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-6 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-slate-100">{title}</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-5 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-900/30">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 select-none">
                                {company_a}
                            </h4>
                            <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                                {sectionData.company_a_val}
                            </div>
                        </div>

                        <div className="p-5 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-900/30">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 select-none">
                                {company_b}
                            </h4>
                            <div className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                                {sectionData.company_b_val}
                            </div>
                        </div>
                    </div>

                    {sectionData.comparison_synthesis && (
                        <div className="p-5 rounded-xl border border-blue-100/50 dark:border-blue-900/30 bg-gradient-to-r from-blue-50/30 to-indigo-50/30 dark:from-blue-950/10 dark:to-indigo-950/10">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 select-none">
                                <Sparkles size={14} />
                                <span>AI Comparison Synthesis</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                {sectionData.comparison_synthesis}
                            </p>
                        </div>
                    )}

                    <SourcesList sources={sectionData.sources} />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300"
        >
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {company_a} <span className="text-slate-400 dark:text-slate-600 font-medium">vs</span> {company_b}
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-3">
                        <span className="flex w-max items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-700 dark:text-blue-400">
                            <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                            Side-by-Side Comparison Complete
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-2 space-y-6">
                <ComparisonSectionCard 
                    icon={Building2} 
                    title="Overview Comparison" 
                    sectionData={data.overview} 
                    delay={0.1} 
                />
                <ComparisonSectionCard 
                    icon={Activity} 
                    title="Market Position" 
                    sectionData={data.market_position} 
                    delay={0.15} 
                />
                <ComparisonSectionCard 
                    icon={ShieldAlert} 
                    title="SWOT Comparison" 
                    sectionData={data.swot} 
                    delay={0.2} 
                />
                <ComparisonSectionCard 
                    icon={Target} 
                    title="Competitor Analysis" 
                    sectionData={data.competitors} 
                    delay={0.25} 
                />
                <ComparisonSectionCard 
                    icon={TrendingUp} 
                    title="Growth Potential" 
                    sectionData={data.growth_potential} 
                    delay={0.3} 
                />
                <ComparisonSectionCard 
                    icon={History} 
                    title="Timeline Comparison" 
                    sectionData={data.timeline} 
                    delay={0.35} 
                />
                <ComparisonSectionCard 
                    icon={Lightbulb} 
                    title="Opportunities" 
                    sectionData={data.opportunities} 
                    delay={0.4} 
                />
                <ComparisonSectionCard 
                    icon={ShieldAlert} 
                    title="Risks" 
                    sectionData={data.risks} 
                    delay={0.45} 
                />
            </div>
        </motion.div>
    );
}

function AccountPlan({ result }: Props) {
    const [logoError, setLogoError] = useState(false);

    useEffect(() => {
        setLogoError(false);
    }, [result?.company]);

    if (result && result.is_comparison) {
        return <CompanyComparisonDashboard result={result} />;
    }

    if (!result) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full min-h-[600px] flex-col rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300"
            >
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-8 border border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-sm text-rose-500 dark:text-rose-400">
                        <Rocket size={20} />
                    </div>
                    <h2 className="mb-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-white transition-colors">
                        Start researching a company
                    </h2>
                    <p className="mb-6 max-w-md text-base text-slate-600 dark:text-slate-400 transition-colors">
                        Enter a company name to generate an AI-powered account plan.
                    </p>
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="rounded-xl bg-slate-900 dark:bg-slate-800 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-slate-800 dark:hover:bg-slate-700 hover:shadow-lg dark:hover:shadow-none"
                    >
                        Start Research
                    </button>
                </div>
            </motion.div>
        );
    }

    if (result.status === "error" || !result.data) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-3xl border border-red-200/60 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-8 shadow-xl shadow-red-200/40 dark:shadow-none transition-colors duration-300"
            >
                <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="text-red-500" size={24} />
                    <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Research Failed</h2>
                </div>
                <p className="text-red-600 dark:text-red-300">{result.message}</p>
            </motion.div>
        );
    }

    const { data } = result;

    const domain = data.official_website 
        ? data.official_website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]
        : `${result.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
        
    const logoUrl = `https://logo.clearbit.com/${domain}`;

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
                    <div className="mt-4 flex flex-wrap gap-3">
                        <span className="flex w-max items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                            Research Complete
                        </span>
                        {data.official_website && (
                            <a href={data.official_website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                                <Globe size={14} /> Website
                            </a>
                        )}
                        {data.founder && (
                            <span className="flex items-center gap-1.5 rounded-full bg-violet-50 dark:bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-700 dark:text-violet-400">
                                <User size={14} /> {data.founder}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                    {!logoError ? (
                        <img 
                            src={logoUrl} 
                            alt={`${result.company} logo`} 
                            className="h-full w-full object-contain p-2"
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <Building2 size={32} />
                    )}
                </div>
            </div>

            <div className="mt-2 space-y-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="mt-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-sm text-indigo-500 dark:text-indigo-400">
                            <Activity size={18} />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">Executive Summary</h3>
                    </div>
                    {isUnavailable(data.executive_summary) ? (
                        <UnavailablePlaceholder message="Executive Summary is unavailable." />
                    ) : (
                        <>
                            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 transition-colors">
                                {data.executive_summary}
                            </p>
                            <SourcesList sources={data.executive_summary_sources} />
                        </>
                    )}
                </motion.div>

                {data.timeline && data.timeline.length > 0 && (() => {
                    interface EventDetail {
                        title: string;
                        description: string;
                        category?: string;
                        source?: Source;
                    }

                    const getCategoryIcon = (category?: string) => {
                        switch (category?.toLowerCase()) {
                            case 'founded':
                                return <Flag className="w-4 h-4 text-amber-500" />;
                            case 'product':
                            case 'product launch':
                                return <Rocket className="w-4 h-4 text-sky-500" />;
                            case 'acquisition':
                                return <Handshake className="w-4 h-4 text-emerald-500" />;
                            case 'leadership':
                                return <User className="w-4 h-4 text-violet-500" />;
                            case 'financial':
                            case 'financial milestone':
                                return <Coins className="w-4 h-4 text-yellow-500" />;
                            case 'ai':
                            case 'ai innovation':
                            case 'ai / technology':
                                return <Sparkles className="w-4 h-4 text-purple-500" />;
                            case 'expansion':
                                return <Globe className="w-4 h-4 text-indigo-500" />;
                            case 'partnership':
                                return <ArrowRight className="w-4 h-4 text-blue-500" />;
                            default:
                                return <Briefcase className="w-4 h-4 text-blue-500" />;
                        }
                    };

                    const getCategoryBadgeClasses = (category?: string) => {
                        const base = "inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ";
                        switch (category?.toLowerCase()) {
                            case 'founded':
                                return base + "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-700/10 dark:ring-amber-500/20";
                            case 'product':
                            case 'product launch':
                                return base + "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 ring-sky-700/10 dark:ring-sky-500/20";
                            case 'acquisition':
                                return base + "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-emerald-700/10 dark:ring-emerald-500/20";
                            case 'leadership':
                                return base + "bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 ring-violet-700/10 dark:ring-violet-500/20";
                            case 'financial':
                            case 'financial milestone':
                                return base + "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 ring-yellow-700/10 dark:ring-yellow-500/20";
                            case 'ai':
                            case 'ai innovation':
                            case 'ai / technology':
                                return base + "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 ring-purple-700/10 dark:ring-purple-500/20";
                            case 'expansion':
                                return base + "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 ring-indigo-700/10 dark:ring-indigo-500/20";
                            case 'partnership':
                                return base + "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 ring-blue-700/10 dark:ring-blue-500/20";
                            default:
                                return base + "bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 ring-slate-700/10 dark:ring-slate-500/20";
                        }
                    };

                    const grouped: { [year: number]: EventDetail[] } = {};
                    data.timeline.forEach((item) => {
                        const yr = parseInt(item.year);
                        if (isNaN(yr)) return;
                        if (!grouped[yr]) {
                            grouped[yr] = [];
                        }
                        grouped[yr].push({
                            title: item.title || "Milestone",
                            description: item.description || item.event || "",
                            category: item.category,
                            source: item.source
                        });
                    });

                    const eventYears = Object.keys(grouped).map(Number).sort((a, b) => a - b);
                    if (eventYears.length === 0 || isUnavailable(data.timeline[0]?.description) || isUnavailable(data.timeline[0]?.title)) {
                        return (
                            <Section icon={History} title="Company Timeline" delay={0.25}>
                                <UnavailablePlaceholder message="Timeline is unavailable." />
                            </Section>
                        );
                    }

                    const minYear = eventYears[0];
                    const maxYear = eventYears[eventYears.length - 1];
                    const span = Math.max(maxYear - minYear, 1);

                    // Interval rules:
                    // - 0-10 years: 2-year intervals
                    // - 11-30 years: 4-year intervals
                    // - 31-70 years: 10-year intervals
                    // - >70 years: 20-year intervals
                    const interval = span <= 10 ? 2 : span <= 30 ? 4 : span <= 70 ? 10 : 20;

                    // Generate axis ticks: always include minYear, interval-aligned ticks, and maxYear
                    const ticksSet = new Set<number>();
                    ticksSet.add(minYear);
                    let t = Math.ceil(minYear / interval) * interval;
                    while (t < maxYear) {
                        if (t > minYear) ticksSet.add(t);
                        t += interval;
                    }
                    ticksSet.add(maxYear);

                    // Union ticks and eventYears to get all displayed years on timeline
                    const displayYearsSet = new Set<number>();
                    ticksSet.forEach(y => displayYearsSet.add(y));
                    eventYears.forEach(y => displayYearsSet.add(y));
                    const displayYears = Array.from(displayYearsSet).sort((a, b) => a - b);

                    return (
                        <Section icon={History} title="Company Timeline" delay={0.25}>
                            <div className="relative mt-4 pl-2 md:pl-0">
                                <div className="flex flex-col gap-0">
                                    {displayYears.map((yr, idx) => {
                                        const isLast = idx === displayYears.length - 1;
                                        const hasEvents = !!grouped[yr] && grouped[yr].length > 0;
                                        const isLatestYear = yr === maxYear;
                                        
                                        return (
                                            <div key={yr} className="grid grid-cols-[30px_1fr] md:grid-cols-[100px_40px_1fr] items-start relative group/row">
                                                {/* Year - Desktop only (left side) */}
                                                <div className="hidden md:flex justify-end pr-4 pt-3 font-mono text-sm font-semibold tracking-tight select-none">
                                                    <span className={isLatestYear ? "text-emerald-500 font-bold" : "text-slate-400 dark:text-slate-500"}>
                                                        {yr}
                                                    </span>
                                                </div>

                                                {/* Node Column */}
                                                <div className="relative flex justify-center items-stretch self-stretch w-full min-h-[90px]">
                                                    {/* Vertical line segment */}
                                                    {!isLast && (
                                                        <div className="absolute top-[24px] bottom-0 left-1/2 w-[2px] bg-slate-200 dark:bg-slate-800/80 -translate-x-1/2" />
                                                    )}
                                                    {idx > 0 && (
                                                        <div className="absolute top-0 h-[24px] left-1/2 w-[2px] bg-slate-200 dark:bg-slate-800/80 -translate-x-1/2" />
                                                    )}

                                                    {/* Dot Node */}
                                                    <div className="absolute top-[16px] z-10 flex items-center justify-center">
                                                        {hasEvents ? (
                                                            isLatestYear ? (
                                                                <div className="relative flex h-5 w-5 items-center justify-center">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white dark:border-slate-900 shadow-md"></span>
                                                                </div>
                                                            ) : (
                                                                <div className="h-3.5 w-3.5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 shadow-md ring-2 ring-blue-500/10 group-hover/row:scale-110 transition-transform duration-200" />
                                                            )
                                                        ) : (
                                                            <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 ring-2 ring-transparent group-hover/row:bg-slate-400 dark:group-hover/row:bg-slate-500 transition-colors duration-200" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Card/Content Column */}
                                                <div className="pb-8 pl-4 md:pl-6 flex flex-col justify-start">
                                                    {/* Year - Mobile/Tablet only */}
                                                    <div className="md:hidden flex items-center gap-2 mb-2 font-mono text-sm font-bold text-blue-500 dark:text-blue-400">
                                                        <span>{yr}</span>
                                                        {isLatestYear && (
                                                            <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                                                                Latest
                                                            </span>
                                                        )}
                                                    </div>

                                                    {hasEvents ? (
                                                        <div className="w-full max-w-[640px] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 shadow-sm hover:shadow-md dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 ease-in-out hover:-translate-y-0.5 group/card relative backdrop-blur-sm">
                                                            {/* Horizontal connector line (desktop only) */}
                                                            <div className="hidden md:block absolute top-[24px] -left-[44px] w-[44px] h-[1.5px] bg-slate-200 dark:bg-slate-800/80 group-hover/card:bg-slate-300 dark:group-hover/card:bg-slate-700 transition-colors" />

                                                            {isLatestYear && (
                                                                <div className="absolute top-4 right-4 hidden md:block">
                                                                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                                                                        Latest
                                                                    </span>
                                                                </div>
                                                            )}

                                                            <div className="space-y-4">
                                                                {grouped[yr].map((eventItem, evIdx) => (
                                                                    <div key={evIdx} className={evIdx > 0 ? "pt-4 border-t border-slate-100 dark:border-slate-800/60" : ""}>
                                                                        <div className="flex items-start gap-2.5">
                                                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 mt-0.5">
                                                                                {getCategoryIcon(eventItem.category)}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="flex flex-wrap items-center gap-2">
                                                                                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                                                        {eventItem.title}
                                                                                    </h4>
                                                                                    {eventItem.category && (
                                                                                        <span className={getCategoryBadgeClasses(eventItem.category)}>
                                                                                            {eventItem.category}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                                                    {eventItem.description}
                                                                                </p>
                                                                                {eventItem.source && (
                                                                                    <div className="mt-2.5 flex items-center justify-end select-none">
                                                                                        <a 
                                                                                            href={eventItem.source.url} 
                                                                                            target="_blank" 
                                                                                            rel="noopener noreferrer" 
                                                                                            className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
                                                                                        >
                                                                                            <Globe size={10} className="opacity-75" />
                                                                                            <span className="truncate max-w-[150px]">{eventItem.source.source_name}</span>
                                                                                        </a>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="md:hidden flex items-center h-[36px] font-mono text-xs font-semibold text-slate-400 dark:text-slate-600 select-none">
                                                            {yr}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <SourcesList sources={data.timeline_sources} />
                            </div>
                        </Section>
                    );
                })()}

                {data.metrics && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
                        {data.metrics.competitor_market_share && data.metrics.competitor_market_share.length > 0 && (
                            <Section icon={Target} title="Competitor Market Share" delay={0.4}>
                                <div className="h-64 w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.metrics.competitor_market_share}>
                                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                            <XAxis dataKey="name" tick={{fill: '#888', fontSize: 12}} />
                                            <YAxis tick={{fill: '#888', fontSize: 12}} />
                                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'rgba(255,255,255,0.95)' }} />
                                            <Bar dataKey="share" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Section>
                        )}
                        
                        {data.metrics.swot_scores && (
                            <Section icon={Activity} title="SWOT Radar" delay={0.45}>
                                <div className="h-64 w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart 
                                            cx="50%" cy="50%" outerRadius="70%" 
                                            data={[
                                                { subject: 'Strengths', A: data.metrics.swot_scores.strengths },
                                                { subject: 'Weaknesses', A: data.metrics.swot_scores.weaknesses },
                                                { subject: 'Opportunities', A: data.metrics.swot_scores.opportunities },
                                                { subject: 'Threats', A: data.metrics.swot_scores.threats }
                                            ]}
                                        >
                                            <PolarGrid opacity={0.2} />
                                            <PolarAngleAxis dataKey="subject" tick={{fill: '#888', fontSize: 12}} />
                                            <Radar name="SWOT" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Section>
                        )}

                        {data.metrics.news_sentiment && data.metrics.news_sentiment.length > 0 && (
                            <Section icon={Newspaper} title="News Sentiment" delay={0.5}>
                                <div className="h-64 w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data.metrics.news_sentiment}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="score"
                                                nameKey="sentiment"
                                            >
                                                {data.metrics.news_sentiment.map((entry, index) => {
                                                    const COLORS = {
                                                        'Positive': '#10b981',
                                                        'Neutral': '#94a3b8',
                                                        'Negative': '#f43f5e'
                                                    };
                                                    return <Cell key={`cell-${index}`} fill={COLORS[entry.sentiment as keyof typeof COLORS] || '#8884d8'} />;
                                                })}
                                            </Pie>
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Section>
                        )}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 items-stretch">
                    <Section icon={Briefcase} title="Business Overview" delay={0.2}>
                        <p>{data.business_overview || "Not found."}</p>
                    </Section>

                    <Section icon={Target} title="Competitors" delay={0.3}>
                        {isUnavailable(data.competitors?.[0]) || !data.competitors || data.competitors.length === 0 ? (
                            <UnavailablePlaceholder message="Competitors information is unavailable." />
                        ) : (
                            <>
                                <ul className="list-disc pl-5 space-y-2">
                                    {data.competitors.map((comp, i) => (
                                        <li key={i}>{comp}</li>
                                    ))}
                                </ul>
                                <SourcesList sources={data.competitors_sources} />
                            </>
                        )}
                    </Section>
                </div>
                
                <Section icon={Lightbulb} title="Products & Services" delay={0.35}>
                    {data.products_services && data.products_services.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {data.products_services.map((prod, i) => (
                                <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
                                    {prod}
                                </span>
                            ))}
                        </div>
                    ) : "None found."}
                </Section>
                
                <Section icon={Newspaper} title="Latest News" delay={0.38}>
                    {isUnavailable(data.latest_news?.[0]?.title) || !data.latest_news || data.latest_news.length === 0 ? (
                        <UnavailablePlaceholder message="Latest News is unavailable." />
                    ) : (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {data.latest_news.map((newsItem, i) => {
                                    const isString = typeof newsItem === 'string';
                                    const title = isString ? newsItem : newsItem.title;
                                    const source = isString ? null : newsItem.source;
                                    const date = isString ? null : newsItem.date;
                                    
                                    let url = isString ? null : newsItem.url;
                                    if (url && !url.startsWith('http')) {
                                        url = `https://${url}`;
                                    }

                                    return (
                                        <div key={i} className="flex flex-col rounded-2xl bg-[#f4f4f5] dark:bg-slate-800/50 p-6 border border-slate-100 dark:border-slate-800 transition-colors h-full">
                                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 leading-snug">{title}</h4>
                                            {!isString && newsItem.summary && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                                    {newsItem.summary}
                                                </p>
                                            )}
                                            <div className="flex flex-col gap-1 mt-auto">
                                                {source && <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{source}</p>}
                                                {date && <p className="text-sm text-slate-400 dark:text-slate-500 mb-3">{date}</p>}
                                                {url && (
                                                    <a href={url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 w-max">
                                                        Read Article <ArrowRight size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <SourcesList sources={data.news_sources} />
                        </>
                    )}
                </Section>

                <div className="grid gap-6 md:grid-cols-2 items-stretch">
                    <Section icon={ShieldAlert} title="SWOT Analysis" delay={0.4}>
                        {!data.swot || isUnavailable(data.swot.strengths?.[0]) ? (
                            <UnavailablePlaceholder message="SWOT Analysis is unavailable." />
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Strengths</span>
                                        <ul className="mt-2 space-y-3.5">
                                            {data.swot.strengths.map((item, i) => {
                                                const isString = typeof item === 'string';
                                                const stmt = isString ? item : item.statement;
                                                const ev = isString ? null : item.evidence;
                                                return (
                                                    <li key={i} className="text-sm">
                                                        <div className="font-medium text-slate-800 dark:text-slate-200">{stmt}</div>
                                                        {ev && (
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-2.5 border-l border-slate-200 dark:border-slate-800 italic leading-relaxed">
                                                                {ev}
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-rose-600 dark:text-rose-400">Weaknesses</span>
                                        <ul className="mt-2 space-y-3.5">
                                            {data.swot.weaknesses.map((item, i) => {
                                                const isString = typeof item === 'string';
                                                const stmt = isString ? item : item.statement;
                                                const ev = isString ? null : item.evidence;
                                                return (
                                                    <li key={i} className="text-sm">
                                                        <div className="font-medium text-slate-800 dark:text-slate-200">{stmt}</div>
                                                        {ev && (
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-2.5 border-l border-slate-200 dark:border-slate-800 italic leading-relaxed">
                                                                {ev}
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-blue-600 dark:text-blue-400">Opportunities</span>
                                        <ul className="mt-2 space-y-3.5">
                                            {data.swot.opportunities.map((item, i) => {
                                                const isString = typeof item === 'string';
                                                const stmt = isString ? item : item.statement;
                                                const ev = isString ? null : item.evidence;
                                                return (
                                                    <li key={i} className="text-sm">
                                                        <div className="font-medium text-slate-800 dark:text-slate-200">{stmt}</div>
                                                        {ev && (
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-2.5 border-l border-slate-200 dark:border-slate-800 italic leading-relaxed">
                                                                {ev}
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-semibold text-orange-600 dark:text-orange-400">Threats</span>
                                        <ul className="mt-2 space-y-3.5">
                                            {data.swot.threats.map((item, i) => {
                                                const isString = typeof item === 'string';
                                                const stmt = isString ? item : item.statement;
                                                const ev = isString ? null : item.evidence;
                                                return (
                                                    <li key={i} className="text-sm">
                                                        <div className="font-medium text-slate-800 dark:text-slate-200">{stmt}</div>
                                                        {ev && (
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-2.5 border-l border-slate-200 dark:border-slate-800 italic leading-relaxed">
                                                                {ev}
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                                <SourcesList sources={data.swot_sources} />
                            </>
                        )}
                    </Section>
                </div>

                {data.account_plan && typeof data.account_plan === 'object' && Object.keys(data.account_plan).length > 0 && (
                    data.account_plan.company_overview || data.account_plan.products?.length > 0
                ) ? (
                    <Section icon={FileText} title="Account Plan" delay={0.6}>
                        {isUnavailable(data.account_plan.company_overview) ? (
                            <UnavailablePlaceholder message="Account Plan is unavailable." />
                        ) : (
                            <>
                                <div className="rounded-2xl bg-[#f4f4f5] dark:bg-slate-800/50 p-6 font-mono text-sm text-slate-800 dark:text-slate-300 shadow-sm transition-colors">
                                    <div className="space-y-6">
                                        {data.account_plan.company_overview && (
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Company Overview</div>
                                                <div className="opacity-90">{data.account_plan.company_overview}</div>
                                            </div>
                                        )}
                                        {data.account_plan.products?.length > 0 && (
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Products</div>
                                                <ul className="list-disc pl-5 opacity-90 space-y-1">
                                                    {data.account_plan.products.map((p: string, i: number) => <li key={i}>{p}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        {data.account_plan.stakeholders?.length > 0 && (
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Stakeholders</div>
                                                <ul className="list-disc pl-5 opacity-90 space-y-1">
                                                    {data.account_plan.stakeholders.map((p: string, i: number) => <li key={i}>{p}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        {data.account_plan.challenges?.length > 0 && (
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Challenges</div>
                                                <ul className="list-disc pl-5 opacity-90 space-y-1">
                                                    {data.account_plan.challenges.map((p: string, i: number) => <li key={i}>{p}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        {data.account_plan.opportunities?.length > 0 && (
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Opportunities</div>
                                                <ul className="list-disc pl-5 opacity-90 space-y-1">
                                                    {data.account_plan.opportunities.map((p: string, i: number) => <li key={i}>{p}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        {data.account_plan.outreach_strategy && (
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Outreach Strategy</div>
                                                <div className="opacity-90">{data.account_plan.outreach_strategy}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <SourcesList sources={data.account_plan_sources} />
                            </>
                        )}
                    </Section>
                ) : (
                    <Section icon={FileText} title="Account Plan" delay={0.6}>
                        <p className="text-slate-500 dark:text-slate-400 italic">
                            Account plan not yet generated for this result. Please run a new search to generate a full enterprise account plan.
                        </p>
                    </Section>
                )}
            </div>
        </motion.div>
    );
}

export default AccountPlan;