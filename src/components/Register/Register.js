import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
    });
    
    // Add validation states
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    const onInputChange = (e) => {
        const { name, value } = e.target;
        setUser({...user, [name]: value});
        
        // Mark field as touched
        setTouched({...touched, [name]: true});
        
        // Validate on change
        validateField(name, value);
    };
    
    // Handle blur event for validation
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({...touched, [name]: true});
        validateField(name, value);
    };
    
    // Validate a single field
    const validateField = (name, value) => {
        let newErrors = {...errors};
        
        switch(name) {
            case 'fullname':
                if (!value.trim()) {
                    newErrors.fullname = 'Full name is required';
                } else if (value.length < 3) {
                    newErrors.fullname = 'Full name must be at least 3 characters';
                } else {
                    delete newErrors.fullname;
                }
                break;
                
            case 'email':
                if (!value) {
                    newErrors.email = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    newErrors.email = 'Email is invalid';
                } else {
                    delete newErrors.email;
                }
                break;
                
            case 'password':
                if (!value) {
                    newErrors.password = 'Password is required';
                } else if (value.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters';
                } else {
                    delete newErrors.password;
                }
                
                // Also validate confirm password if it's been touched
                if (touched.confirmPassword) {
                    if (value !== user.confirmPassword) {
                        newErrors.confirmPassword = 'Passwords do not match';
                    } else {
                        delete newErrors.confirmPassword;
                    }
                }
                break;
                
            case 'confirmPassword':
                if (!value) {
                    newErrors.confirmPassword = 'Please confirm your password';
                } else if (value !== user.password) {
                    newErrors.confirmPassword = 'Passwords do not match';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
                
            case 'phone':
                if (value && !/^[0-9]{10}$/.test(value)) {
                    newErrors.phone = 'Phone number must be 10 digits';
                } else {
                    delete newErrors.phone;
                }
                break;
                
            default:
                break;
        }
        
        setErrors(newErrors);
    };
    
    // Validate all fields
    const validateForm = () => {
        // Validate all fields
        validateField('fullname', user.fullname);
        validateField('email', user.email);
        validateField('password', user.password);
        validateField('confirmPassword', user.confirmPassword);
        validateField('phone', user.phone);
        
        // Mark all fields as touched
        setTouched({
            fullname: true,
            email: true,
            password: true,
            confirmPassword: true,
            phone: true
        });
        
        // Return true if no errors
        return Object.keys(errors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields before submission
        if (!validateForm()) {
            return; // Stop submission if validation fails
        }
        
        try {
            // Remove confirmPassword before sending to backend
            const userData = {
                fullname: user.fullname,
                email: user.email,
                password: user.password,
                phone: user.phone
            };
            
            await axios.post("http://localhost:8080/user", userData);
            alert("User registered successfully");
            navigate("/login"); // Use navigate instead of window.location.href
        } catch (error) {
            console.error("Registration error:", error);
            if (error.response && error.response.status === 400) {
                alert("Registration failed: " + (error.response.data.message || "Email may already be in use"));
            } else {
                alert("Registration failed. Please try again.");
            }
        }
    }




  return (
    <div className="register-container">
      <div className="register-form-container">
        <h1>Join Snapture</h1>
        <form onSubmit={(e) => onSubmit(e)} className="register-form">
        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <input 
            type="text" 
            id="fullname" 
            name="fullname" 
            onChange={onInputChange} 
            onBlur={handleBlur}
            value={user.fullname} 
            className={touched.fullname && errors.fullname ? 'input-error' : ''}
          />
          {touched.fullname && errors.fullname && <span className="error-message">{errors.fullname}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            onChange={onInputChange} 
            onBlur={handleBlur}
            value={user.email} 
            className={touched.email && errors.email ? 'input-error' : ''}
          />
          {touched.email && errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            onChange={onInputChange} 
            onBlur={handleBlur}
            value={user.password} 
            className={touched.password && errors.password ? 'input-error' : ''}
          />
          {touched.password && errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            onChange={onInputChange} 
            onBlur={handleBlur}
            value={user.confirmPassword} 
            className={touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}
          />
          {touched.confirmPassword && errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input 
            type="text" 
            id="phone" 
            name="phone" 
            onChange={onInputChange} 
            onBlur={handleBlur}
            value={user.phone} 
            className={touched.phone && errors.phone ? 'input-error' : ''}
          />
          {touched.phone && errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <button type="submit" className="form-btn">Create Account</button>
        
        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
          <p><Link to="/">Back to Snapture</Link></p>
        </div>
      </form>
    </div>
    </div>
  )
    
  };


export default Register;