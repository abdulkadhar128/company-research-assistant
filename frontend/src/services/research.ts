import { api } from "./api";

export interface SWOTAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface NewsItem {
    title: string;
    source: string;
    date: string;
    url: string;
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
    event: string;
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
    business_overview: string | null;
    products_services: string[];
    competitors: string[];
    latest_news: NewsItem[];
    swot: SWOTAnalysis | null;
    metrics: Metrics | null;
    timeline: TimelineItem[] | null;
    account_plan: AccountPlanDetails | null;
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