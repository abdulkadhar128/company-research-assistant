from pydantic import BaseModel
from typing import List, Dict, Any

class ResearchRequest(BaseModel):
    company: str

class SWOTAnalysis(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]

class NewsItem(BaseModel):
    title: str
    source: str
    date: str
    url: str

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

class TimelineItem(BaseModel):
    year: str
    event: str

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
    business_overview: str | None
    products_services: List[str]
    competitors: List[str]
    latest_news: List[NewsItem]
    swot: SWOTAnalysis | None
    metrics: Metrics | None
    timeline: List[TimelineItem]
    account_plan: AccountPlanDetails

class ResearchResponse(BaseModel):
    company: str
    status: str
    message: str | None = None
    data: AccountPlanOutput | None = None