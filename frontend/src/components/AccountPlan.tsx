import { 
    Building2, FileText, Target, Activity, 
    Lightbulb, ShieldAlert, LineChart, Briefcase, Rocket, Globe, Newspaper
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { ResearchResponse } from "../services/research";

interface Props {
    result: ResearchResponse | null;
}

function Section({ icon: Icon, title, children, delay }: { icon: any, title: string, children: React.ReactNode, delay: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="group mt-6 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md dark:shadow-none h-full"
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

function AccountPlan({ result }: Props) {
    const [logoError, setLogoError] = useState(false);

    // Reset logo error when company changes
    useEffect(() => {
        setLogoError(false);
    }, [result?.company]);

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

    // Use clearbit if we have an official website, else fallback to company name heuristc
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
                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 transition-colors">
                        {data.executive_summary || "No executive summary available."}
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 items-stretch">
                    <Section icon={Briefcase} title="Business Overview" delay={0.2}>
                        <p>{data.business_overview || "Not found."}</p>
                    </Section>

                    <Section icon={Target} title="Competitors" delay={0.3}>
                        {data.competitors && data.competitors.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2">
                                {data.competitors.map((comp, i) => (
                                    <li key={i}>{comp}</li>
                                ))}
                            </ul>
                        ) : "None found."}
                    </Section>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 items-stretch">
                    <Section icon={Lightbulb} title="Products & Services" delay={0.35}>
                        {data.products_services && data.products_services.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2">
                                {data.products_services.map((prod, i) => (
                                    <li key={i}>{prod}</li>
                                ))}
                            </ul>
                        ) : "None found."}
                    </Section>
                    
                    <Section icon={Newspaper} title="Latest News" delay={0.38}>
                        {data.latest_news && data.latest_news.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2">
                                {data.latest_news.map((news, i) => (
                                    <li key={i}>{news}</li>
                                ))}
                            </ul>
                        ) : "None found."}
                    </Section>
                </div>

                <div className="grid gap-6 md:grid-cols-2 items-stretch">
                    <Section icon={ShieldAlert} title="SWOT Analysis" delay={0.4}>
                        {data.swot ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Strengths</span>
                                    <ul className="list-disc pl-4 mt-1 text-sm">
                                        {data.swot.strengths.map((s,i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <span className="font-semibold text-rose-600 dark:text-rose-400">Weaknesses</span>
                                    <ul className="list-disc pl-4 mt-1 text-sm">
                                        {data.swot.weaknesses.map((s,i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">Opportunities</span>
                                    <ul className="list-disc pl-4 mt-1 text-sm">
                                        {data.swot.opportunities.map((s,i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <span className="font-semibold text-orange-600 dark:text-orange-400">Threats</span>
                                    <ul className="list-disc pl-4 mt-1 text-sm">
                                        {data.swot.threats.map((s,i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            </div>
                        ) : "Not available."}
                    </Section>
                    
                    <Section icon={LineChart} title="Sales Strategy" delay={0.5}>
                        <p>{data.sales_strategy || "Not found."}</p>
                    </Section>
                </div>

                <Section icon={FileText} title="Account Plan" delay={0.6}>
                    <div className="whitespace-pre-wrap">{data.account_plan || "Not available."}</div>
                </Section>
            </div>
        </motion.div>
    );
}

export default AccountPlan;