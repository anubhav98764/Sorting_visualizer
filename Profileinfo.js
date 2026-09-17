import React, { useState } from 'react';
import './Profileinfo.css';

export default function ProfileForm() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    // Phase 1
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    city: '',
    state: '',
    bio: '',

    // Phase 2
    userType: '',
    experience: '',
    institution: '',
    year: '',
    course: '',
    address: '',
    pincode: '',
    studentCity: '',
    studentState: '',
    company: '',
    designation: '',

    // Phase 3
    skills: '',
    languages: '',
    interests: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const validateCurrentPhase = () => {
    if (currentPhase === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.dob.trim() || !formData.city.trim()) {
        setErrorMsg('Please fill in all required personal details.');
        return false;
      }
    } else if (currentPhase === 2) {
      if (!formData.userType) {
        setErrorMsg('Please select your current status.');
        return false;
      }
      if ((formData.userType === 'student' || formData.userType === 'both') && (!formData.institution.trim() || !formData.course.trim())) {
        setErrorMsg('Please fill in your Institution and Course details.');
        return false;
      }
    } else if (currentPhase === 3) {
      if (!formData.skills.trim()) {
        setErrorMsg('Please enter at least your primary skills.');
        return false;
      }
    }
    setErrorMsg('');
    return true;
  };

  const handleNext = () => {
    if (validateCurrentPhase()) {
      if (currentPhase < 3) {
        setCurrentPhase(currentPhase + 1);
      }
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateCurrentPhase()) {
      try {
        const response = await fetch('http://localhost:5000/api/save-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
          alert("Profile details saved successfully in respective MongoDB collections!");
          console.log("Saved response:", result);
        } else {
          alert("Failed to save: " + result.error);
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("⚠️ Error connecting to server.");
      }
    }
  };

  const getPhaseTitle = () => {
    const titles = {
      1: 'Personal Information',
      2: 'Professional / Educational Details',
      3: 'Skills & Interests'
    };
    return titles[currentPhase];
  };

  const getPhaseDescription = () => {
    const descriptions = {
      1: 'Tell us a bit about yourself',
      2: 'Share your academic and professional background',
      3: 'Highlight your technical stack & goals'
    };
    return descriptions[currentPhase];
  };

  return (
    <div className="profile-page-wrapper">
      <div className="form-container">
        
        {/* Back to Home Link inside the form container */}
        <div className="back-home-container">
          <a href="/" className="back-home-link">← Back to Home</a>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Progress Indicator */}
          <div className="progress-section">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${((currentPhase - 1) / 2) * 100}%` }}></div>
            </div>
            <div className="phase-indicators">
              {[1, 2, 3].map((phase) => (
                <div 
                  key={phase}
                  className={`phase-dot ${phase === currentPhase ? 'active' : ''} ${phase < currentPhase ? 'completed' : ''}`}
                >
                  {phase < currentPhase ? '✓' : phase}
                </div>
              ))}
            </div>
          </div>

          {/* Form Header */}
          <div className="form-header">
            <h2>{getPhaseTitle()}</h2>
            <p className="subtitle">{getPhaseDescription()}</p>
          </div>

          {/* Error Notification Alert */}
          {errorMsg && <div className="error-banner">{errorMsg}</div>}

          {/* PHASE 1 - PERSONAL INFORMATION */}
          {currentPhase === 1 && (
            <div className="phase-content">
              <div className="input-group-row">
                <div className="input-box">
                  <input 
                    type="text" 
                    placeholder="Full Name *" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="input-box">
                  <input 
                    type="email" 
                    placeholder="Email Address *" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="input-group-row">
                <div className="input-box">
                  <input 
                    type="tel" 
                    placeholder="Phone Number *" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                  />
                </div>

                <div className="input-box">
                  <input 
                    type="text" 
                    placeholder="Date of Birth *" 
                    name="dob" 
                    value={formData.dob} 
                    onChange={handleChange}
                    onFocus={(e) => e.target.type = 'date'} 
                    onBlur={(e) => { if (!e.target.value) e.target.type = 'text'; }} 
                  />
                </div>
              </div>

              <div className="input-group-row">
                <div className="input-box">
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Prefer not to say</option>
                  </select>
                </div>

                <div className="input-box">
                  <input 
                    type="text" 
                    placeholder="City *" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                  />
                </div>
                <div className="input-box">
                  <input 
                    type="text" 
                    placeholder="State *" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="input-box">
                <textarea 
                  placeholder="Short Bio..." 
                  name="bio" 
                  rows="3" 
                  value={formData.bio} 
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          )}

          {/* PHASE 2 - PROFESSIONAL/EDUCATIONAL INFO */}
          {currentPhase === 2 && (
            <div className="phase-content">
              <div className="input-group-row">
                <div className="input-box">
                  <select 
                    name="userType" 
                    value={formData.userType} 
                    onChange={handleChange}
                  >
                    <option value="">Select Status *</option>
                    <option value="student">Student</option>
                    <option value="professional">Working Professional</option>
                    <option value="both">Student & Working</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="input-box">
                  <input 
                    type="text" 
                    placeholder="Experience" 
                    name="experience" 
                    value={formData.experience} 
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Student Fields */}
              {(formData.userType === 'student' || formData.userType === 'both') && (
                <div className="sub-section">
                  <p className="field-group-label">Educational Information *</p>
                  <div className="input-group-row">
                    <div className="input-box">
                      <input 
                        type="text" 
                        placeholder="Institution Name *" 
                        name="institution" 
                        value={formData.institution} 
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-box">
                      <input 
                        type="text" 
                        placeholder="Year *" 
                        name="year" 
                        value={formData.year} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="input-box">
                    <input 
                      type="text" 
                      placeholder="Course *" 
                      name="course" 
                      value={formData.course} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-box">
                    <input 
                      type="text" 
                      placeholder="Address *" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-group-row">
                    <div className="input-box">
                      <input 
                        type="text" 
                        placeholder="Pincode *" 
                        name="pincode" 
                        value={formData.pincode} 
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-box">
                      <input 
                        type="text" 
                        placeholder="City *" 
                        name="studentCity" 
                        value={formData.studentCity} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="input-box">
                    <input 
                      type="text" 
                      placeholder="State *" 
                      name="studentState" 
                      value={formData.studentState} 
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {/* Professional Fields */}
              {(formData.userType === 'professional' || formData.userType === 'both') && (
                <div className="sub-section">
                  <p className="field-group-label">Professional Information</p>
                  <div className="input-group-row">
                    <div className="input-box">
                      <input 
                        type="text" 
                        placeholder="Company Name" 
                        name="company" 
                        value={formData.company} 
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-box">
                      <input 
                        type="text" 
                        placeholder="Job Title" 
                        name="designation" 
                        value={formData.designation} 
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PHASE 3 - SKILLS & INTERESTS */}
          {currentPhase === 3 && (
            <div className="phase-content">
              <div className="input-box">
                <input 
                  type="text" 
                  placeholder="Primary Skills (e.g., React, Java) *" 
                  name="skills" 
                  value={formData.skills} 
                  onChange={handleChange}
                />
              </div>

              <div className="input-box">
                <input 
                  type="text" 
                  placeholder="Languages Known" 
                  name="languages" 
                  value={formData.languages} 
                  onChange={handleChange}
                />
              </div>

              <div className="input-box">
                <textarea 
                  placeholder="Areas of Interest & Goals..." 
                  name="interests" 
                  rows="3" 
                  value={formData.interests} 
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="button-container">
            {currentPhase > 1 && (
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={handlePrev}
              >
                Previous
              </button>
            )}
            
            {currentPhase < 3 ? (
              <button 
                type="button" 
                className="btn-primary-custom" 
                onClick={handleNext}
              >
                Next Step
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn-primary-custom"
              >
                Save Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}