import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';

const Signup = () => {
  const navigate = useNavigate();
  const { sendLoginLink, googleLogin, appleLogin } = useContext(AuthContext);
  const { darkTheme } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (value) => {
    if (!value.trim()) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    return '';
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setLoading(true);
    try {
      const result = await sendLoginLink(email);
      if (result.success) {
        setEmailSent(true);
        setEmail('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to send login link');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await googleLogin();
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await appleLogin();
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message || 'Apple login failed');
    } finally {
      setLoading(false);
    }
  };

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-yellow to-primary-yellow-dark flex items-center justify-center mb-4 shadow-yellow-glow-lg">
            <span className="text-2xl font-heading font-bold text-white">5</span>
          </div>
          <h1 className={`text-4xl font-heading font-bold mb-2 ${darkTheme ? 'text-white' : 'text-text-light'}`}>
            Create Account
          </h1>
          <p className={`text-sm ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>
            Sign up with your email to get started
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl border backdrop-blur-md transition-all duration-300 ${
            darkTheme
              ? 'bg-card-bg-dark/40 border-white/10 hover:border-primary-yellow/50'
              : 'bg-white/40 border-white/30 hover:border-primary-yellow/50'
          } p-8 shadow-lg`}
        >
          {emailSent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 flex items-center justify-center border border-green-500/30"
              >
                <FiMail className="w-8 h-8 text-green-400" />
              </motion.div>

              <div>
                <h2 className={`text-xl font-bold mb-1 ${darkTheme ? 'text-white' : 'text-text-light'}`}>
                  Check Your Email
                </h2>
                <p className={`text-sm ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>
                  Verification link sent to<br />
                  <span className="text-primary-yellow font-semibold">{email}</span>
                </p>
              </div>

              <p className={`text-xs ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'} border-t ${darkTheme ? 'border-white/10' : 'border-black/10'} pt-4 mt-4`}>
                Click the link in your email to complete signup. Link expires in 24 hours.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEmailSent(false)}
                className={`w-full mt-4 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  darkTheme
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-black/10 hover:bg-black/20 text-text-light'
                }`}
              >
                Send Another Email
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkTheme ? 'text-white' : 'text-text-light'}`}>
                  Email Address
                </label>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none font-medium ${
                      error
                        ? `border-primary-yellow ${darkTheme ? 'bg-primary-yellow/10' : 'bg-primary-yellow/5'}`
                        : darkTheme
                        ? 'border-white/20 bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:border-primary-yellow text-white placeholder-muted-text-dark'
                        : 'border-black/20 bg-black/5 hover:bg-black/10 focus:bg-black/10 focus:border-primary-yellow text-text-light placeholder-muted-text-light'
                    }`}
                  />
                </motion.div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`px-4 py-3 rounded-xl border-2 border-primary-yellow ${darkTheme ? 'bg-primary-yellow/10' : 'bg-primary-yellow/5'}`}
                >
                  <p className="text-sm font-medium text-primary-yellow">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || !email}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                  loading || !email
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-primary-yellow to-primary-yellow-dark hover:shadow-yellow-glow-lg hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Login Link
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative flex items-center gap-4 my-4">
                <div className={`flex-1 h-px ${darkTheme ? 'bg-white/10' : 'bg-black/10'}`} />
                <span className={`text-xs ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>
                  or continue with
                </span>
                <div className={`flex-1 h-px ${darkTheme ? 'bg-white/10' : 'bg-black/10'}`} />
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleLogin}
                  className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                    darkTheme
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      : 'bg-black/10 hover:bg-black/20 text-text-light border border-black/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FcGoogle size={20} />
                  <span className="text-sm">Google</span>
                </motion.button>

                <motion.button
                  type="button"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAppleLogin}
                  className={`py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                    darkTheme
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      : 'bg-black/10 hover:bg-black/20 text-text-light border border-black/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FaApple size={20} />
                  <span className="text-sm">Apple</span>
                </motion.button>
              </div>

              {/* Footer */}
              <p className={`text-center text-xs ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}>
                We'll send you a secure link to sign in. No password needed.
              </p>
            </form>
          )}
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-center mt-6 text-sm ${darkTheme ? 'text-muted-text-dark' : 'text-muted-text-light'}`}
        >
          Already have an account?{' '}
          <a href="/login" className="text-primary-yellow font-semibold hover:underline transition-colors">
            Sign In
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;



