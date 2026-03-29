from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import urls, analytics

# Create all database tables automatically
Base.metadata.create_all(bind=engine)

# Create the FastAPI app
app = FastAPI(
    title="URL Shortener",
    description="A production-grade URL shortener with analytics",
    version="1.0.0"
)

# Allow React frontend to talk to our backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register our routers
app.include_router(urls.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {"message": "URL Shortener API is running! 🚀"}