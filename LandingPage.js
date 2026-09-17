import React, { useState, useEffect } from 'react';
import './LandingPage.css';


function generateRandomArray(size = 6) {
  const arr = [];
  const used = new Set();
  while (arr.length < size) {
    const val = 15 + Math.floor(Math.random() * 80);
    if (!used.has(val)) {
      used.add(val);
      arr.push(val);
    }
  }
  return arr;
}

function generateBubbleSteps(input) {
  const a = [...input];
  const n = a.length;
  const steps = [];
  for (let i = 0; i < n - 1; i++) {
    let swappedAny = false;
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({ array: [...a], compare: [j, j + 1], swap: false });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ array: [...a], compare: [j, j + 1], swap: true });
        swappedAny = true;
      }
    }
    if (!swappedAny) break;
  }
  steps.push({ array: [...a], compare: [], swap: false, done: true });
  return steps;
}

function generateSelectionSteps(input) {
  const a = [...input];
  const n = a.length;
  const steps = [];
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({ array: [...a], compare: [minIdx, j], swap: false });
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      steps.push({ array: [...a], compare: [i, minIdx], swap: true });
    }
  }
  steps.push({ array: [...a], compare: [], swap: false, done: true });
  return steps;
}

function generateInsertionSteps(input) {
  const a = [...input];
  const n = a.length;
  const steps = [];
  for (let i = 1; i < n; i++) {
    const key = a[i];
    let j = i - 1;
    steps.push({ array: [...a], compare: [i], swap: false, key });
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      steps.push({ array: [...a], compare: [j, j + 1], swap: true, key });
      j--;
    }
    a[j + 1] = key;
    steps.push({ array: [...a], compare: [], swap: false });
  }
  steps.push({ array: [...a], compare: [], swap: false, done: true });
  return steps;
}

const GENERATORS = {
  bubble: generateBubbleSteps,
  selection: generateSelectionSteps,
  insertion: generateInsertionSteps,
};

function stepDescription(tab, step) {
  if (!step) return '// preparing array…';
  if (step.done) return '// array sorted ✓';
  const { compare, swap, array, key } = step;

  if (tab === 'bubble' && compare.length === 2) {
    const [i, j] = compare;
    return swap
      ? `swap(arr[${i}], arr[${j}])`
      : `if (arr[${i}] > arr[${j}])`;
  }
  if (tab === 'selection' && compare.length === 2) {
    const [minIdx, j] = compare;
    return swap
      ? `swap(arr[i], arr[minIdx])`
      : `find minimum → compare`;
  }
  if (tab === 'insertion') {
    if (compare.length === 1) {
      return `key = arr[${compare[0]}]`;
    }
    if (compare.length === 2) {
      return `shift & insert`;
    }
  }
  return '// stepping through…';
}

export default function LandingPage3D({ onOpenSubscription,onOpenProfileModal }) {
  const [activeTab, setActiveTab] = useState('bubble');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timeoutId;

    const runCycle = () => {
      const baseArray = generateRandomArray(6);
      const generatedSteps = GENERATORS[activeTab](baseArray);
      setSteps(generatedSteps);

      let idx = 0;
      setStepIndex(0);

      const tick = () => {
        if (cancelled) return;
        setStepIndex(idx);
        if (idx >= generatedSteps.length - 1) {
          timeoutId = setTimeout(() => {
            if (!cancelled) runCycle();
          }, 1600);
          return;
        }
        idx += 1;
        timeoutId = setTimeout(tick, 550);
      };

      tick();
    };

    runCycle();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [activeTab]);

  const currentStep = steps[stepIndex];
  const displayValues = currentStep ? currentStep.array : generateRandomArray(6);
  const maxVal = Math.max(...displayValues, 1);
  const isFinalStep = !!currentStep && stepIndex === steps.length - 1;

  const barState = (index) => {
    if (isFinalStep) return 'sorted';
    if (currentStep && currentStep.compare.includes(index)) {
      return currentStep.swap ? 'swap' : 'compare';
    }
    return '';
  };

  const faqItems = [
    {
      q: 'Which sorting algorithms can I visualize?',
      a: 'Bubble sort, selection sort, and insertion sort are animated step by step. Merge sort and quick sort are covered with complexity breakdowns and are getting live animation soon.',
    },
    {
      q: 'Do I need to install anything?',
      a: 'No. Everything runs directly in your browser — no downloads, accounts, or setup required to start exploring.',
    },
    {
      q: "What does 'time complexity' actually mean?",
      a: 'It describes how the number of steps an algorithm takes grows as the input gets bigger. O(n²) algorithms slow down quickly on large arrays; O(n log n) algorithms scale much better.',
    },
    {
      q: 'Can I use my own numbers instead of random ones?',
      a: 'Yes — the full visualizer lets you type in a custom array or generate a random one, so you can test edge cases.',
    },
  ];

  return (
    <div className="site-3d-wrapper">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Navbar */}
      <header className="navbar-3d">
        <div className="navbar-content">
          <div className="brand-3d">
            <div className="brand-icon">✨</div>
            <span className="brand-text">Buddy Sort</span>
          </div>

          <nav className={`nav-links-3d ${menuOpen ? 'open' : ''}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#algorithms" onClick={() => setMenuOpen(false)}>Algorithms</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          </nav>

          <div className="nav-actions-3d">
            <button className="btn-cta-3d" onClick={onOpenSubscription}>Upgrade</button>
            <button className="btn-cta-3d" onClick={onOpenProfileModal}>Get Started</button>

            <button className="menu-toggle-3d" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-3d">
        <div className="hero-content">
          <div className="hero-text">
            <div className="badge-3d">
              <span className="badge-dot">●</span>
              Sorting Algorithms Visualizer
            </div>
            <h1 className="hero-title">See Algorithms In Motion</h1>
            <p className="hero-subtitle">Watch, learn, and understand sorting algorithms with real-time visualization. No theory without practice.</p>
            <div className="hero-buttons">
              <button className="btn-primary-3d" onClick={onOpenSubscription}>Start Visualizing</button>
              <button className="btn-secondary-3d">Learn More ↓</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cube"></div>
          </div>
        </div>
      </section>

      {/* Interactive Preview */}
      <section className="preview-section-3d">
        <div className="preview-wrapper">
          <div className="preview-card-3d">
            <div className="preview-header-3d">
              <div className="window-controls">
                <span className="control red"></span>
                <span className="control yellow"></span>
                <span className="control green"></span>
              </div>
              <span className="preview-title">Live Sorting Visualizer</span>
              <div className="preview-badge">● Animating</div>
            </div>

            <div className="preview-body-3d">
              <div className="algorithm-tabs-3d">
                {['bubble', 'selection', 'insertion'].map((algo) => (
                  <button
                    key={algo}
                    className={`tab-3d ${activeTab === algo ? 'active' : ''}`}
                    onClick={() => setActiveTab(algo)}
                  >
                    {algo.charAt(0).toUpperCase() + algo.slice(1)}
                  </button>
                ))}
              </div>

              <div className="visualizer-3d">
                <div className="bars-container-3d">
                  {displayValues.map((val, idx) => (
                    <div
                      key={idx}
                      className={`bar-3d ${barState(idx)}`}
                      style={{
                        height: `${(val / maxVal) * 100}%`,
                        animation: barState(idx) !== '' ? `bar-pulse 0.3s ease-out` : 'none',
                      }}
                    >
                      <span className="bar-value">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="code-display-3d">
                  <code>{stepDescription(activeTab, currentStep)}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-3d">
        <div className="stats-grid-3d">
          <div className="stat-card-3d">
            <div className="stat-number">5</div>
            <div className="stat-label">Algorithms</div>
          </div>
          <div className="stat-card-3d">
            <div className="stat-number">100%</div>
            <div className="stat-label">Browser-based</div>
          </div>
          <div className="stat-card-3d">
            <div className="stat-number">∞</div>
            <div className="stat-label">Learning</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-3d">
        <h2 className="section-title-3d">Powerful Features</h2>
        <div className="features-grid-3d">
          <div className="feature-card-3d">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Explanations</h3>
            <p>Every comparison and swap is explained in plain English so you understand exactly what's happening.</p>
          </div>
          <div className="feature-card-3d">
            <div className="feature-icon">🔄</div>
            <h3>Side-by-Side Compare</h3>
            <p>Run multiple algorithms on identical arrays to see performance differences visually.</p>
          </div>
          <div className="feature-card-3d">
            <div className="feature-icon">🎯</div>
            <h3>Custom Data Sets</h3>
            <p>Input your own numbers or generate random arrays to test algorithm behavior.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-3d">
        <h2 className="section-title-3d">How It Works</h2>
        <div className="steps-3d">
          <div className="step-card-3d">
            <div className="step-number">1</div>
            <h3>Choose</h3>
            <p>Pick from Bubble, Selection, or Insertion sort</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card-3d">
            <div className="step-number">2</div>
            <h3>Watch</h3>
            <p>See each comparison and swap in real-time</p>
          </div>
          <div className="step-connector"></div>
          <div className="step-card-3d">
            <div className="step-number">3</div>
            <h3>Learn</h3>
            <p>Understand why algorithms differ in performance</p>
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section id="algorithms" className="algorithms-3d">
        <h2 className="section-title-3d">Supported Algorithms</h2>
        <div className="algo-grid-3d">
          <div className="algo-card-3d">
            <h3>Bubble Sort</h3>
            <p>Repeatedly swaps adjacent elements if they're in the wrong order.</p>
            <span className="complexity">O(n²)</span>
          </div>
          <div className="algo-card-3d">
            <h3>Selection Sort</h3>
            <p>Finds the minimum element and places it at the beginning.</p>
            <span className="complexity">O(n²)</span>
          </div>
          <div className="algo-card-3d">
            <h3>Insertion Sort</h3>
            <p>Builds the sorted array one item at a time efficiently.</p>
            <span className="complexity">O(n²)</span>
          </div>
          <div className="algo-card-3d">
            <h3>Merge & Quick Sort</h3>
            <p>Advanced divide-and-conquer sorting for speed.</p>
            <span className="complexity">O(n log n)</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-3d">
        <h2 className="section-title-3d">Questions?</h2>
        <div className="faq-container-3d">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className={`faq-item-3d ${openFaq === idx ? 'open' : ''}`}
              onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
            >
              <div className="faq-question-3d">
                <span className="faq-text">{item.q}</span>
                <span className="faq-icon">{openFaq === idx ? '−' : '+'}</span>
              </div>
              {openFaq === idx && (
                <div className="faq-answer-3d">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-3d">
        <div className="footer-content">
          <h2>Ready to learn sorting?</h2>
          <p>Start visualizing algorithms today</p>
          <button className="btn-primary-3d" onClick={onOpenProfileModal}>
            Get Started
          </button>
          <div className="social-links-3d">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link-3d">GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link-3d">Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link-3d">Instagram</a>
          </div>
          <p className="copyright">© 2026 Buddy Sort. Made with Quxma✨</p>
        </div>
      </footer>
    </div>
  );
}