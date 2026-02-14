import { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../api';

function AttendanceView({ compact }) {
  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allAttendance, setAllAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [fromDate, setFromDate] = useState(firstDayOfMonth);
  const [toDate, setToDate] = useState(today);

  useEffect(() => {
    fetchEmployees();
    if (compact) {
      fetchAllAttendance();
    }
  }, [compact]);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to load employees');
    }
  };

  const fetchAllAttendance = async () => {
    try {
      const response = await employeeAPI.getAll();
      const allRecords = [];
      for (const emp of response.data) {
        try {
          const attRes = await attendanceAPI.getByEmployee(emp.employee_id);
          attRes.data.forEach(att => {
            allRecords.push({
              ...att,
              employee_name: emp.full_name,
              employee_id: emp.employee_id,
              timestamp: new Date()
            });
          });
        } catch {}
      }
      allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAllAttendance(allRecords);
      
      // Apply default filter
      let filtered = allRecords.filter(att => {
        const attDate = new Date(att.date);
        return attDate >= new Date(firstDayOfMonth) && attDate <= new Date(today);
      });
      setFilteredAttendance(filtered.slice(0, 10));
    } catch (err) {
      console.error('Failed to load attendance');
    }
  };

  const handleFilter = () => {
    let filtered = [...allAttendance];
    if (fromDate) {
      filtered = filtered.filter(att => new Date(att.date) >= new Date(fromDate));
    }
    if (toDate) {
      filtered = filtered.filter(att => new Date(att.date) <= new Date(toDate));
    }
    setFilteredAttendance(filtered.slice(0, 10));
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return `${date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  };

  const fetchAttendance = async (empId) => {
    setLoading(true);
    try {
      const response = await attendanceAPI.getByEmployee(empId);
      setAttendance(response.data);
    } catch (err) {
      console.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (empId) => {
    setSelectedEmployee(empId);
    if (empId) {
      fetchAttendance(empId);
    } else {
      setAttendance([]);
    }
  };

  if (compact) {
    return (
      <>
        <div className="filter-row">
          <div className="form-group">
            <label>From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleFilter} style={{marginTop: '1.5rem'}}>Filter</button>
        </div>
        {filteredAttendance.length === 0 ? (
          <div className="empty-state">
            <p>No attendance records found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((record, index) => (
                <tr key={index}>
                  <td>{record.employee_name}</td>
                  <td>{formatDateTime(record.date)}</td>
                  <td>
                    <span className={`status-badge status-${record.status.toLowerCase()}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </>
    );
  }

  return (
    <div className="card">
      <h2>View Attendance Records</h2>
      <div className="form-group">
        <label>Select Employee</label>
        <select
          value={selectedEmployee}
          onChange={(e) => handleEmployeeChange(e.target.value)}
        >
          <option value="">Choose an employee</option>
          {employees.map((emp) => (
            <option key={emp.employee_id} value={emp.employee_id}>
              {emp.employee_id} - {emp.full_name}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Loading attendance...</div>}

      {!loading && selectedEmployee && attendance.length === 0 && (
        <div className="empty-state">
          <p>No attendance records found for this employee.</p>
        </div>
      )}

      {!loading && attendance.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>
                  <span className={`status-badge status-${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AttendanceView;
