from pydantic import BaseModel, EmailStr
from datetime import date

class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str

    model_config = {
    "from_attributes": True
         }


class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: str

class AttendanceResponse(BaseModel):
    id: int
    date: date
    status: str

    model_config = {
    "from_attributes": True
         }
