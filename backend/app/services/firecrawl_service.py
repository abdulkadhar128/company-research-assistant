from firecrawl import FirecrawlApp
from app.core.config import settings

def get_firecrawl_app() -> FirecrawlApp | None:
    if not settings.FIRECRAWL_API_KEY:
        return None
    try:
        return FirecrawlApp(api_key=settings.FIRECRAWL_API_KEY)
    except Exception as e:
        print(f"Failed to initialize Firecrawl app: {e}")
        return None

def scrape_company_website(url: str) -> str:
    """
    Scrape the company website and extract markdown text.
    For this prototype, we'll just scrape the homepage to get basic info.
    If we had more time/budget, we could use crawl() to find about/product pages.
    """
    app = get_firecrawl_app()
    if not app:
        return "Firecrawl API key is missing. Could not scrape website."
    
    try:
        # Just scrape the homepage to save time and API credits. 
        # The scrape method extracts markdown directly.
        scrape_result = app.scrape_url(url, params={'formats': ['markdown']})
        
        # Firecrawl returns a dict, usually with a 'markdown' or 'data' field.
        if isinstance(scrape_result, dict):
            # Format v1/v0 might differ. Usually scrape_result['markdown'] or scrape_result.get('data', {}).get('markdown')
            md = scrape_result.get("markdown")
            if not md and "data" in scrape_result:
                md = scrape_result["data"].get("markdown")
            
            return md or "No markdown content extracted."
        
        return str(scrape_result)
    except Exception as e:
        print(f"Firecrawl scrape error for {url}: {e}")
        return f"Failed to scrape {url}: {str(e)}"
