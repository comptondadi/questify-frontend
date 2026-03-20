// src/components/LevelUpModal.js
import React from 'react';
import './LevelUpModal.css';

const LevelUpModal = ({ newLevel, onClose }) => {
  // You can add lore/titles for each level here
  const levelTitles = {
    2: "Initiate of the Shadow Path",
    3: "Acolyte of the Unseen",
    4: "Keeper of the Forgotten Lore",
    5: "Vanguard of the Dragon's Peak",
  };

  const title = levelTitles[newLevel] || `Guardian of the Realm`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h1>LEVEL UP!</h1>
        </div>
        <div className="modal-body">
          <p>You have reached</p>
          <h2>Level {newLevel}</h2>
          <h3>{title}</h3>
          <p className="unlock-text">A new stage of your journey awaits.</p>
        </div>
        <button className="modal-close-button" onClick={onClose}>
          Continue Your Quest
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;