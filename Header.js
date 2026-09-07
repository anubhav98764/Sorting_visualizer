import React, { useEffect, useState } from 'react';
import './App.css';
import { SetCustomArray, resetArray } from './3dview.js';

const Header = ({ 
  currentMode, 
  setMode, 
  customInput, 
  setCustomInput, 
  handleCustomApply, 
  handleRandom, 
  algorithm, 
  setAlgorithm, 
  isPlaying, 
  togglePlayPause, 
  stepForward, 
  speed, 
  setSpeed,
  onLogout 
}) => {
  const [user, setUser] = useState(null);

  // Read logged-in user data from localStorage when header mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/'; // Redirect back to landing/login
    }
  };

  return (
    <div className="header">
      <div className="header-text">
        <h1>Sorting Visualizer</h1>
      </div>

      <div className="header-mode">
        <button 
          className={`mode-button ${currentMode === 'single' ? 'active' : ''}`} 
          onClick={() => setMode('single')}
        >
          Single
        </button>
        <button 
          className={`mode-button ${currentMode === 'compare' ? 'active' : ''}`} 
          onClick={() => setMode('compare')}
        >
          Compare
        </button>
      </div>

      <div className="header-input">
        <input 
          type="text" 
          placeholder="e.g. 5,10,15,20" 
          id="custom-number" 
          className="input-box"
        />
        <button onClick={SetCustomArray}>Apply</button>
      </div>

      <button id="random-button" onClick={resetArray}>Random</button>

      <div className="algorithm-type">
        <span className="algorithm-label">Algorithm type</span>
        <select 
          className="algorithm-dropdown"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="quick">Quick Sort</option>
          <option value="merge">Merge Sort</option>
        </select>
      </div>

      <div className="playback-controls">
        <button className="play" onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className="step" onClick={stepForward}>Step</button>

        <div className="speed-slider">
          Speed
          <input 
            type="range" 
            min="1" 
            max="100" 
            className="slider"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Logged-in User Profile & Logout View */}
      <div className="user-profile-section" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
        {user ? (
          <>
            <img 
              src={user.profilePicture || "https://via.placeholder.com/35"} 
              alt="Profile" 
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #8b5cf6' }} 
            />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>
              {user.name || user.username || user.email}
            </span>
            <button 
              onClick={handleLogoutClick}
              style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '4px 10px', borderRadius: '15px', fontSize: '11px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <span style={{ fontSize: '12px', color: '#8a8a9e' }}>Guest</span>
        )}
      </div>
    </div>
  );
};

export default Header;