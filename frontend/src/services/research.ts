import { api } from "./api";

export interface ResearchResponse {
    company: string;
    status: string;
    message: string;
}

export async function researchCompany(
    company: string
): Promise<ResearchResponse> {
    const response = await api.post("/api/v1/research/", {
        company,
    });

    return response.data;
}