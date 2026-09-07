import React, { useState } from 'react';
import './LandingPage.css';

export default function TypeformSortingLanding() {
  const [activeTab, setActiveTab] = useState('bubble');

  const handleNavigateToLogin = () => {
    window.location.href = '/login/index.html'; // Directs to your login page
  };

  return (
    <div className="tf-site-wrapper">
      {/* Navbar */}
      <header className="tf-navbar">
        <div className="tf-brand">
          <span className="tf-brand-dot"></span>Sorting Visualizer<span className="tf-brand-sub">.</span>
        </div>
        <nav className="tf-nav-links">
          <a href="#features">Features</a>
          <a href="#algorithms">Algorithms</a>
          <a href="#visualizer">Visualizer</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="tf-nav-actions">
          <button className="tf-btn-secondary" onClick={handleNavigateToLogin}>Sign In</button>
          <button className="tf-btn-primary" onClick={handleNavigateToLogin}>Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="tf-hero-section">
        <div className="tf-pill-badge">
          <span className="badge-icon">⚡</span> Interactive CS Learning
        </div>
        
        <h1 className="tf-hero-title">
          People read code. <br />
          <span className="tf-color-accent">You build an understanding.</span>
        </h1>

        <p className="tf-hero-subtitle">
          Master Bubble, Selection, Insertion, Merge, and Quick sorts through real-time 
          graphics, dynamic step explanations, and live side-by-side performance comparisons.
        </p>

        <div className="tf-hero-cta-group">
          <button className="tf-main-cta" onClick={handleNavigateToLogin}>
            Try Free Trial &rarr;
          </button>
          <span className="tf-micro-note">No credit card required • Instant browser access</span>
        </div>

        
        <div id="visualizer" className="tf-interactive-preview">
          <div className="tf-preview-topbar">
            <div className="window-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="preview-label">sortmaster_preview_engine.js</span>
            <div className="preview-status">Live Simulation</div>
          </div>

          <div className="tf-preview-content">
            <div className="preview-sidebar-controls">
              <button 
                className={`tab-btn ${activeTab === 'bubble' ? 'active' : ''}`}
                onClick={() => setActiveTab('bubble')}
              >
                Bubble Sort
              </button>
              <button 
                className={`tab-btn ${activeTab === 'selection' ? 'active' : ''}`}
                onClick={() => setActiveTab('selection')}
              >
                Selection Sort
              </button>
              <button 
                className={`tab-btn ${activeTab === 'insertion' ? 'active' : ''}`}
                onClick={() => setActiveTab('insertion')}
              >
                Insertion Sort
              </button>
            </div>

            <div className="preview-visualizer-screen">
              <div className="mock-bars-container">
                <div className="m-bar" style={{ height: '35%' }}><span>35</span></div>
                <div className="m-bar compare" style={{ height: '85%' }}><span>85</span></div>
                <div className="m-bar swap" style={{ height: '60%' }}><span>60</span></div>
                <div className="m-bar" style={{ height: '20%' }}><span>20</span></div>
                <div className="m-bar sorted" style={{ height: '95%' }}><span>95</span></div>
                <div className="m-bar" style={{ height: '50%' }}><span>50</span></div>
              </div>
              <div className="mock-code-box">
                <code>
                  {activeTab === 'bubble' && "if (arr[j] > arr[j+1]) { swap(arr[j], arr[j+1]); }"}
                  {activeTab === 'selection' && "minIdx = j; // finding minimum element index"}
                  {activeTab === 'insertion' && "while (j >= 0 && arr[j] > key) { arr[j+1] = arr[j]; }"}
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Features Section */}
      <section id="features" className="tf-value-section">
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '800', marginBottom: '30px' }}>Core Features</h2>
        <div className="tf-value-grid">
          <div className="tf-card">
            <h3>🔍 Real-Time Explanations</h3>
            <p>Every single step is broken down in plain English so you never have to guess why a swap or comparison happens.</p>
          </div>
          <div className="tf-card">
            <h3>⚡ Side-by-Side Compare</h3>
            <p>Run Bubble sort and Insertion sort head-to-head on identical arrays to see performance differences visually.</p>
          </div>
          <div className="tf-card">
            <h3>🎛️ Custom Data Sets</h3>
            <p>Input your own custom numbers or generate random arrays instantly to test algorithm behavior under pressure.</p>
          </div>
        </div>
      </section>

      {/* 2. Algorithms Section */}
      <section id="algorithms" style={{ maxwidth: '1000px', margin: '80px auto', width: '100%', padding: '0 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>Supported Algorithms</h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Learn and visualize classical computer science sorting mechanics.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div className="tf-card">
            <h3>Bubble Sort</h3>
            <p style={{ margin: '10px 0', fontSize: '13px', color: '#555' }}>Repeatedly swaps adjacent elements if they are in the wrong order.</p>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2b59ff' }}>Time Complexity: O(n²)</span>
          </div>
          <div className="tf-card">
            <h3>Selection Sort</h3>
            <p style={{ margin: '10px 0', fontSize: '13px', color: '#555' }}>Finds the minimum element and places it at the beginning.</p>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2b59ff' }}>Time Complexity: O(n²)</span>
          </div>
          <div className="tf-card">
            <h3>Insertion Sort</h3>
            <p style={{ margin: '10px 0', fontSize: '13px', color: '#555' }}>Builds the final sorted array one item at a time efficiently.</p>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2b59ff' }}>Time Complexity: O(n²)</span>
          </div>
          <div className="tf-card">
            <h3>Merge & Quick Sort</h3>
            <p style={{ margin: '10px 0', fontSize: '13px', color: '#555' }}>Advanced divide-and-conquer sorting mechanisms for speed.</p>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#2b59ff' }}>Time Complexity: O(n log n)</span>
          </div>
        </div>
      </section>

     {/* 3. Contact & Footer Section */}
      <footer id="contact" className="tf-contact-section">
        <div className="tf-contact-container">
          <h2 className="tf-contact-title">Get in Touch</h2>
          <p className="tf-contact-subtitle">Designed & Developed with ❤️ for Interactive CS Learning. Let's connect!</p>
          
          <div className="tf-social-links-grid">
            {/* Instagram Link */}
            <a 
              href="https://instagram.com/anubhav_ji" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="tf-social-card instagram"
            >
              <i className='bx bxl-instagram tf-social-icon'></i>
              <div className="tf-social-info">
                <span className="tf-social-label">Follow me on</span>
                <span className="tf-social-name">Instagram</span>
              </div>
            </a>

            {/* GitHub Link */}
            <a 
              href="https://github.com/anubhav98764" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="tf-social-card github"
            >
              <i className='bx bxl-github tf-social-icon'></i>
              <div className="tf-social-info">
                <span className="tf-social-label">Check out my</span>
                <span className="tf-social-name">GitHub Account</span>
              </div>
            </a>
          </div>

          <p className="tf-copyright">© 2026 SortMaster. All rights reserved.</p>
        </div>
      </footer>
      
    </div>
  );
}