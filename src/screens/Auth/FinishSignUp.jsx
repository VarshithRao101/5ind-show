import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';

const FinishSignUp = () => {
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const { darkTheme } = useContext(UserContext);
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setStatus('verifying');
        const result = await completeLogin();

        if (result.success) {
          setStatus('success');
          // Redirect to home after 1.5 seconds
          setTimeout(() => navigate('/home'), 1500);
        } else {
          setStatus('error');
          setErrorMessage(result.message || 'Failed to verify email link');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.message || 'An error occurred during verification');
      }
    };

    verifyEmail();
  }, [completeLogin, navigate]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
        darkTheme ? 'bg-gradient-to-br from-[#0F1115] via-[#1a1a1f] to-[#0F1115]' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-10 w-72 h-72 ${darkTheme ? 'bg-primary-yellow/5' : 'bg-primary-yellow/3'} rounded-full blur-3xl`} />
        <div className={`absolute bottom-20 left-10 w-72 h-72 ${darkTheme ? 'bg-primary-yellow/3' : 'bg-primary-yellow/2'} rounded-full blur-3xl`} />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 text-center"
      >
        {status === 'verifying' && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto rounded-full border-4 border-primary-yellow/20 border-t-primary-yellow shadow-yellow-glow-lg"
            />

            <div>
              <h1 className={`text-3xl font-heading font-bold mb-2 ${darkTheme ? 'text-white' : 'text-text-light'}`}>
                Verifying Account
              </h1>
              <p className={`text-sm ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>
                Please wait while we authenticate your email...
              </p>
            </div>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center border-2 border-green-500/30"
            >
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <div>
              <h1 className={`text-3xl font-heading font-bold mb-2 ${darkTheme ? 'text-white' : 'text-text-light'}`}>
                Welcome!
              </h1>
              <p className={`text-sm ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>
                Your account has been verified. Redirecting...
              </p>
            </div>

            {/* Progress bar animation */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-1 bg-gradient-to-r from-primary-yellow to-primary-yellow-dark rounded-full"
            />
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-yellow/20 to-primary-yellow/10 flex items-center justify-center border-2 border-primary-yellow/30"
            >
              <svg className="w-10 h-10 text-primary-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>

            <div>
              <h1 className={`text-3xl font-heading font-bold mb-2 ${darkTheme ? 'text-white' : 'text-text-light'}`}>
                Verification Failed
              </h1>
              <p className={`text-sm ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'} mb-4`}>
                {errorMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary-yellow to-primary-yellow-dark hover:shadow-yellow-glow-lg transition-all duration-300"
              >
                Back to Login
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/signup')}
                className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                  darkTheme
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-black/10 hover:bg-black/20 text-text-light'
                }`}
              >
                Create New Account
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default FinishSignUp;



