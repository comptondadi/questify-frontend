// src/components/GameMap.js
import React from 'react';
import './GameMap.css';

// Define the map nodes
const mapLevels = [
  { id: 1, name: 'The Humble Village', top: '85%', left: '10%' },
  { id: 2, name: 'Whispering Woods', top: '70%', left: '30%' },
  { id: 3, name: 'Crystal Caves', top: '55%', left: '20%' },
  { id: 4, name: 'Sunken Ruins', top: '40%', left: '40%' },
  { id: 5, name: 'Serpent\'s Pass', top: '25%', left: '60%' },
  { id: 6, name: 'Dragon\'s Peak', top: '10%', left: '75%' },
  // Add more levels here!
];

const GameMap = ({ userLevel }) => {
  return (
    <div className="game-map-container">
      <h3>Your Journey</h3>
      <div className="game-map">
        {/* Render the path lines */}
        <svg className="map-path" width="100%" height="100%">
          <path d="M 50 450 C 150 350, 100 250, 200 200 C 300 150, 400 100, 500 50" />
        </svg>

        {/* Render the level nodes */}
        {mapLevels.map(level => {
          const isUnlocked = userLevel >= level.id;
          const isCurrent = userLevel === level.id;
          
          let nodeClass = 'map-node';
          if (isUnlocked) nodeClass += ' unlocked';
          if (isCurrent) nodeClass += ' current';

          return (
            <div key={level.id} className={nodeClass} style={{ top: level.top, left: level.left }}>
              <div className="node-circle"></div>
              <div className="node-label">{level.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GameMap;