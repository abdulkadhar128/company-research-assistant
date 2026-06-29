import { Clock, Trash2, Building2 } from 'lucide-react';
import { useSavedAccounts } from '../store/useSavedAccounts';
import type { ResearchResponse } from '../services/research';

interface Props {
    onSelect: (result: ResearchResponse) => void;
}

export default function SavedAccounts({ onSelect }: Props) {
    const { accounts, removeAccount } = useSavedAccounts();

    if (accounts.length === 0) return null;

    return (
        <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-4 py-3">
                <Clock size={16} className="text-slate-400" />
                <h3 className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-300">Recent Searches</h3>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {accounts.map((account) => {
                    if (!account || !account.company) return null;
                    const domain = account.data?.official_website 
                        ? account.data.official_website.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]
                        : `${account.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
                    const logoUrl = `https://logo.clearbit.com/${domain}`;

                    return (
                        <div 
                            key={account.company}
                            className="group flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                            onClick={() => onSelect(account)}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-slate-800 text-slate-400 shadow-sm border border-slate-100 dark:border-slate-700">
                                    <img 
                                        src={logoUrl} 
                                        alt=""
                                        className="h-full w-full object-contain p-1"
                                        onError={(e) => {
                                            (e.target as HTMLElement).style.display = 'none';
                                            (e.target as HTMLElement).nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                    <Building2 size={16} className="hidden" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                                        {account.company}
                                    </span>
                                    {(!account.data?.account_plan || typeof account.data.account_plan !== 'object' || !(account.data.account_plan as any).company_overview) && (
                                        <span className="text-xs text-amber-500 dark:text-amber-400">Re-search for full plan</span>
                                    )}
                                </div>
                            </div>
                            
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeAccount(account.company);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all"
                                title="Remove from history"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
