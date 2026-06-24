from fastapi import APIRouter

from app.schemas.research import (
    ResearchRequest,
    ResearchResponse,
)

router = APIRouter(
    prefix="/api/v1/research",
    tags=["Research"],
)


@router.post("/", response_model=ResearchResponse)
async def research_company(request: ResearchRequest):
    return ResearchResponse(
        company=request.company,
        status="success",
        message=f"Research for {request.company} started.",
    )