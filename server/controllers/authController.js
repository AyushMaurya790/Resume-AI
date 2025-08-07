const { auth, db } = require('../config/firebase');
const User = require('../models/User');
const { getAccessToken, getProfileData } = require('../services/linkedinService');
const jwt = require('jsonwebtoken');

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.collection('otps').doc(email).set({ otp, createdAt: new Date(), expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    // Send OTP via email (use Nodemailer or SendGrid in production)
    console.log(`OTP for ${email}: ${otp}`);
    res.status(200).json({ message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpDoc = await db.collection('otps').doc(email).get();
    if (!otpDoc.exists || otpDoc.data().otp !== otp || otpDoc.data().expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    let userRecord = await auth.getUserByEmail(email).catch(() => null);
    if (!userRecord) {
      userRecord = await auth.createUser({ email });
    }
    await User.create({ uid: userRecord.uid, email });
    const token = jwt.sign({ uid: userRecord.uid }, process.env.JWT_SECRET);
    res.status(200).json({ token, user: { email, role: 'user' } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

exports.googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = await auth.verifyIdToken(token);
    await User.create({ uid: decoded.uid, email: decoded.email });
    const jwtToken = jwt.sign({ uid: decoded.uid }, process.env.JWT_SECRET);
    res.status(200).json({ token: jwtToken, user: { email: decoded.email, role: 'user' } });
  } catch (err) {
    res.status(401).json({ error: 'Invalid Google token' });
  }
};

exports.linkedinCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const accessToken = await getAccessToken(code);
    const profileData = await getProfileData(accessToken);
    let userRecord = await auth.getUserByEmail(profileData.email).catch(() => null);
    if (!userRecord) {
      userRecord = await auth.createUser({ email: profileData.email });
    }
    await User.create({ uid: userRecord.uid, email: profileData.email, linkedInData: profileData });
    const token = jwt.sign({ uid: userRecord.uid }, process.env.JWT_SECRET);
    res.redirect(`/login?token=${token}`);
  } catch (err) {
    res.status(500).json({ error: 'LinkedIn login failed' });
  }
};

exports.getLinkedInData = async (req, res) => {
  try {
    const userDoc = await User.getById(req.user.uid);
    res.status(200).json(userDoc.data().linkedInData || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch LinkedIn data' });
  }
};