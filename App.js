import React, { useState } from 'react';
import Header from './Header';
import View from './3dview';
import Landing from './LandingPage';

const App = () => {
  // Check localStorage immediately on load so returning users go straight to the visualizer
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('user') ? 'visualizer' : 'landing';
  });

  const [currentMode, setMode] = useState('single');
  const [customInput, setCustomInput] = useState('');
  const [algorithm, setAlgorithm] = useState('bubble');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const stepForward = () => {};

  // Handlers for switching views
  const handleOpenLogin = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setCurrentView('visualizer');
  };

  // 1. Render Landing Page
  if (currentView === 'landing') {
    return <Landing onFreeTrial={handleOpenLogin} onSignIn={handleOpenLogin} />;
  }

  // 2. Render a simple Login / Authentication screen
  if (currentView === 'login') {
    return (
      <div style={{ background: '#0d0d12', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#0b0b0f', padding: '40px', borderRadius: '15px', border: '1px solid #1f1f2e', textAlign: 'center', width: '350px' }}>
          <h2>Sign In / Free Trial</h2>
          <p style={{ color: '#8a8a9e', fontSize: '13px', margin: '15px 0' }}>Enter your details to launch the Sorting Visualizer.</p>
          <input type="email" placeholder="Email address" style={{ width: '100%', padding: '12px', marginBottom: '15px', background: '#191923', border: '1px solid #2d2d42', color: '#fff', borderRadius: '8px' }} />
          <input type="password" placeholder="Password" style={{ width: '100%', padding: '12px', marginBottom: '20px', background: '#191923', border: '1px solid #2d2d42', color: '#fff', borderRadius: '8px' }} />
          <button 
            onClick={() => {
              // Simulate saving user data to localStorage upon clicking submit
              const mockUser = { name: "Demo User", email: "user@example.com", profilePicture: "https://via.placeholder.com/35" };
              localStorage.setItem('user', JSON.stringify(mockUser));
              handleLoginSuccess();
            }}
            style={{ width: '100%', padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Submit & Enter Visualizer
          </button>
        </div>
      </div>
    );
  }

  // 3. Render the Main Sorting Visualizer App
  return (
    <div className="app-container">
      <Header 
        currentMode={currentMode}
        setMode={setMode}
        customInput={customInput}
        setCustomInput={setCustomInput}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        stepForward={stepForward}
        speed={speed}
        setSpeed={setSpeed}
        onLogout={() => {
          localStorage.removeItem('user');
          setCurrentView('landing');
        }}
      />
      <View 
        currentMode={currentMode}
        algorithm={algorithm}
        isPlaying={isPlaying}
        speed={speed}
        setIsPlaying={setIsPlaying}
      />
    </div>
  );
};

export default App;