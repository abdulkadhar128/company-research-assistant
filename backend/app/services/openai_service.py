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
    Extract the official website, executive summary, business overview, products & services, competitors, latest news, SWOT analysis, and a proposed sales strategy.
    
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