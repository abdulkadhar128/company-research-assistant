from fastapi import FastAPI

app = FastAPI(
    title="Company Research Assistant API",
    description="Backend API for the Company Research Assistant",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Company Research Assistant API is running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
