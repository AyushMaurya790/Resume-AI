import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import html2pdf from 'html2pdf.js';
import '../../styles/PreviewPane.css';

const PreviewPane = ({ resumeData, selectedTemplate }) => {
  const [isWatermarked, setIsWatermarked] = useState(true);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  
  const handleDownload = () => {
    if (isWatermarked) {
      setOpenPaymentModal(true);
      return;
    }
    
    const element = document.getElementById('resume-preview');
    const opt = {
      margin: 10,
      filename: `${resumeData.personalInfo.name || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().from(element).set(opt).save();
  };

  const handleRemoveWatermark = () => {
    setOpenPaymentModal(true);
  };

  return (
    <Box className="preview-container">
      <Box className="preview-actions">
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleDownload}
          style={{ backgroundColor: '#d32f2f' }}
        >
          Download PDF
        </Button>
        {isWatermarked && (
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={handleRemoveWatermark}
            style={{ color: '#1976d2', borderColor: '#1976d2' }}
          >
            Remove Watermark
          </Button>
        )}
      </Box>
      
      <Box id="resume-preview" className={`resume-preview ${selectedTemplate}`}>
        {/* Dynamic resume rendering based on template */}
        {isWatermarked && (
          <div className="watermark-overlay">
            <div className="watermark-text">ResumeAI Preview - Unlock to Download</div>
          </div>
        )}
        
        <div className="resume-content">
          <header className="resume-header">
            <h1>{resumeData.personalInfo.name || 'Your Name'}</h1>
            <p>{resumeData.personalInfo.summary || 'Professional Summary'}</p>
          </header>
          
          <section className="resume-section">
            <h2>Experience</h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <h3>{exp.title || 'Job Title'}</h3>
                <p>{exp.company || 'Company'} | {exp.startDate || 'Start'} - {exp.endDate || 'End'}</p>
                <p>{exp.description || 'Job description and achievements'}</p>
              </div>
            ))}
          </section>
          
          {/* Other sections */}
        </div>
      </Box>
      
      <Modal
        open={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
        className="payment-modal"
      >
        <Box className="payment-modal-content">
          <Typography variant="h5" gutterBottom>
            Unlock Full Features
          </Typography>
          <Typography variant="body1" paragraph>
            Pay ₹99 to download your resume without watermark and access all features.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              // Handle payment success
              setIsWatermarked(false);
              setOpenPaymentModal(false);
            }}
            fullWidth
            style={{ backgroundColor: '#d32f2f', marginTop: '1rem' }}
          >
            Pay with Razorpay
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={() => setOpenPaymentModal(false)}
            fullWidth
            style={{ marginTop: '1rem' }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default PreviewPane;