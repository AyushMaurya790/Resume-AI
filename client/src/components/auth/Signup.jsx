import React, { useState } from 'react';
import { auth } from '../../firebase'; // Firebase config file
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion'; // For 3D animations
import LinkedInLogin from './LinkedInLogin'; // Custom LinkedIn component
import '../../styles/Signup.css';// CSS module for additional styling

const Signup = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();

  // Handle Email + OTP Signup
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      // Simulate OTP sending (replace with actual OTP service like Firebase Phone Auth or email OTP service)
      setOtpSent(true);
      setError('');
      // On OTP verification
      if (otp) {
        await signInWithEmailAndPassword(auth, email, otp); // Use OTP as temporary password or integrate with Firebase custom auth
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Guest Mode
  const handleGuestMode = () => {
    router.push('/resume-builder?guest=true');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-red-900">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform-gpu"
        initial={{ scale: 0.8, rotateY: -10 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Join ResumeAI</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        {/* Email + OTP Form */}
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          {otpSent && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter OTP"
                required
              />
            </div>
          )}
          <motion.button
            type="submit"
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {otpSent ? 'Verify OTP' : 'Send OTP'}
          </motion.button>
        </form>

        {/* Social Sign-In Options */}
        <div className="mt-6 space-y-4">
          <motion.button
            onClick={handleGoogleSignup}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="..." /> {/* Google SVG Path */}
            </svg>
            Sign up with Google
          </motion.button>
          <LinkedInLogin />
          <motion.button
            onClick={handleGuestMode}
            className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue as Guest
          </motion.button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;