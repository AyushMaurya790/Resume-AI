import React, { useState, useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, TextField, Grid, Chip, IconButton } from '@mui/material';
import { AddCircle, Delete, AutoFixHigh, Save } from '@mui/icons-material';
import { generateResumeContent } from '../../utils/api';
import '../../styles/ResumeForm.css';

const ResumeForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [resumeData, setResumeData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const steps = ['Personal Info', 'Experience', 'Education', 'Skills', 'Projects', 'Review'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayItemChange = (section, index, field, value) => {
    setResumeData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = {
        ...newArray[index],
        [field]: value
      };
      return {
        ...prev,
        [section]: newArray
      };
    });
  };

  const addArrayItem = (section) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], {}]
    }));
  };

  const removeArrayItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleAISuggestions = async (section, field, prompt) => {
    setAiLoading(true);
    try {
      const response = await generateResumeContent({
        section,
        field,
        existingData: resumeData[section],
        prompt
      });
      setSuggestions(response.suggestions);
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const applySuggestion = (suggestion) => {
    // Apply suggestion logic
    setSuggestions([]);
  };

  return (
    <Box className="resume-builder-container">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box className="form-step-content">
        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Full Name"
                fullWidth
                value={resumeData.personalInfo.name || ''}
                onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                fullWidth
                value={resumeData.personalInfo.email || ''}
                onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <div className="ai-assist-row">
                <TextField
                  label="Professional Summary"
                  multiline
                  rows={4}
                  fullWidth
                  value={resumeData.personalInfo.summary || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'summary', e.target.value)}
                />
                <IconButton 
                  color="primary" 
                  onClick={() => handleAISuggestions('personalInfo', 'summary', 'Generate a professional summary for a software engineer')}
                  disabled={aiLoading}
                >
                  <AutoFixHigh />
                </IconButton>
              </div>
            </Grid>
          </Grid>
        )}
        
        {activeStep === 1 && (
          <div className="experience-section">
            {resumeData.experience.map((exp, index) => (
              <Grid container spacing={2} key={index} className="experience-item">
                <Grid item xs={12}>
                  <div className="section-header">
                    <Typography variant="h6">Experience #{index + 1}</Typography>
                    <IconButton onClick={() => removeArrayItem('experience', index)} color="error">
                      <Delete />
                    </IconButton>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Job Title"
                    fullWidth
                    value={exp.title || ''}
                    onChange={(e) => handleArrayItemChange('experience', index, 'title', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Company"
                    fullWidth
                    value={exp.company || ''}
                    onChange={(e) => handleArrayItemChange('experience', index, 'company', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="ai-assist-row">
                    <TextField
                      label="Description"
                      multiline
                      rows={3}
                      fullWidth
                      value={exp.description || ''}
                      onChange={(e) => handleArrayItemChange('experience', index, 'description', e.target.value)}
                    />
                    <IconButton 
                      color="primary" 
                      onClick={() => handleAISuggestions('experience', 'description', `Generate bullet points for ${exp.title} role at ${exp.company}`)}
                      disabled={aiLoading}
                    >
                      <AutoFixHigh />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            ))}
            <Button 
              startIcon={<AddCircle />} 
              onClick={() => addArrayItem('experience')}
              variant="outlined"
              style={{ marginTop: '1rem' }}
            >
              Add Experience
            </Button>
          </div>
        )}
        
        {/* Similar structure for other steps */}
      </Box>
      
      <Box className="form-actions">
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button variant="contained" color="primary" startIcon={<Save />}>
            Save Resume
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
      
      {/* AI Suggestions Modal */}
      {suggestions.length > 0 && (
        <div className="ai-suggestions-modal">
          <Typography variant="h6">AI Suggestions</Typography>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <Typography>{suggestion}</Typography>
                <Button size="small" onClick={() => applySuggestion(suggestion)}>
                  Apply
                </Button>
              </li>
            ))}
          </ul>
          <Button onClick={() => setSuggestions([])}>Close</Button>
        </div>
      )}
    </Box>
  );
};

export default ResumeForm;