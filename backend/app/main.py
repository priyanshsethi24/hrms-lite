from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers.employees import router as employees_router
from app.routers.attendance import router as attendance_router
from app.routers.dashboard import router as dashboard_router

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "HRMS Lite API", "status": "running"}

# Include routers
app.include_router(employees_router)
app.include_router(attendance_router)
app.include_router(dashboard_router)
