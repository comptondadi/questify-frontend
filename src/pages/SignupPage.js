// src/pages/SignupPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import './LoginPage.css'; // We can reuse the same styles!

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); // New state for email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // For success message
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // For user creation, we send a JSON object
  const userData = {
    email: email,
    username: username,
    password: password,
  };


    try {
      // For creating a user, we send a JSON payload
      // TO:
      await apiClient.post('/users/', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setSuccess('Account created successfully! Please log in.');
      
      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail); // Show specific error from backend
      } else {
        setError('Failed to create account. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Join Questify</h1>
        <p className="subtitle">Start your epic journey of self-improvement.</p>

        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email Address"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Create Account
          </button>
        </form>
        <div className="navigation-link">
          <p>Already have an account? <Link to="/">Log In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;