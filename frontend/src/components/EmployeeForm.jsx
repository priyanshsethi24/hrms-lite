import { useState } from 'react';
import { employeeAPI } from '../api';

function EmployeeForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Client-side validation
    if (!formData.employee_id.trim()) {
      setMessage({ type: 'error', text: 'Employee ID is required' });
      setLoading(false);
      return;
    }
    if (!formData.full_name.trim()) {
      setMessage({ type: 'error', text: 'Full name is required' });
      setLoading(false);
      return;
    }
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      setLoading(false);
      return;
    }
    if (!formData.department.trim()) {
      setMessage({ type: 'error', text: 'Department is required' });
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      setLoading(false);
      return;
    }

    try {
      await employeeAPI.create(formData);
      setMessage({ type: 'success', text: 'Employee added successfully!' });
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      onSuccess();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to add employee';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Add New Employee</h2>
      {message.text && <div className={message.type}>{message.text}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Employee ID *</label>
            <input
              type="text"
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Department *</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Employee'}
        </button>
      </form>
    </div>
  );
}

export default EmployeeForm;
