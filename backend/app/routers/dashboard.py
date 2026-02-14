from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models
from datetime import date

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):
    total_employees = db.query(models.Employee).count()
    today = date.today()

    present_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == "Present"
    ).count()

    absent_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == "Absent"
    ).count()

    return {
        "totalEmployees": total_employees,
        "presentToday": present_today,
        "absentToday": absent_today
    }
