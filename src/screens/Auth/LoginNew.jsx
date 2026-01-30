import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
// import { UserContext } from '../../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { sendLoginLink, googleLogin, appleLogin, loginAsGuest, isGuest } = useContext(AuthContext);
  // const { darkTheme } = useContext(UserContext);
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

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await loginAsGuest();
      if (result.success) {
        // Small delay to ensure state updates propagate
        setTimeout(() => {
          navigate('/home');
        }, 100);
      } else {
        setError(result.message);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message || 'Guest login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 transition-colors duration-300 bg-app-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-yellow/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary-yellow/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-yellow to-primary-yellow-dark flex items-center justify-center mb-4 shadow-yellow-glow">
            <span className="text-2xl font-heading font-black text-black">A</span>
          </div>
          <h1 className="text-4xl font-heading font-bold mb-2 text-white">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in with your email to continue
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border backdrop-blur-md transition-all duration-300 bg-[#1f1f1f]/80 border-white/10 p-8 shadow-card hover:shadow-yellow-glow/10 hover:border-white/20"
        >
          {isGuest && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-xl border-2 mb-6 bg-primary-yellow/10 border-primary-yellow/30 text-primary-yellow"
            >
              <p className="text-sm font-bold">✓ Enjoy browsing as a guest</p>
            </motion.div>
          )}

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
                className="w-16 h-16 mx-auto rounded-full bg-primary-yellow/20 flex items-center justify-center border border-primary-yellow/50"
              >
                <FiMail className="w-8 h-8 text-primary-yellow" />
              </motion.div>

              <div>
                <h2 className="text-xl font-bold mb-1 text-white">
                  Check Your Email
                </h2>
                <p className="text-gray-400">
                  Login link sent to<br />
                  <span className="text-primary-yellow font-bold">{email}</span>
                </p>
              </div>

              <p className="text-xs text-gray-500 border-t border-white/10 pt-4 mt-4">
                Click the link in your email to sign in. Link expires in 24 hours.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setEmailSent(false)}
                className="w-full mt-4 px-4 py-3 rounded-xl text-sm font-bold transition-all bg-white/10 hover:bg-white/20 text-white"
              >
                Send Another Email
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              {!isGuest && (
                <div>
                  <label className="block text-sm font-bold mb-2 text-white">
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
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none font-bold placeholder-gray-600 ${error
                        ? 'border-red-500 bg-red-500/10 text-white'
                        : 'border-white/10 bg-[#141414] hover:border-white/20 focus:border-primary-yellow focus:shadow-yellow-glow/20 text-white'
                        }`}
                    />
                  </motion.div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/10"
                >
                  <p className="text-sm font-bold text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || (!email && !isGuest)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 rounded-xl font-bold text-black text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${loading || (!email && !isGuest)
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-primary-yellow hover:bg-primary-yellow-hover hover:shadow-yellow-glow'
                  }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Send Login Link
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Guest Button (Secondary) */}
              <motion.button
                type="button"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGuestLogin}
                className="w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-[#141414] border-2 border-white/5 hover:border-white/20 text-gray-300 hover:text-white"
              >
                Continue as Guest
              </motion.button>

              {/* Divider 2 */}
              <div className="relative flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  Social Login
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleLogin}
                  className="py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 bg-[#141414] border border-white/5 hover:border-white/20 text-white"
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
                  className="py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 bg-[#141414] border border-white/5 hover:border-white/20 text-white"
                >
                  <FaApple size={20} />
                  <span className="text-sm">Apple</span>
                </motion.button>
              </div>

              {/* Footer */}
              <p className="text-center text-xs text-gray-500 mt-4">
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
          className="text-center mt-8 text-sm text-gray-400 font-medium"
        >
          Don't have an account?{' '}
          <a href="/signup" className="text-primary-yellow font-bold hover:underline transition-colors hover:shadow-yellow-glow">
            Sign Up
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;



