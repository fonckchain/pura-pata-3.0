from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.v1 import users, dogs

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Pura Pata API",
    description="API for dog adoption platform in Costa Rica",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(dogs.router, prefix="/api/v1/dogs", tags=["dogs"])


@app.get("/")
def root():
    return {
        "message": "Pura Pata API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "supabase_url": settings.SUPABASE_URL,
        "allowed_origins": settings.allowed_origins_list,
        "environment": settings.ENVIRONMENT
    }
