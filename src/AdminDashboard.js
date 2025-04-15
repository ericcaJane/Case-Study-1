import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import "./main.css";

function AdminDashboard() {
  const navigate = useNavigate();

  // Logout function with confirmation
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user"); // Clear stored user data
      navigate("/login"); // Redirect to Login page
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <header>Admin Dashboard</header>
        <div className="menu">
          {/* Make sure the Home button navigates correctly */}
          <button onClick={() => navigate("/admindashboard", { replace: true })}>Home</button>
          <button onClick={() => navigate("/admindashboard/view-list")}>Information</button>
          <button onClick={() => navigate("/admindashboard/add-resident")}>Manual Adding</button>
          <button onClick={() => navigate("/admindashboard/resident-list")}>Resident List</button>
          <button onClick={() => navigate("/admindashboard/resident-data")}>Resident Data</button>
          <button onClick={() => navigate("/admindashboard/view-insight")}>Recent Info</button>
        </div>
        <div className="logout" onClick={handleLogout}>Logout</div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        <Outlet /> {/* This will load WelcomePage when on /admindashboard */}
      </div>
    </div>
  );
}


export default AdminDashboard;
