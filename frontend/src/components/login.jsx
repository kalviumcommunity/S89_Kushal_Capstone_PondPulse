// src/components/Login.jsx
import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Simulate login request (replace with API call later)
    console.log('Logging in with:', { email, password });
    setError('');
    alert('Login successful! (simulated)');
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login to PondPulse</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
           />
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
