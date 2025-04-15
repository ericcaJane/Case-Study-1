import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./main.css";

function ViewerDashboard() {
  const navigate = useNavigate();

  // Logout function with confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      navigate("/login"); // Redirects to Login.js
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <header>Employee Dashboard</header>
        <div className="menu">
          <button onClick={() => navigate("/viewerdashboard")}>Home</button>
          <button onClick={() => navigate("/viewerdashboard/view-list")}> Information</button>
          <button onClick={() => navigate("/viewerdashboard/view-res-list")}> List</button>
          <button onClick={() => navigate("/viewerdashboard/view-insight")}>Recent Info</button>
          <button onClick={() => navigate("/viewerdashboard/view-data")}>Recent Data</button>
        </div>
        <div className="logout" onClick={handleLogout}>Logout</div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default ViewerDashboard;
