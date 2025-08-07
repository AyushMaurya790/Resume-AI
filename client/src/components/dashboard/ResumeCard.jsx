import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiDownload, FiTrash2, FiShare2, FiClock, FiTag, FiStar } from 'react-icons/fi';
import { FaRegFilePdf } from 'react-icons/fa';
import '../../styles/ResumeCard.css'; // Ensure this file exists with appropriate styles

const ResumeCard = ({ 
  resume, 
  onEdit, 
  onDownload, 
  onDelete, 
  onShare,
  onAnalyze,
  onGenerateCoverLetter
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Calculate resume score (example)
  const score = Math.min(Math.floor(resume.completeness * 20), 100);
  const scoreColor = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div 
      className="resume-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Card Header */}
      <div className="card-header">
        <div className="resume-icon">
          <FaRegFilePdf size={24} className="text-blue" />
        </div>
        <div className="resume-title">
          <h3>{resume.title}</h3>
          <p className="resume-date">
            <FiClock size={14} /> Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <button 
          className="card-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          •••
        </button>
        
        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="card-menu">
            <button onClick={() => { onEdit(resume.id); setIsMenuOpen(false); }}>
              <FiEdit /> Edit
            </button>
            <button onClick={() => { onDownload(resume.id); setIsMenuOpen(false); }}>
              <FiDownload /> Download
            </button>
            <button onClick={() => { onShare(resume.id); setIsMenuOpen(false); }}>
              <FiShare2 /> Share
            </button>
            <button 
              className="delete-btn"
              onClick={() => { onDelete(resume.id); setIsMenuOpen(false); }}
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        )}
      </div>
      
      {/* Template Preview */}
      <div className="template-preview" style={{ backgroundColor: resume.template.bgColor }}>
        <div className="preview-content">
          <h4 className="preview-name">{resume.personalInfo?.name || 'Your Name'}</h4>
          <p className="preview-title">{resume.personalInfo?.title || 'Professional Title'}</p>
        </div>
        <div className="template-badge">
          {resume.template.name}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="card-footer">
        {/* Tags */}
        <div className="resume-tags">
          {resume.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="tag">
              <FiTag size={12} /> {tag}
            </span>
          ))}
          {resume.tags?.length > 2 && (
            <span className="tag-more">+{resume.tags.length - 2}</span>
          )}
        </div>
        
        {/* Score & Actions */}
        <div className="resume-meta">
          <div className="score-badge" style={{ '--score-color': scoreColor }}>
            <FiStar size={14} />
            <span>{score}</span>
          </div>
          
          <div className="action-buttons">
            <button 
              className="action-btn analyze-btn"
              onClick={() => onAnalyze(resume.id)}
              title="Analyze with AI"
            >
              AI
            </button>
            <button 
              className="action-btn cover-letter-btn"
              onClick={() => onGenerateCoverLetter(resume.id)}
              title="Generate Cover Letter"
            >
              CL
            </button>
          </div>
        </div>
      </div>
      
      {/* Hover Actions */}
      {isHovered && (
        <div className="hover-actions">
          <button 
            className="hover-btn edit-btn"
            onClick={() => onEdit(resume.id)}
            title="Edit Resume"
          >
            <FiEdit size={18} />
          </button>
          <button 
            className="hover-btn download-btn"
            onClick={() => onDownload(resume.id)}
            title="Download PDF"
          >
            <FiDownload size={18} />
          </button>
          <button 
            className="hover-btn share-btn"
            onClick={() => onShare(resume.id)}
            title="Share Resume"
          >
            <FiShare2 size={18} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ResumeCard;