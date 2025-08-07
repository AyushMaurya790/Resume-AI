const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/otp/send', authController.sendOTP);
router.post('/otp/verify', authController.verifyOTP);
router.post('/google', authController.googleLogin);
router.get('/linkedin/callback', authController.linkedinCallback);
router.get('/linkedin/data', authController.getLinkedInData);

module.exports = router;