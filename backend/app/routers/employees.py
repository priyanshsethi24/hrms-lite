from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/employees", tags=["Employees"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", status_code=201)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    # Validate required fields
    if not employee.employee_id or not employee.employee_id.strip():
        raise HTTPException(status_code=400, detail="Employee ID is required")
    if not employee.full_name or not employee.full_name.strip():
        raise HTTPException(status_code=400, detail="Full name is required")
    if not employee.email or not employee.email.strip():
        raise HTTPException(status_code=400, detail="Email is required")
    if not employee.department or not employee.department.strip():
        raise HTTPException(status_code=400, detail="Department is required")
    
    # Check for duplicate employee ID
    existing_emp_id = db.query(models.Employee).filter(
        models.Employee.employee_id == employee.employee_id
    ).first()
    if existing_emp_id:
        raise HTTPException(status_code=409, detail="Employee ID already exists")
    
    # Check for duplicate email
    existing_email = db.query(models.Employee).filter(
        models.Employee.email == employee.email
    ).first()
    if existing_email:
        raise HTTPException(status_code=409, detail="Email already exists")

    try:
        new_employee = models.Employee(**employee.dict())
        db.add(new_employee)
        db.commit()
        db.refresh(new_employee)
        return new_employee
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create employee")

@router.get("/")
def get_employees(db: Session = Depends(get_db)):
    employees = db.query(models.Employee).all()
    return [{
        "id": emp.id,
        "employee_id": emp.employee_id,
        "full_name": emp.full_name,
        "email": emp.email,
        "department": emp.department
    } for emp in employees]

@router.delete("/{id}")
def delete_employee(id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()
    return {"message": "Employee deleted"}
