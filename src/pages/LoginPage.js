// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Using Link for the signup
import apiClient from '../services/api';
import Modal from '../components/Modal';
import './LoginPage.css';

const LoginPage = () => {
  // State for the form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- THIS WAS MISSING ---
  // State to control the visibility of the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    try {
      const response = await apiClient.post('/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      const { access_token } = response.data;
      
      if (access_token) {
        localStorage.setItem('accessToken', access_token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        navigate('/dashboard');
      } else {
        setError('Login successful, but no token received.');
      }
      
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('An unexpected error occurred. Please try again.');
        console.error('Login Error:', err);
      }
    }
  };

  // The component must return a single top-level element. We use a fragment (<>...</>).
  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <h1>Questify</h1>
          <p className="subtitle">Level up your life, one habit at a time.</p>
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username or Email"
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
              Start Quest
            </button>
          </form>

          {/* Combined footer links */}
          <div className="footer-links">
            {/* Using <Link> component for internal navigation is better than <a href> */}
            <span>Don't have an account? <Link to="/signup">Sign Up</Link></span>
            <span className="how-it-works-link" onClick={() => setIsModalOpen(true)}>
              How does it work?
            </span>
          </div>

        </div>
      </div>

      {/* The Modal for "How it Works" */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="about-content">
          <h2>How Questify Works</h2>
          <p>
            Questify transforms building good habits into a fun and rewarding adventure, inspired by Role-Playing Games (RPGs). Instead of a boring checklist, you embark on a personal journey of growth.
          </p>
          
          <h3>Your Journey:</h3>
          <ol>
            <li><strong>Create "Quests":</strong> Every habit you want to build, from "Drink Water" to "Exercise for 30 mins," becomes a daily Quest.</li>
            <li><strong>Earn Experience (XP):</strong> Each time you complete a Quest, you gain XP, just like in a game.</li>
            <li><strong>Level Up:</strong> Accumulate enough XP, and you'll Level Up! This is a powerful milestone that shows your consistent effort and dedication.</li>
            <li><strong>Focus on Growth:</strong> Questify emphasizes your overall Level as the main indicator of progress. Don't worry about breaking a "streak"—every completed quest moves you forward on your journey!</li>
          </ol>

          <h3>Frequently Asked Questions (FAQ)</h3>
          <div className="faq-item">
            <h4>1. What happens if I miss a day?</h4>
            <p>Absolutely nothing bad! Unlike other apps, we don't punish you. Your level and XP remain safe. Your goal is long-term growth, not perfect, unbroken streaks. Just pick up where you left off and continue your journey.</p>
          </div>
          <div className="faq-item">
            <h4>2. How is the XP calculated?</h4>
            <p>For now, every quest gives a standard amount of XP. This ensures that every positive action, big or small, contributes equally to your progress. Future updates may allow for customizable XP values.</p>
          </div>
          <div className="faq-item">
            <h4>3. Can I use this on my phone?</h4>
            <p>Yes! Questify is a fully responsive web application. While it's not a native mobile app yet, you can access it and use all its features through the web browser on any modern smartphone.</p>
          </div>
          <div className="faq-item">
            <h4>4. Is my data secure?</h4>
            <p>Yes. Your password is encrypted using industry-standard hashing algorithms, meaning even we cannot see it. All data transmission is prepared for secure connections to protect your privacy.</p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoginPage;