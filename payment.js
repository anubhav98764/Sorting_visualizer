import React, { useState,useEffect } from 'react';
import './payment.css'; 

export default function PaymentForm({ onPaymentSuccess }) {
    const [planDetails, setPlanDetails] = useState(null);

  // Component load hote hi sessionStorage se plan details nikalenge
  useEffect(() => {
    const savedPlan = sessionStorage.getItem('selectedPlan');
    if (savedPlan) {
      try {
        setPlanDetails(JSON.parse(savedPlan));
      } catch (err) {
        console.error('Failed to parse plan details:', err);
      }
    }
  }, []);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    
    // Billing address data ko console ya database me handle karne ke liye
    console.log("Billing Address Submitted:", formData);
    alert('Billing address saved successfully! Opening Visualizer...');

    // Payment/Address complete hone ke baad visualizer open karne ke liye
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  return (
    <div className="pay-container">
      <div className="pay-card">
        {planDetails &&(
        <div style={{ background: '#f3f4f6', padding: '12px 16px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Selected Plan: <strong>{planDetails.name}</strong>
            </span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#7c3aed' }}>
              {planDetails.price}
            </span>
          </div>
        )}
         
        <form onSubmit={handleProceedToPayment}>
          <div className="pay-section" style={{ width: '100%' }}>
            <h3 className="pay-title">BILLING ADDRESS</h3>
            
            <label className="pay-label">Full Name :</label>
            <input type="text" name="fullName" value={formData.fullName} placeholder="Ankit Jha" className="pay-input" onChange={handleChange} required />

            <label className="pay-label">Email :</label>
            <input type="email" name="email" value={formData.email} placeholder="example@example.com" className="pay-input" onChange={handleChange} required />

            <label className="pay-label">Address :</label>
            <input type="text" name="address" value={formData.address} placeholder="Street - Locality" className="pay-input" onChange={handleChange} required />

            <label className="pay-label">City :</label>
            <input type="text" name="city" value={formData.city} placeholder="Delhi" className="pay-input" onChange={handleChange} required />

            <div className="pay-row">
              <div>
                <label className="pay-label">Country :</label>
                <input type="text" name="country" value={formData.country} placeholder="India" className="pay-input" onChange={handleChange} required />
              </div>
              <div>
                <label className="pay-label">Zip Code :</label>
                <input type="text" name="zipCode" value={formData.zipCode} placeholder="123 456" className="pay-input" onChange={handleChange} required />
              </div>
            </div>
          </div>

          <button type="submit" className="pay-submit-btn">Proceed to Payment & Open Visualizer &rarr;</button>
        </form>
      </div>
    </div>
  );
}