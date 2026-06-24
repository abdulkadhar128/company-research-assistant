from fastapi import APIRouter
import openai
from app.services.tavily_service import research_company_tavily
from app.services.firecrawl_service import scrape_company_website
from app.services.openai_service import generate_account_plan

from app.schemas.research import (
    ResearchRequest,
    ResearchResponse,
    AccountPlanOutput
)

router = APIRouter(
    prefix="/api/v1/research",
    tags=["Research"],
)

# Simple in-memory cache to save API credits during testing
_research_cache = {}

@router.post("/", response_model=ResearchResponse)
async def research_company(request: ResearchRequest):
    company = request.company
    
    # Check cache first
    if company in _research_cache:
        return ResearchResponse(
            company=company,
            status="success",
            message="Loaded from cache",
            data=_research_cache[company]
        )

    try:
        # 1. Tavily Search
        tavily_data = research_company_tavily(company)
        
        # 2. Firecrawl Scrape (if website found)
        firecrawl_data = "No website found to scrape."
        website = tavily_data.get("official_website")
        if website:
            firecrawl_data = scrape_company_website(website)
            
        # 3. OpenAI Synthesis
        structured_data = generate_account_plan(company, tavily_data, firecrawl_data)
        
        if not structured_data:
            return ResearchResponse(
                company=company,
                status="error",
                message="Failed to generate structured data from OpenAI."
            )
            
        # Cache the result
        _research_cache[company] = structured_data

        return ResearchResponse(
            company=company,
            status="success",
            message="Research complete.",
            data=structured_data
        )

    except openai.RateLimitError:
        return ResearchResponse(
            company=company,
            status="error",
            message="Error: Your OpenAI API key has insufficient quota. Please check your billing details."
        )
    except openai.AuthenticationError:
        return ResearchResponse(
            company=company,
            status="error",
            message="Error: Invalid OpenAI API key. Please check your .env file."
        )
    except Exception as e:
        return ResearchResponse(
            company=company,
            status="error",
            message=f"Error: An unexpected error occurred: {str(e)}"
        )