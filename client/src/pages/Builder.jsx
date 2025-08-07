import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import ResumeForm from '../components/builder/ResumeForm';
import PreviewPane from '../components/builder/PreviewPane';
import AISuggestions from '../components/builder/AISuggestions';
import '../styles/Builder.css';

const Builder = () => {
  const { user } = useAuth();
  const [resumeData, setResumeData] = useState({
    personalInfo: {},
    experience: [],
    education: [],
    skills: [],
    // other resume fields
  });
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    try {
      // Call to backend which uses OpenAI API
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ prompt: 'Generate professional resume data' })
      });
      const data = await response.json();
      setResumeData(data);
    } catch (error) {
      console.error('AI generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="builder-container">
      <div className="builder-header">
        <h2>AI Resume Builder</h2>
        <button 
          className="btn-blue" 
          onClick={handleGenerateWithAI}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </button>
      </div>

      <div className="builder-content">
        <div className="form-section">
          <ResumeForm data={resumeData} setData={setResumeData} />
          <AISuggestions data={resumeData} setData={setResumeData} />
        </div>
        
        <div className="preview-section">
          <PreviewPane 
            data={resumeData} 
            template={selectedTemplate} 
            isWatermarked={!user?.premium}
          />
        </div>
      </div>
    </div>
  );
};

export default Builder;