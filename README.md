# HRMS Lite - Human Resource Management System

A lightweight, full-stack HRMS application for managing employees and tracking attendance.

## 🚀 Live Demo

- **Frontend**: [Deploy on Vercel/Netlify]
- **Backend API**: [Deploy on Render/Railway]
- **GitHub**: https://github.com/yourusername/hrms-lite

## 📋 Features

### Employee Management
- Add new employees with ID, name, email, and department
- View all employees in a table
- Delete employees
- Duplicate employee ID validation
- Email format validation

### Attendance Management
- Mark daily attendance (Present/Absent)
- View attendance records by employee
- Date-based attendance tracking
- Automatic duplicate prevention (one record per employee per day)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **FastAPI** - Python web framework
- **MongoDB** - NoSQL database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd Backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```bash
cp .env.example .env
```

5. Update `.env` with your MongoDB connection:
```
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=hrms_lite
PORT=8000
```

6. Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```

Backend will run at: http://localhost:8000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```
VITE_API_URL=http://localhost:8000
```

5. Run development server:
```bash
npm run dev
```

Frontend will run at: http://localhost:3000

## 🌐 Deployment

### Backend Deployment (Render/Railway)

1. Create account on Render.com or Railway.app
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `pip install -r Backend/requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `Backend`
5. Add environment variables:
   - `MONGODB_URL`: Your MongoDB Atlas connection string
   - `DATABASE_NAME`: hrms_lite

### Frontend Deployment (Vercel/Netlify)

1. Create account on Vercel.com or Netlify.com
2. Import your GitHub repository
3. Configure:
   - **Base Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your deployed backend URL

## 📚 API Documentation

Once backend is running, visit: http://localhost:8000/docs

### Endpoints

#### Employees
- `POST /employees` - Create employee
- `GET /employees` - Get all employees
- `DELETE /employees/{employee_id}` - Delete employee

#### Attendance
- `POST /attendance` - Mark attendance
- `GET /attendance/{employee_id}` - Get employee attendance

## 🏗️ Project Structure

```
hrms-lite/
├── Backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app & routes
│   │   ├── database.py      # MongoDB connection
│   │   └── models.py        # Pydantic models
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   ├── EmployeeList.jsx
│   │   │   ├── AttendanceForm.jsx
│   │   │   └── AttendanceView.jsx
│   │   ├── App.jsx
│   │   ├── api.js           # API service
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
└── README.md
```

## ✨ Features Implemented

- ✅ Employee CRUD operations
- ✅ Attendance marking and viewing
- ✅ Form validations (email, required fields)
- ✅ Duplicate employee ID handling
- ✅ Loading states
- ✅ Error handling with meaningful messages
- ✅ Empty states
- ✅ Responsive design
- ✅ Professional UI
- ✅ RESTful API design
- ✅ MongoDB persistence

## 🔒 Assumptions & Limitations

- Single admin user (no authentication)
- No role-based access control
- No payroll or leave management
- Attendance can be marked for any date
- One attendance record per employee per day
- No bulk operations
- No data export functionality

## 🧪 Testing

### Manual Testing
1. Add employees with valid/invalid data
2. Try duplicate employee IDs
3. Delete employees
4. Mark attendance for employees
5. View attendance records
6. Test empty states

### API Testing
Use the Swagger UI at `/docs` or tools like Postman/Thunder Client

## 📝 Development Notes

- Backend uses async/await for database operations
- Frontend uses React hooks for state management
- MongoDB indexes ensure unique employee IDs
- CORS enabled for cross-origin requests
- Environment variables for configuration
- Modular component structure

## 🤝 Contributing

This is an assignment project. Not accepting contributions.

## 📄 License

MIT License - Free to use for educational purposes.

## 👤 Author

Your Name - [GitHub Profile]

---

**Note**: This project was built as part of a full-stack development assessment.
