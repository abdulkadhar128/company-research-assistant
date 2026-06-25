from firecrawl import FirecrawlApp
from app.core.config import settings
import concurrent.futures

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
    Has a 15-second timeout to avoid hanging the API.
    """
    app = get_firecrawl_app()
    if not app:
        return "Firecrawl API key is missing. Could not scrape website."
    
    def do_scrape():
        scrape_result = app.scrape_url(url, params={'formats': ['markdown']})
        if isinstance(scrape_result, dict):
            md = scrape_result.get("markdown")
            if not md and "data" in scrape_result:
                md = scrape_result["data"].get("markdown")
            return md or "No markdown content extracted."
        return str(scrape_result)

    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(do_scrape)
            return future.result(timeout=15)
    except concurrent.futures.TimeoutError:
        print(f"Firecrawl timed out scraping {url}")
        return f"Website scraping timed out for {url}. Proceeding with search data only."
    except Exception as e:
        print(f"Firecrawl scrape error for {url}: {e}")
        return f"Failed to scrape {url}: {str(e)}"
