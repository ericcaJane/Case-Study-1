import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useNavigation from "./useNavigation"; 
import styles from './login.module.css'; // Import the CSS Module

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { goToAdminDashboard, goToViewerDashboard } = useNavigation(); // Get navigation functions

  // Ensure the login page has proper styling
  useEffect(() => {
    document.body.id = "login-page"; 
    return () => {
      document.body.id = ""; 
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("🔍 Sending Login Request - Email:", email);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("🔍 Login Response:", data);

      if (data.success && data.user && data.user.role) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        setUser(data.user);

        // Redirect based on role
        data.user.role === "admin" ? goToAdminDashboard() : goToViewerDashboard();
        toast.success("✅ Login successful!");
      } else if (data.message === "Account does not exist") {
        toast.error("❌ Account does not exist. Please sign up.");
      } else {
        toast.error(data.message || "Invalid login credentials");
      }
    } catch (error) {
      console.error("❌ Server error:", error);
      toast.error("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <div className={styles.wrapper}>  
      <span className={styles.bgAnimate2}></span>
      <div className={`${styles.formBox} ${styles.login}`}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputBox}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
            <i className='bx bxs-user'></i>
          </div>
          <div className={styles.inputBox}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
            <i className='bx bxs-lock-open'></i>
          </div>
          <button type="submit" className={styles.btn}>Login</button>
          <div className={styles.loginLink}>
            <p>Don't have an account? <Link to="/signup" className="registerLink">Sign Up</Link></p>
          </div>
        </form>
      </div>
      <div className={`${styles.infoText} ${styles.login}`}>
        <h2>Welcome to the Barangay Management System!</h2>
        <p>Enter your credentials to continue.</p>
      </div>
    </div>
  );
};

export default Login;