import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <span className="header-icon">👥</span>
          <div>
            <h1>HRMS Lite</h1>
            <p>Human Resource Management System</p>
          </div>
        </div>
        <div className="header-right">
          <div className="admin-badge">
            <span>Admin</span>
            <div className="admin-avatar">A</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
