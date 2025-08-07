import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/auth';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion } from 'framer-motion';
import { FiDownload, FiEdit, FiTrash2, FiEye, FiShare2, FiTag, FiClock } from 'react-icons/fi';
import '../../styles/ResumeHistory.css';

const ResumeHistory = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedResume, setSelectedResume] = useState(null);

  // Fetch user's resumes from Firestore
  useEffect(() => {
    const fetchResumes = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const q = query(collection(db, 'resumes'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const resumesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          lastModified: doc.data().lastModified.toDate()
        }));
        setResumes(resumesData);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [user]);

  // Filter resumes based on search, tags, and active tab
  const filteredResumes = resumes.filter(resume => {
    // Search filter
    const matchesSearch = resume.resumeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resume.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tag filter
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => resume.tags?.includes(tag));
    
    // Tab filter
    let matchesTab = true;
    if (activeTab === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      matchesTab = resume.lastModified >= oneWeekAgo;
    } else if (activeTab === 'starred') {
      matchesTab = resume.starred === true;
    }
    
    return matchesSearch && matchesTags && matchesTab;
  });

  // Get all unique tags from resumes
  const allTags = [...new Set(resumes.flatMap(resume => resume.tags || []))];

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      await deleteDoc(doc(db, 'resumes', resumeId));
      setResumes(resumes.filter(r => r.id !== resumeId));
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleDownloadResume = (resumeId) => {
    // TODO: Implement download functionality
    console.log('Downloading resume:', resumeId);
  };

  const handleShareResume = (resumeId) => {
    // TODO: Implement share functionality
    console.log('Sharing resume:', resumeId);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>
          <span className="text-red">Resume</span>
          <span className="text-blue">History</span>
        </h2>
        <p>View, edit, and manage all your saved resumes</p>
      </div>

      <div className="dashboard-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search resumes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={activeTab === 'all' ? 'active btn-blue' : 'btn-blue'}
            onClick={() => setActiveTab('all')}
          >
            All Resumes
          </button>
          <button
            className={activeTab === 'recent' ? 'active btn-red' : 'btn-red'}
            onClick={() => setActiveTab('recent')}
          >
            Recent
          </button>
          <button
            className={activeTab === 'starred' ? 'active btn-blue' : 'btn-blue'}
            onClick={() => setActiveTab('starred')}
          >
            Starred
          </button>
        </div>

        {allTags.length > 0 && (
          <div className="tag-filters">
            <h4>Filter by Tags:</h4>
            <div className="tags-container">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your resumes...</p>
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="empty-state">
          <h3>No resumes found</h3>
          <p>{searchQuery || selectedTags.length > 0 || activeTab !== 'all' 
            ? 'Try adjusting your filters' 
            : 'Create your first resume to get started'}</p>
        </div>
      ) : (
        <div className="resumes-grid">
          {filteredResumes.map(resume => (
            <motion.div 
              key={resume.id}
              className="resume-card"
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="card-header">
                <h3>{resume.resumeName}</h3>
                <span className={`status ${resume.isPremium ? 'premium' : 'free'}`}>
                  {resume.isPremium ? 'Premium' : 'Free'}
                </span>
              </div>

              <div className="card-meta">
                <div className="meta-item">
                  <FiClock className="meta-icon" />
                  <span>{resume.lastModified.toLocaleDateString()}</span>
                </div>
                {resume.jobTitle && (
                  <div className="meta-item">
                    <span className="job-title">{resume.jobTitle}</span>
                  </div>
                )}
              </div>

              {resume.tags?.length > 0 && (
                <div className="card-tags">
                  {resume.tags.map(tag => (
                    <span key={tag} className="tag">
                      <FiTag size={12} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="card-actions">
                <button 
                  className="action-btn blue"
                  onClick={() => setSelectedResume(resume)}
                >
                  <FiEye /> View
                </button>
                <button className="action-btn">
                  <FiEdit /> Edit
                </button>
                <button 
                  className="action-btn red"
                  onClick={() => handleDeleteResume(resume.id)}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>

              <div className="card-footer">
                <button 
                  className="footer-btn"
                  onClick={() => handleDownloadResume(resume.id)}
                >
                  <FiDownload /> Download
                </button>
                <button 
                  className="footer-btn"
                  onClick={() => handleShareResume(resume.id)}
                >
                  <FiShare2 /> Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Resume Preview Modal */}
      {selectedResume && (
        <div className="preview-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedResume.resumeName}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedResume(null)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="resume-preview">
                {/* TODO: Render actual resume preview */}
                <p>Preview of {selectedResume.resumeName}</p>
                <p>Created: {selectedResume.lastModified.toLocaleString()}</p>
                {selectedResume.jobTitle && <p>Job Title: {selectedResume.jobTitle}</p>}
              </div>
              
              <div className="version-history">
                <h4>Version History</h4>
                {selectedResume.versions?.length > 0 ? (
                  <ul>
                    {selectedResume.versions.map((version, index) => (
                      <li key={index}>
                        <span>Version {index + 1}</span>
                        <span>{version.date.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No previous versions</p>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn-blue"
                onClick={() => {
                  // TODO: Implement edit functionality
                  console.log('Edit resume:', selectedResume.id);
                  setSelectedResume(null);
                }}
              >
                Edit Resume
              </button>
              <button 
                className="btn-red"
                onClick={() => setSelectedResume(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeHistory;