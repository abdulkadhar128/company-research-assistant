import { api } from "./api";

export interface SWOTAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface AccountPlanData {
    official_website: string | null;
    executive_summary: string | null;
    business_overview: string | null;
    products_services: string[];
    competitors: string[];
    latest_news: string[];
    swot: SWOTAnalysis | null;
    sales_strategy: string | null;
    account_plan: string | null;
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