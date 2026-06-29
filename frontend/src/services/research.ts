import { api } from "./api";

export interface SWOTItem {
    statement: string;
    evidence: string;
}

export interface SWOTAnalysis {
    strengths: SWOTItem[];
    weaknesses: SWOTItem[];
    opportunities: SWOTItem[];
    threats: SWOTItem[];
}

export interface NewsItem {
    title: string;
    source: string;
    date: string;
    url: string;
    summary?: string;
}

export interface MarketShare {
    name: string;
    share: number;
}

export interface SentimentScore {
    sentiment: string;
    score: number;
}

export interface SWOTScores {
    strengths: number;
    weaknesses: number;
    opportunities: number;
    threats: number;
}

export interface Metrics {
    competitor_market_share: MarketShare[] | null;
    swot_scores: SWOTScores | null;
    news_sentiment: SentimentScore[] | null;
}

export interface TimelineItem {
    year: string;
    title?: string;
    description?: string;
    category?: string;
    event?: string;
    source?: Source;
}

export interface Source {
    title: string;
    source_name: string;
    url: string;
    published_date?: string;
    content?: string;
}

export interface AccountPlanDetails {
    company_overview: string;
    products: string[];
    stakeholders: string[];
    challenges: string[];
    opportunities: string[];
    outreach_strategy: string;
}

export interface AccountPlanData {
    official_website: string | null;
    industry: string | null;
    company_type: string | null;
    executive_summary: string | null;
    executive_summary_sources: Source[];
    business_overview: string | null;
    products_services: string[];
    competitors: string[];
    competitors_sources: Source[];
    latest_news: NewsItem[];
    news_sources: Source[];
    swot: SWOTAnalysis | null;
    swot_sources: Source[];
    metrics: Metrics | null;
    timeline: TimelineItem[] | null;
    timeline_sources: Source[];
    account_plan: AccountPlanDetails | null;
    account_plan_sources: Source[];
}

export interface ResearchResponse {
    company: string;
    status: string;
    message: string | null;
    data?: AccountPlanData | null;
}

export async function researchCompany(
    company: string
): Promise<ResearchResponse> {
    const response = await api.post("/api/v1/research/", {
        company,
    });

    return response.data;
}

export interface ComparisonSection {
    company_a_val: string;
    company_b_val: string;
    comparison_synthesis: string;
    sources?: Source[];
}

export interface CompanyComparisonData {
    company_a: string;
    company_b: string;
    overview: ComparisonSection;
    market_position: ComparisonSection;
    swot: ComparisonSection;
    competitors: ComparisonSection;
    growth_potential: ComparisonSection;
    timeline: ComparisonSection;
    opportunities: ComparisonSection;
    risks: ComparisonSection;
}

export interface ComparisonResponse {
    status: string;
    message: string | null;
    data?: CompanyComparisonData | null;
    is_comparison?: boolean;
}

export async function compareCompanies(
    companyA: string,
    companyB: string
): Promise<ComparisonResponse> {
    const response = await api.post("/api/v1/research/compare", {
        company_a: companyA,
        company_b: companyB
    });
    if (response.data) {
        response.data.is_comparison = true;
    }
    return response.data;
}