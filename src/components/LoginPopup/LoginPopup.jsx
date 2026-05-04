import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";

const LoginPopup = ({ setShowLogin, setLoggedInUser }) => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      currentState === "Sign up"
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert(`Successfully ${currentState === "Sign up" ? "registered" : "logged in"}`);
        setLoggedInUser(data.name); 
        setShowLogin(false); 
        setFormData({ name: "", email: "", password: "" }); 
        setErrorMessage("");
      } else {
        setErrorMessage(data.error || "An error occurred"); 
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            src={assets.cross_icon}
            alt="cross_icon"
            onClick={() => setShowLogin(false)}
          />
        </div>
        <div className="eror__div">
          {errorMessage && <p className="error-message">{errorMessage}</p>} 
          </div>
        <div className="login-popup-inputs">
          {currentState === "Sign up" && (
            <input
              type="text"
              placeholder="Your name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">
          {currentState === "Sign up" ? "Create Account" : "Login"}
        </button>

        

        {currentState === "Sign up" && (
          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy</p>
          </div>
        )}

        {currentState === "Login" ? (
          <p>
            Create a new account?
            <span onClick={() => setCurrentState("Sign up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
