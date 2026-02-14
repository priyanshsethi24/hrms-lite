import { useEffect, useState } from "react";
import API from "../api/api";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/employees");
      setEmployees(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async (empId) => {
    if (!empId) return;
    
    try {
      setRecordsLoading(true);
      const res = await API.get(`/api/attendance/${empId}`);
      setRecords(res.data);
    } catch (err) {
      setRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      await API.post("/api/attendance", {
        employee_id: selected,
        date,
        status
      });
      fetchAttendance(selected);
    } catch (err) {
      setFormError(err.response?.data?.detail || "Failed to mark attendance");
    }
  };

  const handleEmployeeChange = (empId) => {
    setSelected(empId);
    const emp = employees.find(e => e.employee_id === empId);
    setSelectedEmployee(emp);
    fetchAttendance(empId);
  };

  const calculateStats = () => {
    const present = records.filter(r => r.status === "Present").length;
    const absent = records.filter(r => r.status === "Absent").length;
    const total = records.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, absent, total, rate };
  };

  const stats = selectedEmployee ? calculateStats() : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-8">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 rounded-3xl shadow-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent"></div>
        
        <div className="relative px-6 sm:px-8 lg:px-12 py-12">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <svg className="w-4 h-4 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-white text-sm font-medium">Attendance Tracking</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
              Attendance Management
            </h1>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl">
              Track and manage employee attendance with real-time updates and comprehensive records
            </p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {employees.length === 0 ? (
        <div className="bg-white shadow-2xl rounded-2xl p-16 text-center border-2 border-gray-100">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-500 mb-6">Add employees first to mark attendance.</p>
          <a
            href="/employees"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Employees
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Mark Attendance Form */}
          <div className="xl:col-span-1">
            <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 border-2 border-green-100 sticky top-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
              </div>
              
              {formError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {formError}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee *
                  </label>
                  <select
                    required
                    value={selected}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.employee_id}>
                        {emp.full_name} ({emp.employee_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={date}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus("Present")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        status === "Present"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus("Absent")}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        status === "Absent"
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selected}
                  className="w-full px-6 py-4 border-2 border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark Attendance
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Attendance Records */}
          <div className="xl:col-span-2">
            {!selectedEmployee ? (
              <div className="bg-white shadow-2xl rounded-2xl p-16 text-center border-2 border-gray-100">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No employee selected</h3>
                <p className="text-gray-500">Select an employee to view attendance records.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Employee Info Card */}
                <div className="bg-gradient-to-br from-white to-green-50 shadow-2xl rounded-2xl p-6 sm:p-8 border-2 border-green-100">
                  <div className="flex items-center mb-6">
                    <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">{selectedEmployee.full_name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="ml-5">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedEmployee.full_name}
                      </h2>
                      <p className="text-sm text-gray-600">{selectedEmployee.department}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Employee ID</p>
                      <p className="text-lg font-bold text-gray-900">{selectedEmployee.employee_id}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Department</p>
                      <p className="text-lg font-bold text-gray-900">{selectedEmployee.department}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Days</p>
                      <p className="text-lg font-bold text-blue-600">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Attendance Rate</p>
                      <p className="text-lg font-bold text-green-600">{stats.rate}%</p>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 shadow-xl rounded-2xl p-6 sm:p-8 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-green-700 uppercase tracking-wide">Present Days</span>
                      <div className="p-2 bg-green-600 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-5xl font-extrabold text-green-700 mb-2">{stats.present}</p>
                    <p className="text-sm text-green-600 font-medium">Days attended</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-red-100 shadow-xl rounded-2xl p-6 sm:p-8 border-2 border-red-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-red-700 uppercase tracking-wide">Absent Days</span>
                      <div className="p-2 bg-red-600 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-5xl font-extrabold text-red-700 mb-2">{stats.absent}</p>
                    <p className="text-sm text-red-600 font-medium">Days missed</p>
                  </div>
                </div>

                {/* Attendance Records Table */}
                <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border-2 border-gray-100">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 border-b-2 border-green-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Attendance History</h3>
                      <span className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-full">
                        {records.length} Records
                      </span>
                    </div>
                  </div>
                  
                  {recordsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : records.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-gray-500">No attendance records found.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {records.map((rec) => (
                            <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(rec.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  rec.status === "Present" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {rec.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
