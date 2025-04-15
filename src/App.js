import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import ViewerDashboard from "./ViewerDashboard";
import ResidentData from "./ResidentData";
import ViewInsight from "./ViewInsight"; // Import ViewInsights
import WelcomePage from "./WelcomePage";
import AddResident from "./AddResident";
import ViewData from "./ViewData";
import ViewList from "./ViewList";
import List from "./List";
import "./main.css";  
import ResidentList from "./ResidentList";


function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
      return null;
    }
  });

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? (user.role === "admin" ? "/admindashboard" : "/viewerdashboard") : "/login"} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login setUser={setUser} />} />
      
      
    <Route path="/admindashboard" element={user?.role === "admin" ? <AdminDashboard user={user} /> : <Navigate to="/login" />} >
  <Route index element={<WelcomePage />} /> {/* ✅ Fix: Now WelcomePage loads when visiting /admindashboard */}
  <Route path="view-list" element={<ViewList />} />
  <Route path="add-resident" element={<AddResident />} />
  <Route path="resident-data" element={<ResidentData />} />
  <Route path="resident-list" element={<ResidentList />} />
  <Route path="view-insight" element={<ViewInsight />} /> {/* New Route */}
</Route>

      {/* Viewer Dashboard with Nested Routes */}
      <Route path="/viewerdashboard" element={user?.role === "viewer" ? <ViewerDashboard /> : <Navigate to="/login" />} >
        <Route index element={<WelcomePage />} />
        <Route path="view-list" element={<ViewList />} />
        <Route path="view-res-list" element={<List />} />
        <Route path="view-data" element={<ViewData />} />
        <Route path="view-insight" element={<ViewInsight />} /> {/* New Route */}
      </Route>
    </Routes>
  );
}

export default App;
