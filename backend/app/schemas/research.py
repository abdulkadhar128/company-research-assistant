from pydantic import BaseModel


class ResearchRequest(BaseModel):
    company: str


class ResearchResponse(BaseModel):
    company: str
    status: str
    message: str