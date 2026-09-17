import React, { useState, useEffect } from 'react';
import { stepforward as triggerstep } from './2DGraph/2dview';
import Header from './HeaderSection/Header';
import View from './2DGraph/2dview';
import View3D, { SetCustomArray, resetArray } from './3DGraph/3DView';
import Landing from './LandingPage/LandingPage';
import Subscription from './subscription/Subpanel';
import UserDashboard from './Dashboard/Dashboard';
import AIHelpBox from './AIBoxHelper/Aihelper';
import ProfileForm from './ProfileInfo/Profileinfo';
import Payment from './Payment/payment';

const App = () => {
  const [currentView, setCurrentView] = useState(() => {
    if (localStorage.getItem('user')) {
      return sessionStorage.getItem('selectedPlan') ? 'payment' : 'dashboard';
    }
    return 'landing';
  });

  // Correct state variable name (setShowProfileModal)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  
  const [currentStepData, setCurrentStepData] = useState({
    explanation: "Visualizer is ready. Click start.",
    loopType: "Idle",
    variables: { i: '-', j: '-' }
  });

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const userData = queryparams.get('user');

    if (userData) {
      try {
        localStorage.setItem('user', userData);
        window.history.replaceState({}, document.title, window.location.pathname);

        const savedPlan = sessionStorage.getItem('selectedPlan');
        if (savedPlan) {
          setSelectedPlanDetails(JSON.parse(savedPlan));
          setCurrentView('payment');
        } else {
          window.location.reload();
        }
      } catch (err) {
        console.error('failed to parse user from URL:', err);
      }
    }
  }, []);

  const [currentMode, setMode] = useState('single');
  const [customInput, setCustomInput] = useState('');
  const [algorithm, setAlgorithm] = useState('bubble');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [viewType, setViewType] = useState('2d');

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const stepforward = () => {
    if (viewType === '3d') {
      console.log("3d View is Fully automated!");
    } else {
      triggerstep(currentMode);
    }
  };

  const handleOpenLogin = (planInfo) => {
    if (planInfo) {
      sessionStorage.setItem('selectedPlan', JSON.stringify(planInfo));
    }
    window.location.href = '/login/login.html';
  };

  const handleOpenSubscription = () => {
    setCurrentView('subscription');
  };

  // 1. Render Landing Page (Modal yahan attached hai)
  if (currentView === 'landing') {
    return (
      <div style={{ position: 'relative' }}>
        <Landing
          onFreeTrial={() => handleOpenLogin(null)}
          onSignIn={() => handleOpenLogin(null)}
          onOpenSubscription={handleOpenSubscription}
          onOpenProfileModal={() => setCurrentView('profile-form')}
    
        />

        {/* Profile Modal Popup */}
        {showProfileModal && (
          <div className="modal-overlay" onClick={() => setShowProfileModal(false)} style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
              <button 
                className="modal-close" 
                onClick={() => setShowProfileModal(false)}
                style={{
                  position: 'absolute', top: '10px', right: '15px', background: 'transparent',
                  border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer', zIndex: 10
                }}
              >
                ✕
              </button>
              <ProfileForm /> 
            </div>
          </div>
        )}
      </div>
    );
  }
  // 1.5 Render Profile Form as a Separate Page
 if (currentView === 'profile-form') {
    return (
      <div className="profile-page-wrapper">
        <ProfileForm />
      </div>
    );
  }
  // 2. Render Subscription Panel View
  if (currentView === 'subscription') {
    return (
      <div style={{ background: '#0b0f19', minHeight: '100vh', paddingBottom: '40px' }}>
        <div style={{ padding: '20px 40px' }}>
          <button
            onClick={() => setCurrentView('landing')}
            style={{ background: '#1f1f2e', color: '#fff', border: '1px solid #2d2d42', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            &larr; Back to Home
          </button>
        </div>
        <Subscription
          onSelectPlan={(plan) => alert(`Selected plan: ${plan}`)}
          onOpenLogin={handleOpenLogin}
        />
      </div>
    );
  }

  // 3. Render New Payment Component View
  if (currentView === 'payment') {
    return (
      <Payment onPaymentSuccess={() => {
        sessionStorage.removeItem('selectedPlan');
        setCurrentView('dashboard');
      }} />
    );
  }

  // 3.5 Render User Dashboard View
  if (currentView === 'dashboard') {
    return (
      <UserDashboard 
        onBackToVisualizer={() => setCurrentView('visualizer')} 
      />
    );
  }

  // 4. Render Main Visualizer App
  return (
    <div className="app-container">
      <Header
        currentMode={currentMode}
        setMode={setMode}
        viewType={viewType}
        setViewType={setViewType}
        customInput={customInput}
        setCustomInput={setCustomInput}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        stepforward={stepforward}
        speed={speed}
        setSpeed={setSpeed}
        onLogout={() => {
          localStorage.removeItem('user');
          sessionStorage.removeItem('selectedPlan');
          setCurrentView('landing');
        }}
      />
      {viewType === '3d' ? (
        <View3D 
          algorithm={algorithm}
          isPlaying={isPlaying}
          speed={speed}
          setIsPlaying={setIsPlaying}
        />
      ) : (
        <View
          currentMode={currentMode}
          viewType={viewType}
          algorithm={algorithm}
          isPlaying={isPlaying}
          speed={speed}
          setIsPlaying={setIsPlaying}
        />
      )}
      <AIHelpBox />
    </div>
  );
};

export default App;