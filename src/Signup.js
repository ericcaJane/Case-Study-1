import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useNavigation from "./useNavigation"; 
import styles from './login.module.css'; // Import the CSS Module

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer"); // Default role
  const [confirmationCode, setConfirmationCode] = useState(""); // For admin signups
  const { goToLogin } = useNavigation(); // Get navigation function

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.id = "login-page"; 
    return () => {
      document.body.id = ""; 
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("📝 Signup Request - Email:", email, "Role:", role);

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, confirmationCode }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("✅ Signup successful! Redirecting to login...");
        setTimeout(goToLogin, 2000); // Redirect after delay
      } else {
        toast.error(data.message || "❌ Signup failed. Try again.");
      }
    } catch (error) {
      console.error("❌ Server error:", error);
      toast.error("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <div className={styles.body}>

      <div className={styles.wrapper}>
      <span className={styles.bgAnimate}></span>
      <div className={`${styles.formBox} ${styles.signup}`}>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
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
            <div className={styles.selectBox}>
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="viewer">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {role === "admin" && (
              <div className={styles.inputBox}>
                <input
                  type="text"
                  
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  required
                />
                <label>Admin Code</label>
                <i className='bx bxs-key'></i>
              </div>
            )}
            <button type="submit" className={styles.btn}>Sign Up</button>
            <div className={styles.signupLink}>
              <p>Already have an account? <Link to="/login" className="login-link">Login</Link></p>
            </div>
          </form>
        </div>
        <div className={`${styles.infoText} ${styles.signup}`}>
          <h2>Create Your Account</h2>
          <p>Register to access barangay records</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;