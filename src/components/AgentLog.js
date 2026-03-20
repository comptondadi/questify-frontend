// src/components/AgentLog.js
import React from 'react';
import './AgentLog.css';

const AgentLog = ({ messages }) => {
  return (
    <div className="agent-log-card">
      <h3>Chronicler's Log</h3>
      <div className="log-messages">
        {messages.map((msg, index) => (
          <p key={index} className="log-message">{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default AgentLog;