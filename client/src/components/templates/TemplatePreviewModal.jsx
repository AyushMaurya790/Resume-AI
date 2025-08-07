import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/Templates.css';

const TemplatePreviewModal = ({ template, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div 
        className="preview-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="preview-modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="close-modal-btn" onClick={onClose}>
            &times;
          </button>
          
          <div className="preview-header">
            <h2>{template.name}</h2>
            <div className="template-colors">
              {template.colors.map((color, i) => (
                <div 
                  key={i} 
                  className="color-swatch" 
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="preview-image-container">
            <img 
              src={template.thumbnail.replace('thumb', 'full')} 
              alt={`Full preview of ${template.name}`}
            />
          </div>
          
          <div className="preview-actions">
            <button className="btn-outline-red">
              Customize Colors
            </button>
            <button className="btn-blue">
              Use This Template
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplatePreviewModal;