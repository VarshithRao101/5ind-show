import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Verify = () => {
  const navigate = useNavigate();
  const { verifyEmailLink } = useAuth();

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get email from localStorage
        const storedEmail = window.localStorage.getItem('emailForSignIn');

        if (!storedEmail) {
          setStatus('error');
          setErrorMessage('No email found. Please sign up again.');
          return;
        }

        setEmail(storedEmail);

        // Check if the URL contains the email link
        if (!window.location.href.includes('oobCode')) {
          setStatus('error');
          setErrorMessage('Invalid or expired verification link. Please sign up again.');
          return;
        }

        // Verify the email link
        await verifyEmailLink(storedEmail);

        // Clear the stored email
        window.localStorage.removeItem('emailForSignIn');

        setStatus('success');

        // Redirect to genre selection after 2 seconds
        setTimeout(() => {
          navigate('/genres');
        }, 2000);
      } catch (err) {
        setStatus('error');

        // Handle specific Firebase errors
        if (err.code === 'auth/invalid-action-code') {
          setErrorMessage('Invalid or expired verification link. Please sign up again.');
        } else if (err.code === 'auth/expired-action-code') {
          setErrorMessage('This verification link has expired. Please sign up again.');
        } else if (err.code === 'auth/invalid-email') {
          setErrorMessage('Invalid email address. Please try again.');
        } else {
          setErrorMessage(err.message || 'Verification failed. Please try again.');
        }
      }
    };

    verifyEmail();
  }, [verifyEmailLink, navigate]);

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4 py-6 fade-in">
      {/* Background gradient accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E11D1D]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E11D1D]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-col items-center mb-8 sm:mb-10"
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E11D1D] to-[#a80e0e] flex items-center justify-center shadow-2xl mb-6"
          >
            <span className="text-white font-bold text-3xl">5</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl font-heading font-bold text-white mb-2 text-center">Verify Email</h1>
          <p className="text-muted-text text-center max-w-xs">Verifying your email address...</p>
        </motion.div>

        {/* Verification Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="card-elevated p-6 sm:p-8 shadow-yellow-glow"
        >
          {/* Verifying State */}
          {status === 'verifying' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-primary-yellow/30 border-t-primary-yellow rounded-full mb-6"
              />
              <p className="text-white text-lg font-semibold text-center">Verifying your email...</p>
              <p className="text-muted-text text-sm text-center mt-3">Please wait while we verify your information</p>
            </motion.div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-primary-yellow/20 flex items-center justify-center mb-6"
              >
                <FiCheckCircle className="w-10 h-10 text-primary-yellow" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-3 text-center">Email Verified!</h2>
              <p className="text-muted-text text-center mb-2">Your account has been created successfully.</p>
              <p className="text-muted-text text-sm text-center mb-8">Redirecting you to genre selection...</p>

              <motion.div
                animate={{ opacity: [0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-primary-yellow" />
                <div className="w-2 h-2 rounded-full bg-primary-yellow" />
                <div className="w-2 h-2 rounded-full bg-primary-yellow" />
              </motion.div>
            </motion.div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6"
              >
                <FiAlertCircle className="w-10 h-10 text-red-500" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-3 text-center">Verification Failed</h2>
              <p className="text-red-400 text-center mb-8 text-sm">{errorMessage}</p>

              {email && (
                <p className="text-muted-text text-xs text-center mb-6">
                  Email: <span className="text-white font-semibold break-words">{email}</span>
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/signup')}
                className="w-full py-3 rounded-2xl bg-primary-yellow hover:bg-primary-yellow-hover text-white font-bold transition-all duration-200 shadow-yellow-glow hover:shadow-yellow-glow-lg mb-4"
              >
                Try Again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-2xl bg-gray-700 hover:bg-gray-600 text-white font-bold transition-all duration-200"
              >
                Back to Login
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Verify;



