const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authenticate = require('../middlewares/auth');

router.post('/', authenticate, resumeController.createResume);
router.get('/', authenticate, resumeController.getResumes);
router.put('/:resumeId', authenticate, resumeController.updateResume);
router.delete('/:resumeId', authenticate, resumeController.deleteResume);
router.post('/enhance', authenticate, resumeController.enhanceResumeField);
router.post('/pdf', authenticate, resumeController.generateResumePDF);

module.exports = router;