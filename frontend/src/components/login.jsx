// src/components/Login.jsx
import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <h2 className="login-title">Login to PondPulse</h2>
      <form className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="register-text">
        Don't have an account? <a href="#">Register</a>
      </p>
    </div>
  );
};

export default Login;
