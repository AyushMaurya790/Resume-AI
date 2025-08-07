import React from 'react';
import { useRouter } from 'next/router';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { motion } from 'framer-motion'; // For animations

const GuestMode = () => {
  const router = useRouter();

  const handleGuestLogin = async () => {
    try {
      const auth = getAuth();
      await signInAnonymously(auth);
      router.push('/resume-builder');
    } catch (error) {
      console.error('Guest login failed:', error);
      alert('Failed to start guest mode. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-red-500">
      <motion.div
        className="bg-white p-8 rounded-lg shadow-2xl transform hover:rotate-x-6 hover:scale-105 transition-transform duration-300"
        style={{ perspective: '1000px' }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">Try ResumeAI as Guest</h2>
        <p className="text-gray-600 mb-6 text-center">
          Build your resume without signing up. Note: Guest resumes are not saved.
        </p>
        <button
          onClick={handleGuestLogin}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
        >
          Start as Guest
        </button>
      </motion.div>
    </div>
  );
};

export default GuestMode;