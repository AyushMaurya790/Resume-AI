// src/context/ResumeContext.jsx
import React, { createContext, useState } from 'react';

export const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState({});

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};