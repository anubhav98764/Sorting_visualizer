import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";
import "./Dashboard.css";

export default function AdvancedDashboard({ onBackToVisualizer, onLogout }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMathOpen, setIsMathOpen] = useState(false);

  const [totalVisits, setTotalVisits] = useState("0");
  const [algoUsageStats, setAlgoUsageStats] = useState({
    merge: 20, quick: 30, insertion: 15, bubble: 25, selection: 10
  });

  const handleLogoutClick = () => {
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/';
    }
  };

  const [user, setUser] = useState({
    name: " ",
    email: "",
    role: "Senior Developer",
    department: "",
    location: "",
    avatar: "AS",
    phone: "",
    bio: "Passionate Computer Science student and full-stack developer.",
    achievements: [
      { icon: "🏆", title: "Top Contributor", value: "45 Visualizations" },
      { icon: "⚡", title: "Performance Expert", value: "98% Accuracy" },
      { icon: "🎓", title: "Mentor Active", value: "12 Mentees" },
      { icon: "🚀", title: "Innovation Lead", value: "5 Projects" }
    ],
    skills: ["React.js", "Three.js", "Algorithm Design", "Data Visualization", "JavaScript", "CSS3"],
    recentActivity: [
      { date: "Today, 2:30 PM", action: "Created new Quick Sort visualization", status: "completed" },
      { date: "Yesterday, 4:15 PM", action: "Mentored 2 students on sorting", status: "completed" },
      { date: "2 days ago", action: "Optimized merge sort algorithm", status: "completed" },
      { date: "3 days ago", action: "Presented 3D visualization workshop", status: "completed" }
    ]
  });

  useEffect(() => {
    let userEmail = "";
    
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        const userData = currentUser.user || currentUser;
        
        userEmail = userData.email || "";
        const fetchedName = userData.name || "Anubhav Singh";
        const initials = fetchedName
          ? fetchedName.split(" ").map(n => n[0]).join("").toUpperCase()
          : "AS";

        setUser(prev => ({
          ...prev,
          name: fetchedName,
          email: userEmail,
          phone: userData.phone || prev.phone,
          avatar: initials,
          department: userData.department || prev.department,
          location: userData.location || prev.location
        }));
      }
    } catch (err) {
      console.error("Error reading from localStorage", err);
    }

    const fetchFreshUserData = async () => {
      if (!userEmail) return;
      try {
        const res = await fetch(`http://localhost:5000/api/user-profile/${userEmail}`);
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) return;
        const data = await res.json();

        if (res.ok && data.user) {
          const freshUser = data.user;
          const personal = data.personal || {};
          const skillsData = data.skills || {};

          let formattedSkills = ["React.js", "Three.js", "JavaScript"];
          if (skillsData.skills) {
            if (Array.isArray(skillsData.skills)) {
              formattedSkills = skillsData.skills;
            } else if (typeof skillsData.skills === 'string') {
              formattedSkills = skillsData.skills.split(',').map(s => s.trim()).filter(Boolean);
            }
          }

          setUser(prev => ({
            ...prev,
            name: freshUser.name || prev.name,
            email: freshUser.email || prev.email,
            phone: personal.phone || prev.phone,
            bio: personal.bio || prev.bio,
            location: personal.city ? `${personal.city}, ${personal.state || ''}` : prev.location,
            skills: formattedSkills
          }));
        }
      } catch (err) {
        console.error("Failed to fetch fresh user profile from backend", err);
      }
    };

    fetchFreshUserData();
  }, []);

  const stats = [
    { number: totalVisits || "0", label: "Total Visualizations", color: "gradient-blue", icon: "📊" },
    { number: "98%", label: "Algorithm Accuracy", color: "gradient-green", icon: "✅" },
    { number: "Active", label: "System Status", color: "gradient-purple", icon: "⏱️" },
    { number: "19", label: "Active Queries", color: "gradient-orange", icon: "💬" }
  ];

  // ✅ Fixed: Accessing properties securely from `algoUsageStats` object
  const pieData = [
    { name: "Quick Sort", value: algoUsageStats.quick, color: "#3b82f6" },
    { name: "Bubble Sort", value: algoUsageStats.bubble, color: "#10b981" },
    { name: "Merge Sort", value: algoUsageStats.merge, color: "#06b6d4" },
    { name: "Selection sort", value: algoUsageStats.selection, color: "#ffc10b" },
    { name: "Insertion sort", value: algoUsageStats.insertion, color: "#fefefe" },
  ];

  const barData = [
    { name: "Efficiency", score: 92 },
    { name: "Code Quality", score: 88 },
    { name: "Docs", score: 95 },
    { name: "Satisfaction", score: 91 }
  ];

  const lineData = [
    { day: "Mon", executions: 5 },
    { day: "Tue", executions: 12 },
    { day: "Wed", executions: 8 },
    { day: "Thu", executions: 19 },
    { day: "Fri", executions: 15 },
    { day: "Sat", executions: 24 },
    { day: "Sun", executions: 30 }
  ];

  return (
    <div className="dashboard-container">
      <nav className="top-navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <button
              className="slider-toggle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title="Toggle Sidebar Slider"
            >
              ☰
            </button>
            <h1 className="brand-title">Sorting Visualizer</h1>
          </div>

          <button
            className="user-badge"
            onClick={() => setShowProfileModal(true)}
          >
            <div className="avatar-small">{user.avatar}</div>
            <span>{user.name}</span>
          </button>
        </div>
      </nav>

      <div className="workspace-layout">
        <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-scroll-content">
            <div className="sidebar-section">
              <ul className="menu-list">
                <li className="menu-item active">
                  {isSidebarOpen && <span>Dashboard</span>}
                  <span className="badge">14</span>
                </li>
                <li className="menu-item" onClick={onBackToVisualizer}>
                  {isSidebarOpen && <span>3D Visualizer</span>}
                </li>
                <li className="menu-item">
                  {isSidebarOpen && <span>Computer Science</span>}
                </li>

                <li className="menu-item math-menu-container">
                  <div 
                    className="math-dropdown-header"
                    onClick={() => setIsMathOpen(!isMathOpen)}
                  >
                    {isSidebarOpen && <span>Mathematics</span>}
                    {isSidebarOpen && <span className="arrow-icon">{isMathOpen ? '▾' : '▸'}</span>}
                  </div>

                  {isMathOpen && isSidebarOpen && (
                    <ul className="submenu-list">
                      <li className="submenu-item">Discrete Mathematics</li>
                      <li className="submenu-item">Linear Algebra</li>
                      <li className="submenu-item">Calculus</li>
                      <li className="submenu-item">Probability & Statistics</li>
                    </ul>
                  )}
                </li>

                <li className="menu-item">{isSidebarOpen && <span>DSA Practice Question</span>}</li>
                <li className="menu-item">{isSidebarOpen && <span>Interview Question</span>}</li>
                <li className="menu-item">{isSidebarOpen && <span>Quiz</span>}</li>
                <li className="menu-item">{isSidebarOpen && <span>Aptitude</span>}</li>
              </ul>
            </div>
          </div>

          <div className="sidebar-footer-section">
            <h3 className="section-title">Account</h3>
            <ul className="menu-list">
              <li className="menu-item" onClick={() => setShowProfileModal(true)}>
                {isSidebarOpen && <span>My Profile</span>}
              </li>
              <li className="menu-item">{isSidebarOpen && <span>Security</span>}</li>
              <li className="menu-item logout" onClick={handleLogoutClick}>
                {isSidebarOpen && <span>Logout</span>}
              </li>
            </ul>
          </div>
        </aside>

        <main className="main-content">
          <section className="welcome-section">
            <div className="welcome-content">
              <h2>Welcome back, <span className="highlight">{user.name}</span>! 👋</h2>
              <p>Here is your comprehensive real-time algorithm performance analytics report.</p>
            </div>
          </section>

          <section className="stats-container">
            {stats.map((stat, idx) => (
              <div key={idx} className={`stat-card ${stat.color}`}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </section>

          <section className="content-grid">
            <div className="card chart-card">
              <h3 className="card-title">🥧 Algorithm Usage Share</h3>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card chart-card">
              <h3 className="card-title">📊 Performance Metrics Breakdown</h3>
              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ background: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                    <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card chart-card full-width-card">
              <h3 className="card-title">📈 Weekly Execution Trends</h3>
              <div style={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                    <Line type="monotone" dataKey="executions" stroke="#06b6d4" strokeWidth={3} dot={{ r: 6, fill: "#06b6d4" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </main>
      </div>

      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowProfileModal(false)}>✕</button>

            <div className="profile-header">
              <div className="profile-avatar-large">{user.avatar}</div>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-role">{user.role}</p>
              <p className="profile-bio">{user.bio}</p>
            </div>

            <div className="profile-tabs">
              <button className={`tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
              <button className={`tab-btn ${activeTab === "achievements" ? "active" : ""}`} onClick={() => setActiveTab("achievements")}>Achievements</button>
              <button className={`tab-btn ${activeTab === "activity" ? "active" : ""}`} onClick={() => setActiveTab("activity")}>Activity</button>
            </div>

            <div className="profile-tabs-content">
              {activeTab === "overview" && (
                <div className="tab-content">
                  <div className="info-grid">
                    <div className="info-item"><span className="info-label">Email</span><span className="info-value">{user.email || "Not Provided"}</span></div>
                    <div className="info-item"><span className="info-label">Phone</span><span className="info-value">{user.phone || "Not Provided"}</span></div>
                    <div className="info-item"><span className="info-label">Department</span><span className="info-value">{user.department}</span></div>
                    <div className="info-item"><span className="info-label">Location</span><span className="info-value">{user.location}</span></div>
                    <div className="info-item"><span className="info-label">Status</span><span className="info-value status-active">🟢 Active</span></div>
                  </div>

                  <div className="skills-section">
                    <h4 className="section-heading">Skills</h4>
                    <div className="skills-grid">
                      {user.skills.map((skill, idx) => (<span key={idx} className="skill-tag">{skill}</span>))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "achievements" && (
                <div className="tab-content">
                  <div className="achievements-grid">
                    {user.achievements.map((achievement, idx) => (
                      <div key={idx} className="achievement-card">
                        <span className="achievement-icon">{achievement.icon}</span>
                        <h4 className="achievement-title">{achievement.title}</h4>
                        <p className="achievement-value">{achievement.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="tab-content">
                  <div className="activity-timeline">
                    {user.recentActivity.map((activity, idx) => (
                      <div key={idx} className="activity-item">
                        <div className="activity-marker"></div>
                        <div className="activity-content">
                          <p className="activity-action">{activity.action}</p>
                          <span className="activity-date">{activity.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}