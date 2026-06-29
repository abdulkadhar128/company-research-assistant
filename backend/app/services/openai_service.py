import json
from openai import OpenAI
from app.core.config import settings
from app.schemas.research import AccountPlanOutput, CompanyComparisonOutput

client = OpenAI(
    api_key=settings.OPENAI_API_KEY
)

def verify_article_relevance(company_name: str, title: str, content: str) -> bool:
    lower_company = company_name.lower()
    if lower_company not in title.lower() and lower_company not in content.lower():
        return False

    prompt = f"Is this article primarily about {company_name}? Answer YES or NO.\n\nArticle Title: {title}\nArticle Snippet: {content}"
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,
            max_tokens=5
        )
        answer = response.choices[0].message.content.strip().upper()
        return "YES" in answer
    except Exception as e:
        print(f"Error verifying article relevance: {e}")
        return True

def generate_account_plan(company_name: str, tavily_data: dict, firecrawl_data: str) -> AccountPlanOutput | None:
    # 0. Filter news articles for relevance and deduplicate
    filtered_news = []
    seen_urls = set()
    seen_titles = set()
    rejected_urls = set()
    
    for article in tavily_data.get("news", []):
        url = article.get("url")
        title = article.get("title")
        content = article.get("content", "")
        
        if not url or not title:
            continue
            
        # Deduplicate
        if url in seen_urls or title in seen_titles:
            rejected_urls.add(url)
            continue
            
        # Verify relevance
        is_relevant = verify_article_relevance(company_name, title, content)
        if is_relevant:
            filtered_news.append(article)
            seen_urls.add(url)
            seen_titles.add(title)
        else:
            rejected_urls.add(url)
            
    tavily_data["news"] = filtered_news
    
    # Clean up all_sources to remove rejected news URLs
    if "all_sources" in tavily_data:
        tavily_data["all_sources"] = [
            src for src in tavily_data["all_sources"] 
            if src.get("url") not in rejected_urls
        ]

    # 1. Store Firecrawl website data as a source
    if "all_sources" not in tavily_data:
        tavily_data["all_sources"] = []

    website_url = tavily_data.get("official_website")
    if website_url and firecrawl_data and firecrawl_data != "No website found to scrape.":
        # Check if already present
        has_website = False
        for src in tavily_data["all_sources"]:
            if src["url"] == website_url:
                # Update with richer scraped content
                src["content"] = firecrawl_data
                has_website = True
                break
        if not has_website:
            tavily_data["all_sources"].append({
                "title": f"{company_name} Official Website Scrape",
                "source_name": website_url.split("//")[-1].split("/")[0],
                "url": website_url,
                "published_date": None,
                "content": firecrawl_data
            })

    # 2. Format the unified raw sources for the prompt
    sources_text = ""
    for idx, src in enumerate(tavily_data["all_sources"]):
        sources_text += f"Source [{idx+1}]:\n"
        sources_text += f"Title: {src.get('title')}\n"
        sources_text += f"Source Name: {src.get('source_name')}\n"
        sources_text += f"URL: {src.get('url')}\n"
        if src.get("published_date"):
            sources_text += f"Date: {src.get('published_date')}\n"
        sources_text += f"Content: {src.get('content')}\n\n"

    system_prompt = f"""
    You are an expert enterprise sales researcher.
    Your task is to analyze the provided sources and generate a structured, source-backed account plan for '{company_name}'.
    
    CRITICAL QUALITY & CITATION INSTRUCTIONS:
    - EVERY fact, milestone, competitor, news article, SWOT analysis, and strategy you write MUST be strictly backed by the provided sources.
    - If there is insufficient information in the provided sources to write any section, field, or event, do NOT fabricate or guess information. Instead, write exactly "Information unavailable" in that field or text description.
    - For each generated section (Executive Summary, Competitors, News, SWOT, Timeline, and Account Plan), you must populate its corresponding sources field (e.g. `executive_summary_sources`, `competitors_sources`, `news_sources`, `swot_sources`, `timeline_sources`, and `account_plan_sources`).
    - Only include in the section's sources list the actual Source objects from the provided source list that you used as a basis for that section.
    
    SECTION SPECIFIC INSTRUCTIONS:
    - For `latest_news`, use ONLY the news items provided in the sources. For each news article, extract or generate a short `summary` (1-2 sentences summarizing the core content of the article) and populate the `summary` field. Use the `published_date` field from each source as the `date` (format as YYYY-MM-DD). Do NOT fabricate, guess, or use any news dates from before 2025. The current year is 2026.
    - For `timeline`, provide a comprehensive historical timeline of the company covering its entire existence. Identify major milestones across all decades of the company's existence to avoid large gaps (greater than 5–10 years whenever possible). Ensure no historical gap exceeds 10 years when data is available. Provide between 10 and 20 chronologically sorted timeline milestones depending on company age. Extract: Founding events, Product launches, Acquisitions, Leadership changes, Funding rounds, Partnerships, Market expansion, and Technology milestones. Each milestone must have:
      * `year`: the year of the event (e.g. '1975')
      * `title`: a short title (e.g. 'Microsoft Founded')
      * `description`: a detailed summary of the event
      * `category`: choose strictly from: 'Founded', 'Product', 'Acquisition', 'Partnership', 'Leadership', 'Expansion', 'Financial', 'AI / Technology'
      * `source`: set this to the specific Source object from the provided sources list used to back up/verify this milestone.
    - For `swot`, avoid generic SWOT statements. For each strength, weakness, opportunity, and threat, generate a concrete `statement` and provide the concrete `evidence` (such as specific milestones, financials, products, or news mentioned in the source documents) supporting it. Format each strength, weakness, opportunity, and threat as a `SWOTItem` containing the `statement` and the corresponding supporting `evidence`.
    - For `metrics`, estimate realistic numbers based on the data context:
      - `competitor_market_share`: Provide estimated market share percentages for the top competitors.
      - `swot_scores`: Provide a score out of 100 for the company's overall strength, weakness, opportunity, and threat levels.
      - `news_sentiment`: Estimate the distribution of recent news sentiment (Positive, Neutral, Negative) adding up to 100.
    """

    user_prompt = f"""
    Validated source documents:
    {sources_text}

    Company website details (general metadata):
    Official Website: {tavily_data.get('official_website')}
    Industry: {tavily_data.get('industry')}
    Company Type: {tavily_data.get('company_type')}

    Generate the structured account plan based ONLY on the validated sources above. If any section does not have enough information, output "Information unavailable".
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

def generate_company_comparison(
    company_a: str, company_b: str,
    tavily_data_a: dict, tavily_data_b: dict,
    firecrawl_a: str, firecrawl_b: str
) -> CompanyComparisonOutput | None:
    # Compile website scrape as source if available for Company A
    website_url_a = tavily_data_a.get("official_website")
    if website_url_a and firecrawl_a and firecrawl_a != "No website found to scrape.":
        if "all_sources" not in tavily_data_a:
            tavily_data_a["all_sources"] = []
        has_website_a = any(src["url"] == website_url_a for src in tavily_data_a["all_sources"])
        if not has_website_a:
            tavily_data_a["all_sources"].append({
                "title": f"{company_a} Official Website Scrape",
                "source_name": website_url_a.split("//")[-1].split("/")[0],
                "url": website_url_a,
                "published_date": None,
                "content": firecrawl_a
            })

    # Compile website scrape as source if available for Company B
    website_url_b = tavily_data_b.get("official_website")
    if website_url_b and firecrawl_b and firecrawl_b != "No website found to scrape.":
        if "all_sources" not in tavily_data_b:
            tavily_data_b["all_sources"] = []
        has_website_b = any(src["url"] == website_url_b for src in tavily_data_b["all_sources"])
        if not has_website_b:
            tavily_data_b["all_sources"].append({
                "title": f"{company_b} Official Website Scrape",
                "source_name": website_url_b.split("//")[-1].split("/")[0],
                "url": website_url_b,
                "published_date": None,
                "content": firecrawl_b
            })

    # Compile sources texts
    sources_text_a = ""
    for idx, src in enumerate(tavily_data_a.get("all_sources", [])):
        sources_text_a += f"Company A Source [{idx+1}]:\n"
        sources_text_a += f"Title: {src.get('title')}\n"
        sources_text_a += f"Source Name: {src.get('source_name')}\n"
        sources_text_a += f"URL: {src.get('url')}\n"
        sources_text_a += f"Content: {src.get('content')}\n\n"

    sources_text_b = ""
    for idx, src in enumerate(tavily_data_b.get("all_sources", [])):
        sources_text_b += f"Company B Source [{idx+1}]:\n"
        sources_text_b += f"Title: {src.get('title')}\n"
        sources_text_b += f"Source Name: {src.get('source_name')}\n"
        sources_text_b += f"URL: {src.get('url')}\n"
        sources_text_b += f"Content: {src.get('content')}\n\n"

    system_prompt = f"""
    You are an expert enterprise research analyst.
    Your task is to analyze the provided source documents for Company A ('{company_a}') and Company B ('{company_b}') and generate a structured, high-quality, side-by-side comparison report.
    
    CRITICAL QUALITY & CITATION INSTRUCTIONS:
    - EVERY fact, milestone, score, and analysis you write MUST be strictly backed by the provided sources for the respective company.
    - If there is insufficient information in the provided sources to write any field, do NOT fabricate. Instead, write exactly "Information unavailable".
    - Avoid generic statements. Provide concrete, evidence-backed statements for both companies.
    - For each comparison section, you must populate the `sources` field with the actual Source objects from the provided lists that you used.
    
    For each of the following sections, you must provide:
    1. `company_a_val`: Detailed, specific information for Company A ('{company_a}').
    2. `company_b_val`: Detailed, specific information for Company B ('{company_b}').
    3. `comparison_synthesis`: A deep, analytical synthesis comparing the two companies on this topic (highlighting similarities, differences, competitive advantages, or strategic tradeoffs).
    
    The sections are:
    - `overview`: General introduction, business models, and core value proposition.
    - `market_position`: Industry space, market type, key metrics, and presence.
    - `swot`: A concise SWOT analysis summary for both companies.
    - `competitors`: Core competitors for each company and how they rank.
    - `growth_potential`: Recent growth vectors, future growth opportunities, and momentum.
    - `timeline`: Key historical comparison and how their foundation/paths compare.
    - `opportunities`: Strategic business/partnership opportunities for each.
    - `risks`: Core threats, operational or financial risks, and market vulnerabilities.
    """

    user_prompt = f"""
    Validated source documents for Company A ({company_a}):
    {sources_text_a}

    Validated source documents for Company B ({company_b}):
    {sources_text_b}

    Generate the side-by-side comparison. If data is insufficient for any value, output "Information unavailable".
    """

    try:
        response = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format=CompanyComparisonOutput,
        )
        return response.choices[0].message.parsed
    except Exception as e:
        print(f"OpenAI error generating comparison for {company_a} vs {company_b}: {e}")
        return None