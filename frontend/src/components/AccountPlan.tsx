import { 
    Building2, FileText, Target, Activity, 
    Lightbulb, ShieldAlert, LineChart, Briefcase, Rocket, Globe, Newspaper, ArrowRight, History, User
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { ResearchResponse } from "../services/research";
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

function AccountPlan({ result }: Props) {
    const [logoError, setLogoError] = useState(false);

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
                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 transition-colors">
                        {data.executive_summary || "No executive summary available."}
                    </p>
                </motion.div>

                {data.timeline && data.timeline.length > 0 && (() => {
                    const sorted = [...data.timeline]
                        .map(item => ({ ...item, yr: parseInt(item.year) }))
                        .filter(item => !isNaN(item.yr))
                        .sort((a, b) => a.yr - b.yr);

                    if (sorted.length === 0) return null;

                    const minYear = sorted[0].yr;
                    const maxYear = sorted[sorted.length - 1].yr;
                    const span = Math.max(maxYear - minYear, 1);

                    // Interval rules
                    const interval = span <= 10 ? 2 : span <= 30 ? 4 : span <= 70 ? 10 : 20;

                    // Generate axis ticks: always include minYear, interval-aligned ticks, and maxYear
                    const ticks: number[] = [minYear];
                    let t = Math.ceil(minYear / interval) * interval;
                    while (t < maxYear) {
                        if (t > minYear) ticks.push(t);
                        t += interval;
                    }
                    if (ticks[ticks.length - 1] !== maxYear) ticks.push(maxYear);

                    // Map a year to a % position across the axis (6% → 94%)
                    const toPct = (yr: number) => ((yr - minYear) / span) * 88 + 6;

                    return (
                        <Section icon={History} title="Company Timeline" delay={0.25}>
                            <div className="overflow-x-auto">
                                <div className="relative" style={{ height: '340px', minWidth: '420px' }}>

                                    {/* Horizontal axis */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '45%',
                                        left: '6%', right: '6%',
                                        height: '2px',
                                        borderRadius: '9999px',
                                        background: 'linear-gradient(90deg, #60a5fa, #818cf8, #60a5fa)',
                                        opacity: 0.65,
                                    }} />

                                    {/* Axis tick marks + year labels */}
                                    {ticks.map(tick => (
                                        <div key={tick} style={{ position: 'absolute', left: `${toPct(tick)}%`, top: '45%', transform: 'translateX(-50%)' }}>
                                            <div style={{ width: '1px', height: '10px', background: '#94a3b8', transform: 'translateY(-50%)', margin: '0 auto', opacity: 0.7 }} />
                                            <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', fontFamily: 'monospace', color: '#94a3b8', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
                                                {tick}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Events */}
                                    {sorted.map((item, i) => {
                                        const pos = toPct(item.yr);
                                        const isAbove = i % 2 === 0;
                                        // Edge-aware card anchoring
                                        const anchor = pos < 18 ? 'left' : pos > 82 ? 'right' : 'center';
                                        const cardStyle: React.CSSProperties = {
                                            position: 'absolute',
                                            width: '148px',
                                            ...(anchor === 'left'   ? { left: '0', transform: 'none' }
                                              : anchor === 'right'  ? { right: '0', transform: 'none' }
                                              : { left: '50%', transform: 'translateX(-50%)' }),
                                            ...(isAbove ? { bottom: '62px' } : { top: '62px' }),
                                        };

                                        return (
                                            <div key={i} style={{ position: 'absolute', left: `${pos}%`, top: '45%', transform: 'translateX(-50%)' }}>
                                                {/* Glowing dot */}
                                                <div style={{
                                                    position: 'absolute',
                                                    width: '13px', height: '13px',
                                                    borderRadius: '50%',
                                                    background: '#3b82f6',
                                                    boxShadow: '0 0 0 4px rgba(59,130,246,0.18), 0 0 10px rgba(59,130,246,0.35)',
                                                    transform: 'translate(-50%, -50%)',
                                                    zIndex: 10,
                                                }} />

                                                {/* Connector line */}
                                                <div style={{
                                                    position: 'absolute',
                                                    width: '1px', height: '48px',
                                                    background: 'linear-gradient(to ' + (isAbove ? 'top' : 'bottom') + ', rgba(99,102,241,0.5), transparent)',
                                                    left: '0', transform: 'translateX(-50%)',
                                                    ...(isAbove ? { bottom: '6px' } : { top: '6px' }),
                                                }} />

                                                {/* Event card */}
                                                <div style={cardStyle} className="rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-lg p-2.5">
                                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', marginBottom: '4px', fontFamily: 'monospace' }}>{item.year}</div>
                                                    <div style={{ fontSize: '11px', color: '', lineHeight: '1.4', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }} className="text-slate-600 dark:text-slate-300">{item.event}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
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
                        {data.competitors && data.competitors.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2">
                                {data.competitors.map((comp, i) => (
                                    <li key={i}>{comp}</li>
                                ))}
                            </ul>
                        ) : "None found."}
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
                    {data.latest_news && data.latest_news.length > 0 ? (
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
                    ) : "None found."}
                </Section>

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
                </div>

                {data.account_plan && typeof data.account_plan === 'object' && Object.keys(data.account_plan).length > 0 && (
                    data.account_plan.company_overview || data.account_plan.products?.length > 0
                ) ? (
                    <Section icon={FileText} title="Account Plan" delay={0.6}>
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