import React, { useState } from 'react';
import './Subpanel.css';

export default function Subpanel({ onSelectPlan, onOpenLogin }) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null); // Plan ki sari details store karne ke liye
  const [step, setStep] = useState('plans'); // 'plans' | 'billing_select' | 'show_price'

  // Handle plan button click for all plans
  const handlePlanClick = (planType) => {
    if (planType === 'free') {
      const priceVal = isAnnual ? '$0' :'$0';
      const cycleVal = isAnnual ? 'annual (billed annually)' : 'monthly';
      setSelectedPlanDetails({ type: 'free', name: 'Free Plan', price: priceVal, cycle: cycleVal });

      setStep('show_price');
    } else if (planType === 'pro') {
      // Pro Developer ke liye toggle ke hisab se price set karenge
      const priceVal = isAnnual ? '$8' : '$10';
      const cycleVal = isAnnual ? 'annual (billed annually)' : 'monthly';
      setSelectedPlanDetails({ type: 'pro', name: 'Pro Developer Plan', price: priceVal, cycle: cycleVal });
      setStep('show_price');
    } else if (planType === 'enterprise') {
      // Enterprise / Team ke liye
      const priceVal = isAnnual ? '$24' : '$30';
      const cycleVal = isAnnual ? 'annual (billed annually)' : 'monthly';
      setSelectedPlanDetails({ type: 'enterprise', name: 'Institution / Team Plan', price: priceVal, cycle: cycleVal });
      setStep('show_price');
    }
  };

  const handleBillingSelectionForFree = (cycle) => {
    setSelectedPlanDetails({
      type: 'free',
      name: 'Free Plan',
      price: '$0',
      cycle: cycle
    });
    setStep('show_price');
  };

  const handleProceedToLogin = () => {
    if (onOpenLogin) {
      onOpenLogin(selectedPlanDetails);
    }
  };

  // 1. Billing Frequency Choice View (Sirf Free plan ke liye)
  if (step === 'billing_select') {
    return (
      <div className="sub-wrapper" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <span className="sub-badge">⚡ Free Tier Selection</span>
        <h2 className="sub-title" style={{ marginTop: '15px' }}>Choose Your Free Plan Structure</h2>
        <p className="sub-subtitle">Would you like your free tier setup structured monthly or annually?</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', flexWrap: 'wrap' }}>
          <button className="sub-btn primary" onClick={() => handleBillingSelectionForFree('monthly')}>
            Monthly Billing
          </button>
          <button className="sub-btn secondary" onClick={() => handleBillingSelectionForFree('annually')}>
            Annual Billing
          </button>
        </div>

        <div style={{ marginTop: '40px' }}>
          <button onClick={() => setStep('plans')} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}>
            &larr; Back to plans
          </button>
        </div>
      </div>
    );
  }

  // 2. Show Price View (Ab yeh Free, Pro aur Enterprise teeno ke liye sahi naam aur price dikhayega)
  if (step === 'show_price' && selectedPlanDetails) {
    return (
      <div className="sub-wrapper" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <span className="sub-badge">⚡ Summary</span>
        <h2 className="sub-title" style={{ marginTop: '15px' }}>Your Selected Plan Overview</h2>
        
        <div className="pricing-card" style={{ maxWidth: '400px', margin: '30px auto', textAlign: 'left' }}>
          <h3>{selectedPlanDetails.name}</h3>
          <p className="plan-desc">
            {selectedPlanDetails.type === 'free' ? 'Zero cost to start mastering your sorting visualizer tools.' : 'Unlock advanced tools, comparisons, and custom data testing.'}
          </p>
          <div className="price" style={{ margin: '20px 0' }}>
            <h2>{selectedPlanDetails.price}</h2>
            <span>{selectedPlanDetails.type === 'free' ? `/ ${selectedPlanDetails.cycle}` : '/ month'}</span>
          </div>
          <ul className="plan-features" style={{ marginBottom: '20px' }}>
            {selectedPlanDetails.type === 'free' ? (
              <>
                <li>✓ Access to Bubble & Insertion sort</li>
                <li>✓ Single visualizer mode</li>
                <li>✓ Standard community support</li>
              </>
            ) : selectedPlanDetails.type==='enterprise'?(
              <>
                <li>✓ Everything in Pro</li>
                <li>✓ Bulk student accounts & analytics</li>
                <li>✓ Custom algorithm playground integration</li>
                <li>✓ Dedicated support</li>
              </>
              ):(
              <>
                <li>✓ All 5+ Sorting Algorithms (Merge, Quick, etc.)</li>
                <li>✓ Side-by-Side Compare Mode</li>
                <li>✓ Custom array speed & step controls</li>
                <li>✓ Priority profile rendering</li>
              </>
            ) 
          }
          </ul>
          <button className="sub-btn primary" onClick={handleProceedToLogin} style={{ width: '100%' }}>
            Proceed to Login & Subscribe &rarr;
          </button>
        </div>

        <div>
          <button onClick={() => setStep('plans')} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px' }}>
            &larr; Back to plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sub-wrapper">
      <div className="sub-header">
        <span className="sub-badge">⚡ Flexible Plans</span>
        <h1 className="sub-title">Upgrade Your Learning Experience</h1>
        <p className="sub-subtitle">Choose the right plan to unlock advanced algorithm insights and unlimited visualizer comparisons.</p>

        {/* Billing Toggle Switch */}
        <div className="billing-toggle-container">
          <span className={!isAnnual ? 'active-label' : ''}>Monthly</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isAnnual} 
              onChange={() => setIsAnnual(!isAnnual)} 
            />
            <span className="slider-round"></span>
          </label>
          <span className={isAnnual ? 'active-label' : ''}>
            Annual <span className="save-badge">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="pricing-grid">
        {/* Free Plan */}
        <div className="pricing-card">
          <h3>Free</h3>
          <p className="plan-desc">Great for getting started with basic sorting algorithms.</p>
          <div className="price">
            <h2>$0</h2><span>/ forever</span>
          </div>
          <ul className="plan-features">
            <li>✓ Access to Bubble & Insertion sort</li>
            <li>✓ Single visualizer mode</li>
            <li>✓ Standard community support</li>
          </ul>
          <button className="sub-btn secondary" onClick={() => handlePlanClick('free')}>
            Free
          </button>
        </div>

        {/* Pro Developer Plan */}
        <div className="pricing-card popular">
          <div className="popular-badge">Most Popular</div>
          <h3>Pro Developer</h3>
          <p className="plan-desc">Unlock advanced tools, comparisons, and custom data testing.</p>
          <div className="price">
            <h2>{isAnnual ? '$8' : '$10'}</h2><span>/ month</span>
          </div>
          <ul className="plan-features">
            <li>✓ All 5+ Sorting Algorithms (Merge, Quick, etc.)</li>
            <li>✓ Side-by-Side Compare Mode</li>
            <li>✓ Custom array speed & step controls</li>
            <li>✓ Priority profile rendering</li>
          </ul>
          <button className="sub-btn primary" onClick={() => handlePlanClick('pro')}>
            Upgrade to Pro
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="pricing-card">
          <h3>Institution / Team</h3>
          <p className="plan-desc">For coding bootcamps, schools, and engineering teams.</p>
          <div className="price">
            <h2>{isAnnual ? '$24' : '$30'}</h2><span>/ month</span>
          </div>
          <ul className="plan-features">
            <li>✓ Everything in Pro</li>
            <li>✓ Bulk student accounts & analytics</li>
            <li>✓ Custom algorithm playground integration</li>
            <li>✓ Dedicated support</li>
          </ul>
          <button className="sub-btn secondary" onClick={() => handlePlanClick('enterprise')}>
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}