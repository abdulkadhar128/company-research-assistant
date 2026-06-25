import json
from openai import OpenAI
from app.core.config import settings
from app.schemas.research import AccountPlanOutput

client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)

def generate_account_plan(company_name: str, tavily_data: dict, firecrawl_data: str) -> AccountPlanOutput | None:
    system_prompt = f"""
    You are an expert enterprise sales researcher.
    Your task is to analyze the provided search and scraped data for '{company_name}' and generate a structured account plan.
    Extract the official website, industry, company type, founder(s), executive summary, business overview, products & services, competitors, latest news, and a SWOT analysis.
    
    CRITICAL INSTRUCTIONS FOR METRICS, NEWS, TIMELINE & ACCOUNT PLAN:
    - For `latest_news`, use ONLY the news items provided in the Tavily search data. Use the `published_date` field from each result as the `date` (format as YYYY-MM-DD). Use the `url` directly as provided. Do NOT fabricate, guess, or use any dates from before 2025. The current year is 2026.
    - For `timeline`, provide 5-7 key milestones in the company's history. Start with the founding and major early events, then MUST include recent events from the `recent_events` field in the search data (2024, 2025, 2026). Use the `published_date` from recent_events to assign the correct year. The timeline must NOT end before 2024. Current year is 2026.
    - For `metrics`, estimate realistic numbers based on the data context:
      - `competitor_market_share`: Provide estimated market share percentages for the top competitors.
      - `swot_scores`: Provide a score out of 100 for the company's overall strength, weakness, opportunity, and threat levels.
      - `news_sentiment`: Estimate the distribution of recent news sentiment (Positive, Neutral, Negative) adding up to 100.
    - For `account_plan`, generate a highly specific B2B enterprise sales strategy including Company Overview, Products, Stakeholders, Challenges, Opportunities, and Outreach Strategy.
    
    If the website or other data is missing, make reasonable inferences based on the context provided, or leave it empty if unknown.
    """

    user_prompt = f"""
    Data gathered from Tavily Search:
    {json.dumps(tavily_data, indent=2)}
    
    Data gathered from Firecrawl (Official Website):
    {firecrawl_data}
    """

    try:
        response = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format=AccountPlanOutput,
        )

        return response.choices[0].message.parsed
    except Exception as e:
        print(f"OpenAI error for {company_name}: {e}")
        return None