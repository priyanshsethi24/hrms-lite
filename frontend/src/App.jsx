import { useState, useEffect } from 'react';
import Header from './components/Header';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import AttendanceForm from './components/AttendanceForm';
import AttendanceView from './components/AttendanceView';
import { employeeAPI, attendanceAPI } from './api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refresh, setRefresh] = useState(0);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0 });

  const triggerRefresh = () => setRefresh(prev => prev + 1);

  useEffect(() => {
    fetchStats();
  }, [refresh]);

  const fetchStats = async () => {
    try {
      const empRes = await employeeAPI.getAll();
      const employees = empRes.data;
      const today = new Date().toISOString().split('T')[0];
      
      let present = 0, absent = 0;
      for (const emp of employees) {
        try {
          const attRes = await attendanceAPI.getByEmployee(emp.employee_id);
          const todayAtt = attRes.data.find(a => a.date === today);
          if (todayAtt?.status === 'Present') present++;
          else if (todayAtt?.status === 'Absent') absent++;
        } catch {}
      }
      setStats({ total: employees.length, present, absent });
    } catch {}
  };

  return (
    <div className="app">
      <Header />
      <div className="container">
        <nav className="tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'employees' ? 'active' : ''} 
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
          <button 
            className={activeTab === 'attendance' ? 'active' : ''} 
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </nav>

        {activeTab === 'dashboard' && (
          <div className="section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon green">👥</div>
                <div className="stat-content">
                  <h3>Total Employees</h3>
                  <div className="stat-value">{stats.total}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue">✓</div>
                <div className="stat-content">
                  <h3>Present Today</h3>
                  <div className="stat-value">{stats.present}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon red">✗</div>
                <div className="stat-content">
                  <h3>Absent Today</h3>
                  <div className="stat-value">{stats.absent}</div>
                </div>
              </div>
            </div>
            <div className="dashboard-grid">
              <div className="card">
                <h2>Recent Employees</h2>
                <EmployeeList refresh={refresh} onDelete={triggerRefresh} compact />
              </div>
              <div className="card">
                <h2>Recent Attendance</h2>
                <AttendanceView key={refresh} compact />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="section">
            <EmployeeForm onSuccess={triggerRefresh} />
            <div className="card">
              <h2>Employee List</h2>
              <EmployeeList refresh={refresh} onDelete={triggerRefresh} />
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="section">
            <AttendanceForm onSuccess={triggerRefresh} />
            <AttendanceView key={refresh} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
