// src/components/PlayerAvatar.js
import React from 'react';
import './PlayerAvatar.css';

// Import your images
import level1Avatar from './assets/level-1.png';
import level5Avatar from './assets/level-5.png';
import level10Avatar from './assets/level-10.png';

const PlayerAvatar = ({ level }) => {
  let avatarSrc = level1Avatar;
  let avatarClass = 'level-1';

  if (level >= 10) {
    avatarSrc = level10Avatar;
    avatarClass = 'level-10';
  } else if (level >= 5) {
    avatarSrc = level5Avatar;
    avatarClass = 'level-5';
  }

  return (
    <div className={`player-avatar-container ${avatarClass}`}>
      <img src={avatarSrc} alt={`Level ${level} Avatar`} className="player-avatar-img" />
    </div>
  );
};

export default PlayerAvatar;