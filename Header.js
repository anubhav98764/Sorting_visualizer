import React, { useEffect, useState } from 'react';
import './Header.css';
import { SetCustomArray as SetCustomArray2D, resetArray as resetArray2D } from '../2DGraph/2dview';
import { SetCustomArray as SetCustomArray3D, resetArray as resetArray3D } from '../3DGraph/3DView';

const Header = ({
  currentMode,
  setMode,
  customInput,
  setCustomInput,
  algorithm,
  setViewType,
  viewType,
  setAlgorithm,
  isPlaying,
  togglePlayPause,
  stepforward,
  speed,
  setSpeed,
  onLogout
}) => {
  const [user, setUser] = useState(null);

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
      window.location.href = '/';
    }
  };
  const handleApply = () => {
    if (viewType === '3d') {
      SetCustomArray3D();
    } else {
      SetCustomArray2D();
    }
  };
  const handleRandom = () => {
    if (viewType === '3d') {
      resetArray3D();
    } else {
      resetArray2D();
    }
  };

  return (
    <header className="header-container">
      {/* Brand / Logo */}
      <div className="header-brand">
        <div className="logo-glow-dot"></div>
        <h1>Sorting <span>Visualizer</span></h1>
      </div>

      {/* Mode Switcher & Nested Compare Dropdown Group with Gap */}
      <div className="header-mode-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className={`mode-btn ${currentMode === 'single' ? 'active' : ''}`}
          onClick={() => setMode('single')}
        >
          Single View
        </button>

        {/* Compare Mode container */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#1e293b', borderRadius: '8px', padding: '3px', border: '1px solid #334155' }}>
          <button
            className={`mode-btn ${currentMode === 'compare' ? 'active' : ''}`}
            onClick={() => setMode('compare')}
            style={{ margin: 0 }}
          >
            Compare Mode
          </button>

          {/* Jab Compare mode active hoga, tabhi yeh dropdown iske andar show hoga */}
          {currentMode === 'compare' && (
            <select
              className="header-dropdown"
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              style={{ marginLeft: '6px', background: '#0f172a', border: '1px solid #334155', color: '#fff', padding: '4px 8px', borderRadius: '6px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="2d">2D View</option>
              <option value="3d">3D View</option>
            </select>
          )}
        </div>
      </div>

      {/* Data Input Controls */}
      <div className="header-controls-group">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="e.g. 5,10,15,20"
            id="custom-number"
            className="header-input"
            defaultValue={customInput}
          />
          <button className="action-btn apply-btn" onClick={handleApply}>Apply</button>
        </div>
        <button className="action-btn random-btn" onClick={handleRandom}>Random</button>
      </div>

      {/* Algorithm Selector */}
      <div className="algorithm-group">
        <select
          className="header-dropdown"
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

      {/* Playback & Speed Controls */}
      <div className="playback-group">
        <button className={`play-pause-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlayPause}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        {viewType !== '3d' && (
          <button className="step-btn" onClick={stepforward}>Step</button>
        )}
        {viewType !== '3d' && (
          <div className="speed-control">

            <span>Speed</span>
            <input
              type="range"
              min="1"
              max="100"
              className="speed-slider"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      {/* User Profile & Logout */}
      <div className="header-user-section">
        {user ? (
          <div className="user-pill">
            <img
              src={user.profilePicture || "https://via.placeholder.com/35"}
              alt="Profile"
              className="user-avatar"
            />
            <span className="user-name">{user.name || user.username || user.email}</span>
            <button onClick={handleLogoutClick} className="logout-btn">Logout</button>
          </div>
        ) : (
          <span className="guest-badge">Guest Mode</span>
        )}
      </div>
    </header>
  );
};

export default Header;