import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check if user is already logged in
        const userId = localStorage.getItem("userId");
        if (userId) {
            navigate("/home");
        }
    }, [navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        const loginDetails = { email, password };
        
        try {
            console.log('Attempting login with:', { email: loginDetails.email });
            
            // Add headers to ensure proper content type
            const response = await axios.post('http://localhost:8080/login', loginDetails, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Login response:', response.data);
            
            if (response.data && response.data.id) {
                // Save user info in localStorage
                localStorage.setItem('userId', response.data.id);
                
                // Get user details to save name and email
                try {
                    const userResponse = await axios.get(`http://localhost:8080/user/${response.data.id}`);
                    if (userResponse.data) {
                        localStorage.setItem('userFullName', userResponse.data.fullname);
                        localStorage.setItem('userEmail', userResponse.data.email);
                    }
                } catch (userErr) {
                    console.error("Error fetching user details:", userErr);
                }
                
                navigate("/home"); // Navigate to home page after login
            } else {
                setErrors({ general: "Invalid credentials" });
            }
        } catch (err) {
            console.error("Login error:", err);
            // Show more detailed error message
            const errorMessage = err.response?.data?.message || err.message || "Login failed. Please try again.";
            console.log("Error details:", err.response?.data);
            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }


  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1>Welcome Back</h1>
        <form onSubmit={(e) => onSubmit(e)} className="login-form">
          {errors.general && <div className="error-message general-error">{errors.general}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
          <p><Link to="/">Back to Snapture</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;

