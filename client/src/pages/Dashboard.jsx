import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ThreeDots } from 'react-loader-spinner';
import { motion } from 'framer-motion';
import '../styles/DashboardStyles.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('myResumes');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch user data and resumes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchResumes(currentUser.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchResumes = async (userId) => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'resumes'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const resumesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResumes(resumesData);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/builder');
  };

  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resume.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <motion.div 
        className="dashboard-sidebar"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sidebar-header">
          <h2>
            <span className="text-red">Resume</span>
            <span className="text-blue">AI</span>
          </h2>
        </div>

        <div className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'myResumes' ? 'active' : ''}`}
            onClick={() => setActiveTab('myResumes')}
          >
            <i className="fas fa-file-alt"></i>
            My Resumes
          </button>
          <button 
            className={`menu-item ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <i className="fas fa-palette"></i>
            Templates
          </button>
          <button 
            className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <i className="fas fa-chart-line"></i>
            Analytics
          </button>
          <button 
            className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i>
            Settings
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User" />
              ) : (
                <span>{user?.displayName?.charAt(0) || user?.email?.charAt(0)}</span>
              )}
            </div>
            <div className="user-info">
              <h4>{user?.displayName || 'User'}</h4>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="content-header">
          <h1>
            {activeTab === 'myResumes' && 'My Resumes'}
            {activeTab === 'templates' && 'Templates'}
            {activeTab === 'analytics' && 'Analytics'}
            {activeTab === 'settings' && 'Settings'}
          </h1>
          
          <div className="header-actions">
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search resumes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-red" onClick={handleCreateNew}>
              <i className="fas fa-plus"></i> Create New
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'myResumes' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <div className="loading-container">
                  <ThreeDots color="#3e6bff" height={80} width={80} />
                </div>
              ) : (
                <div className="resumes-grid">
                  {filteredResumes.length > 0 ? (
                    filteredResumes.map((resume) => (
                      <ResumeCard 
                        key={resume.id} 
                        resume={resume} 
                        onEdit={() => navigate(`/builder?resumeId=${resume.id}`)}
                      />
                    ))
                  ) : (
                    <div className="empty-state">
                      <i className="fas fa-file-alt"></i>
                      <h3>No resumes found</h3>
                      <p>Create your first resume to get started</p>
                      <button className="btn-blue" onClick={handleCreateNew}>
                        Create Resume
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'templates' && (
            <TemplatesTab />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab user={user} resumes={resumes} />
          )}

          {activeTab === 'settings' && (
            <SettingsTab user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components
const ResumeCard = ({ resume, onEdit }) => {
  return (
    <motion.div 
      className="resume-card"
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
    >
      <div className="card-header">
        <h3>{resume.title || 'Untitled Resume'}</h3>
        <span className={`status ${resume.isPremium ? 'premium' : 'free'}`}>
          {resume.isPremium ? 'Premium' : 'Free'}
        </span>
      </div>
      
      <div className="card-body">
        <p className="job-title">{resume.jobTitle || 'No job title specified'}</p>
        <p className="last-modified">
          Last modified: {new Date(resume.updatedAt?.toDate()).toLocaleDateString()}
        </p>
      </div>
      
      <div className="card-footer">
        <button className="btn-outline-blue" onClick={onEdit}>
          <i className="fas fa-edit"></i> Edit
        </button>
        <div className="action-buttons">
          <button className="icon-btn">
            <i className="fas fa-download"></i>
          </button>
          <button className="icon-btn">
            <i className="fas fa-share-alt"></i>
          </button>
          <button className="icon-btn text-red">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const TemplatesTab = () => {
  const templates = [
    { id: 1, name: 'Modern', category: 'Professional', isPremium: false },
    { id: 2, name: 'Classic', category: 'Professional', isPremium: false },
    { id: 3, name: 'ATS Friendly', category: 'Professional', isPremium: true },
    // Add more templates
  ];

  return (
    <div className="templates-grid">
      {templates.map(template => (
        <div key={template.id} className="template-card">
          <div className="template-preview">
            <img src={`/templates/${template.id}.jpg`} alt={template.name} />
            {template.isPremium && <div className="premium-badge">Premium</div>}
          </div>
          <div className="template-info">
            <h4>{template.name}</h4>
            <p>{template.category}</p>
            <button className="btn-blue">
              {template.isPremium ? 'Unlock (₹99)' : 'Use Template'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const AnalyticsTab = ({ user, resumes }) => {
  // Calculate analytics data
  const resumeCount = resumes.length;
  const premiumCount = resumes.filter(r => r.isPremium).length;
  const viewsCount = resumes.reduce((sum, r) => sum + (r.views || 0), 0);
  
  return (
    <div className="analytics-container">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Resumes</h3>
          <p className="stat-value text-blue">{resumeCount}</p>
        </div>
        <div className="stat-card">
          <h3>Premium Resumes</h3>
          <p className="stat-value text-red">{premiumCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Views</h3>
          <p className="stat-value text-blue">{viewsCount}</p>
        </div>
      </div>
      
      <div className="charts-section">
        {/* Placeholder for charts */}
        <div className="chart-placeholder">
          <p>Resume Performance Over Time</p>
          <div className="chart-dummy"></div>
        </div>
        
        <div className="chart-placeholder">
          <p>Template Usage</p>
          <div className="chart-dummy"></div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ user }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="settings-container">
      <div className="settings-section">
        <h3>Account Settings</h3>
        <div className="setting-item">
          <label>Email</label>
          <p>{user?.email}</p>
        </div>
        <div className="setting-item">
          <label>Name</label>
          <input type="text" defaultValue={user?.displayName || ''} />
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Preferences</h3>
        <div className="setting-item toggle">
          <label>Enable Notifications</label>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-item toggle">
          <label>Dark Mode</label>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="btn-blue">Save Changes</button>
        <button className="btn-outline-red">Delete Account</button>
      </div>
    </div>
  );
};

export default Dashboard;