import json
from tavily import TavilyClient
from app.core.config import settings

def get_tavily_client() -> TavilyClient | None:
    if not settings.TAVILY_API_KEY:
        return None
    try:
        return TavilyClient(api_key=settings.TAVILY_API_KEY)
    except Exception as e:
        print(f"Failed to initialize Tavily client: {e}")
        return None

def extract_domain_from_url(url: str) -> str | None:
    # Very simple extraction for clean representation if needed
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        return parsed.netloc or None
    except:
        return None

def research_company_tavily(company_name: str) -> dict:
    """
    Perform multiple Tavily searches to gather context about the company:
    1. Official website
    2. Latest news
    3. Competitors
    4. Recent milestones & events (2024-2026)
    5. Historical timeline & milestones
    """
    client = get_tavily_client()
    if not client:
        return {
            "error": "Tavily API key is missing or invalid.",
            "official_website": None,
            "news": [],
            "competitors": [],
            "general_info": "",
            "recent_events": [],
            "historical_events": [],
            "all_sources": []
        }

    results = {
        "official_website": None,
        "news": [],
        "competitors": [],
        "general_info": "",
        "recent_events": [],
        "historical_events": [],
        "all_sources": []
    }

    def add_source(title: str, url: str, content: str, date: str | None = None):
        if not url:
            return
        # Avoid duplicate URLs
        for s in results["all_sources"]:
            if s["url"] == url:
                # Keep the richer content if updated
                if len(content or "") > len(s.get("content") or ""):
                    s["content"] = content
                return
        domain = extract_domain_from_url(url) or "Web Source"
        results["all_sources"].append({
            "title": title or f"Info from {domain}",
            "source_name": domain,
            "url": url,
            "published_date": date or None,
            "content": content or ""
        })

    try:
        # Search 1: Find the official website
        res_website = client.search(
            query=f"Official website of {company_name}", 
            search_depth="basic",
            max_results=3
        )
        
        # Heuristic: the first result is usually the website
        if res_website.get("results"):
            results["official_website"] = res_website["results"][0]["url"]
            results["general_info"] += f"About: {res_website['results'][0]['content']}\n"
            for r in res_website.get("results", []):
                add_source(r.get("title", ""), r.get("url", ""), r.get("content", ""))

        # Search 2: Latest News (last 30 days)
        res_news = client.search(
            query=f"Latest news 2026 {company_name}",
            search_depth="advanced",
            topic="news",
            days=30,
            include_images=False,
            max_results=6
        )
        for r in res_news.get("results", []):
            results["news"].append({
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "content": r.get("content", ""),
                "published_date": r.get("published_date", "")
            })
            add_source(r.get("title", ""), r.get("url", ""), r.get("content", ""), r.get("published_date", ""))

        # Search 3: Competitors
        res_competitors = client.search(
            query=f"Main competitors and alternatives to {company_name}", 
            search_depth="basic",
            max_results=3
        )
        for r in res_competitors.get("results", []):
            results["competitors"].append(r.get("content", ""))
            add_source(r.get("title", ""), r.get("url", ""), r.get("content", ""))

        # Search 4: Recent milestones & events (2024-2026)
        res_events = client.search(
            query=f"{company_name} milestones achievements expansion launches 2024 2025 2026",
            search_depth="advanced",
            topic="news",
            days=730,
            include_images=False,
            max_results=5
        )
        for r in res_events.get("results", []):
            results["recent_events"].append({
                "title": r.get("title", ""),
                "content": r.get("content", ""),
                "url": r.get("url", ""),
                "published_date": r.get("published_date", "")
            })
            add_source(r.get("title", ""), r.get("url", ""), r.get("content", ""), r.get("published_date", ""))

        # Search 5: Historical timeline and milestones
        res_history = client.search(
            query=f"{company_name} history timeline founding key milestones mergers acquisitions IPO product launches",
            search_depth="advanced",
            include_images=False,
            max_results=10
        )
        for r in res_history.get("results", []):
            results["historical_events"].append({
                "title": r.get("title", ""),
                "content": r.get("content", ""),
                "url": r.get("url", ""),
                "published_date": r.get("published_date", "")
            })
            add_source(r.get("title", ""), r.get("url", ""), r.get("content", ""), r.get("published_date", ""))

    except Exception as e:
        print(f"Tavily search error for {company_name}: {e}")
        results["error"] = str(e)

    return results
