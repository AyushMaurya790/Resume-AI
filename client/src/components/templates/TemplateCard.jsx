import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/Templates.css';

const TemplateCard = ({ template, onSelect }) => {
  return (
    <div className="template-card" onClick={() => onSelect(template)}>
      <div className="template-thumbnail-container">
        <img 
          src={template.thumbnail} 
          alt={template.name} 
          className="template-thumbnail"
        />
        {template.premium && (
          <div className="premium-badge">
            <span>Premium</span>
          </div>
        )}
      </div>
      
      <div className="template-details">
        <h3>{template.name}</h3>
        <div className="template-tags">
          {template.tags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      
      <motion.button 
        className="template-select-btn btn-blue"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Select Template
      </motion.button>
    </div>
  );
};

export default TemplateCard;