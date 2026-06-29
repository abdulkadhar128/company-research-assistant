from pydantic import BaseModel
from typing import List, Dict, Any

class ResearchRequest(BaseModel):
    company: str

class SWOTItem(BaseModel):
    statement: str
    evidence: str

class SWOTAnalysis(BaseModel):
    strengths: List[SWOTItem]
    weaknesses: List[SWOTItem]
    opportunities: List[SWOTItem]
    threats: List[SWOTItem]

class NewsItem(BaseModel):
    title: str
    source: str
    date: str
    url: str
    summary: str | None = None

class MarketShare(BaseModel):
    name: str
    share: int

class SentimentScore(BaseModel):
    sentiment: str
    score: int

class SWOTScores(BaseModel):
    strengths: int
    weaknesses: int
    opportunities: int
    threats: int

class Metrics(BaseModel):
    competitor_market_share: List[MarketShare] | None
    swot_scores: SWOTScores | None
    news_sentiment: List[SentimentScore] | None

class Source(BaseModel):
    title: str
    source_name: str
    url: str
    published_date: str | None = None
    content: str | None = None

class TimelineItem(BaseModel):
    year: str
    title: str
    description: str
    category: str
    source: Source | None = None

class AccountPlanDetails(BaseModel):
    company_overview: str
    products: List[str]
    stakeholders: List[str]
    challenges: List[str]
    opportunities: List[str]
    outreach_strategy: str

class AccountPlanOutput(BaseModel):
    official_website: str | None
    industry: str | None
    company_type: str | None
    founder: str | None
    executive_summary: str | None
    executive_summary_sources: List[Source]
    business_overview: str | None
    products_services: List[str]
    competitors: List[str]
    competitors_sources: List[Source]
    latest_news: List[NewsItem]
    news_sources: List[Source]
    swot: SWOTAnalysis | None
    swot_sources: List[Source]
    metrics: Metrics | None
    timeline: List[TimelineItem]
    timeline_sources: List[Source]
    account_plan: AccountPlanDetails
    account_plan_sources: List[Source]

class ResearchResponse(BaseModel):
    company: str
    status: str
    message: str | None = None
    data: AccountPlanOutput | None = None

class ComparisonRequest(BaseModel):
    company_a: str
    company_b: str

class ComparisonSection(BaseModel):
    company_a_val: str
    company_b_val: str
    comparison_synthesis: str
    sources: List[Source] = []

class CompanyComparisonOutput(BaseModel):
    company_a: str
    company_b: str
    overview: ComparisonSection
    market_position: ComparisonSection
    swot: ComparisonSection
    competitors: ComparisonSection
    growth_potential: ComparisonSection
    timeline: ComparisonSection
    opportunities: ComparisonSection
    risks: ComparisonSection

class ComparisonResponse(BaseModel):
    status: str
    message: str | None = None
    data: CompanyComparisonOutput | None = None