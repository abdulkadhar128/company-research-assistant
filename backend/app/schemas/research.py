from pydantic import BaseModel
from typing import List, Dict, Any

class ResearchRequest(BaseModel):
    company: str

class SWOTAnalysis(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]

class AccountPlanOutput(BaseModel):
    official_website: str | None
    executive_summary: str | None
    business_overview: str | None
    products_services: List[str]
    competitors: List[str]
    latest_news: List[str]
    swot: SWOTAnalysis | None
    sales_strategy: str | None
    account_plan: str | None

class ResearchResponse(BaseModel):
    company: str
    status: str
    message: str | None = None
    data: AccountPlanOutput | None = None