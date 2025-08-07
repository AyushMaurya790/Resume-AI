const Resume = require('../models/Resume');
const { enhanceResumeField } = require('../services/openaiService');
const { generatePDF } = require('../services/pdfService');

exports.createResume = async (req, res) => {
  try {
    const resumeData = req.body;
    const resume = await Resume.create(req.user.uid, resumeData);
    res.status(201).json(resume.data());
  } catch (err) {
    res.status(500).json({ error: 'Failed to create resume' });
  }
};

exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.getByUserId(req.user.uid);
    res.status(200).json(resumes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resumeData = req.body;
    const resume = await Resume.update(resumeId, resumeData);
    res.status(200).json(resume.data());
  } catch (err) {
    res.status(500).json({ error: 'Failed to update resume' });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    await Resume.delete(resumeId);
    res.status(200).json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
};

exports.enhanceResumeField = async (req, res) => {
  const { field, text } = req.body;
  try {
    const suggestion = await enhanceResumeField(field, text);
    res.status(200).json({ suggestion });
  } catch (err) {
    res.status(500).json({ error: 'Failed to enhance resume field' });
  }
};

exports.generateResumePDF = async (req, res) => {
  const { resumeId, htmlContent } = req.body;
  try {
    const pdfDataUri = await generatePDF(htmlContent, req.user.uid, resumeId);
    res.status(200).json({ pdf: pdfDataUri });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};