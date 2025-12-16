import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import InputField from '../../components/InputField';
import SocialLoginButtons from '../../components/SocialLoginButtons';
import { useAuth } from '../../context/AuthContext';
import { verifyCaptcha } from '../../utils/verifyCaptcha';

const RECAPTCHA_SITE_KEY = '6LeRUigsAAAAAEO8oXMaswEvyXlpjTKncWJRUu_w';

const Signup = () => {
  const { sendEmailLink, googleLogin, loading, error: authError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [localError, setLocalError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Initialize reCAPTCHA
  useEffect(() => {
    const loadRecaptcha = () => {
      // Check if script is loaded
      if (typeof window !== 'undefined' && window.grecaptcha) {
        const container = document.getElementById('recaptcha-signup');
        if (container && container.innerHTML === '') {
          try {
            console.log('Rendering reCAPTCHA with key:', RECAPTCHA_SITE_KEY.substring(0, 10) + '...');
            window.grecaptcha.render('recaptcha-signup', {
              sitekey: RECAPTCHA_SITE_KEY,
              callback: onRecaptchaSuccess,
              'expired-callback': onRecaptchaExpired,
              theme: 'dark',
            });
          } catch (error) {
            console.error('Error rendering reCAPTCHA:', error.message);
            // Show error in container
            if (container) {
              container.innerHTML = `<p style="color: red; font-size: 12px;">reCAPTCHA failed to load. Please refresh the page.</p>`;
            }
          }
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadRecaptcha, 500);

    return () => clearTimeout(timer);
  }, []);

  const onRecaptchaSuccess = (token) => {
    setCaptchaToken(token);
    setCaptchaVerified(true);
    setCaptchaError('');
  };

  const onRecaptchaExpired = () => {
    setCaptchaVerified(false);
    setCaptchaToken('');
    setCaptchaError('Captcha expired. Please verify again.');
  };

  const validateField = (name, value) => {
    const newErrors = { ...formErrors };

    if (name === 'email') {
      if (!value.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = 'Invalid email format';
      } else {
        delete newErrors.email;
      }
    }

    setFormErrors(newErrors);
    return newErrors;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      validateField('email', value);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    const value = field === 'email' ? email : '';
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setCaptchaError('');

    // Verify captcha first
    if (!captchaVerified || !captchaToken) {
      setCaptchaError('Please complete the captcha verification.');
      return;
    }

    // Verify with backend (Cloud Function)
    try {
      console.log('Verifying captcha token...');
      const isValid = await verifyCaptcha(captchaToken);

      if (!isValid) {
        setCaptchaError('Captcha verification failed. Please try again.');
        setCaptchaVerified(false);
        // Reset captcha
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        return;
      }

      console.log('Captcha verified successfully!');

      // Validate email
      const newErrors = validateField('email', email);
      if (newErrors.email) {
        return;
      }

      // Send email link
      await sendEmailLink(email);
      setEmailSent(true);
    } catch (err) {
      console.error('Signup error:', err);
      setLocalError(err.message || 'Failed to send verification email');
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setLocalError('');
      await googleLogin();
      navigate('/genres');
    } catch (err) {
      setLocalError(err.message || 'Google signup failed');
    }
  };

  const handleAppleSignup = () => {
    alert('Apple signup coming soon');
  };

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center px-4 py-6 sm:py-12 fade-in">
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
          <h1 className="text-4xl font-heading font-bold text-white mb-2 text-center">Create Account</h1>
          <p className="text-muted-text text-center max-w-xs">Join 5indshow and explore unlimited content</p>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="card-elevated p-6 sm:p-8 shadow-yellow-glow"
        >
          {/* Error Alert */}
          {(localError || authError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-red-500 text-sm font-medium">{localError || authError}</p>
            </motion.div>
          )}

          {/* Success Message - Email Sent */}
          {emailSent ? (
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
                <svg className="w-10 h-10 text-primary-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-3 text-center">Email Sent Successfully!</h2>
              <p className="text-muted-text text-center mb-2">Check your inbox for a verification link</p>
              <p className="text-muted-text text-sm text-center mb-8">We've sent a secure verification link to:</p>
              <p className="text-white font-semibold text-center mb-8 break-words">{email}</p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                  setLocalError('');
                }}
                className="w-full py-3 rounded-2xl bg-primary-yellow hover:bg-primary-yellow-hover text-white font-bold transition-all duration-200 shadow-yellow-glow hover:shadow-yellow-glow-lg mb-4"
              >
                Send to Different Email
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
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email Field */}
                <InputField
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                  error={touched.email ? formErrors.email : ''}
                />

                {/* reCAPTCHA Container */}
                <div className="flex justify-center py-4 px-4 rounded-lg bg-black/30 border border-gray-700">
                  <div id="recaptcha-signup"></div>
                </div>

                {/* Captcha Error */}
                {captchaError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <p className="text-red-500 text-sm font-medium">{captchaError}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading || !captchaVerified}
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-primary-yellow hover:bg-primary-yellow-hover disabled:bg-gray-700 disabled:opacity-50 text-white font-bold text-lg transition-all duration-200 shadow-yellow-glow hover:shadow-yellow-glow-lg disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-5 h-5 border-2 border-transparent border-t-white rounded-full"
                      />
                      Sending Verification Link...
                    </span>
                  ) : (
                    'Send Verification Link'
                  )}
                </motion.button>
              </form>

              {/* Social Signup */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <SocialLoginButtons
                  onGoogle={handleGoogleSignup}
                  onApple={handleAppleSignup}
                  loading={loading}
                />
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-muted-text"
        >
          <p>
            Already have an account?{' '}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/login')}
              type="button"
              className="text-primary-yellow font-bold hover:text-primary-yellow-hover transition-colors focus:outline-none"
            >
              Sign In
            </motion.button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;



