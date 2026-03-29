from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import urls, analytics

app = FastAPI(
    title="Nyuna URL Shortener",
    description="Production-grade URL shortener with Redis caching and analytics",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(urls.router)
app.include_router(analytics.router)

@app.on_event("startup")
async def startup():
    from app.database import engine, Base
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Nyuna URL Shortener API is running! 🚀"}

@app.get("/health")
def health():
    return {"status": "healthy"}