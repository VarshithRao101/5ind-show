import React, { useContext, useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBell, FiClock, FiMoon, FiGlobe, FiHelpCircle,
  FiLock, FiInfo, FiLogOut, FiEdit2, FiX, FiSave,
} from 'react-icons/fi';
import SettingsRow from '../../components/SettingsRow';
import ThemeToggle from '../../components/ThemeToggle';
import { useToast } from '../../context/ToastContext';
import AvatarSelector from '../../components/AvatarSelector';
import { UserContext } from '../../context/UserContext';
import { AuthContext } from '../../context/AuthContext';

// ...

const Profile = () => {
  const { darkTheme, notifications, toggleDarkTheme, toggleNotifications } = useContext(UserContext);
  const { logout, user, username, userAvatar, updateUsername, updateUserAvatar } = useContext(AuthContext);
  const { addToast } = useToast();

  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditProfile = useCallback(() => {
    setEditName(username || user?.displayName || '');
    setSelectedAvatar(userAvatar || user?.photoURL || '');
    setShowEditModal(true);
  }, [username, user, userAvatar]);

  const handleSaveProfile = useCallback(async () => {
    if (!editName.trim()) return;

    setIsSaving(true);
    try {
      // 1. Update Name
      if (editName !== username) {
        await updateUsername(editName.trim());
      }

      // 2. Update Avatar
      if (selectedAvatar !== userAvatar) {
        await updateUserAvatar(selectedAvatar);
      }

      setShowEditModal(false);
      addToast('Profile updated successfully!', 'success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      addToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [editName, username, selectedAvatar, userAvatar, updateUsername, updateUserAvatar, addToast]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      navigate('/login');
    }
  }, [logout, navigate]);

  // Navigation Handlers
  const handleWatchHistory = () => console.log('Navigate to watch history');
  const handleLanguage = () => console.log('Change language');
  const handleHelpSupport = () => console.log('Open help & support');
  const handlePrivacySecurity = () => console.log('Open privacy & security');
  const handleAbout = () => console.log('Show about dialog');

  // Display Logic
  const displayAvatar = userAvatar || user?.photoURL;
  const displayName = username || user?.displayName || 'Movie Enthusiast';
  const displayEmail = user?.email || 'user@example.com';
  const displayInitial = (displayName || displayEmail || 'U')[0].toUpperCase();

  return (
    <div className={`min-h-screen ${darkTheme ? 'bg-app-bg-dark text-white' : 'bg-app-bg-light text-text-light'} pb-32 fade-in transition-colors duration-300`}>
      {/* Cinematic Header Background */}
      <div className={`absolute top-0 left-0 right-0 h-64 ${darkTheme ? 'bg-gradient-to-b from-primary-yellow/10 via-primary-yellow/5 to-transparent' : 'bg-gradient-to-b from-primary-yellow/5 via-primary-yellow/2 to-transparent'} pointer-events-none`} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        {/* Profile Header with Avatar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-yellow to-primary-yellow-dark flex items-center justify-center text-4xl font-heading font-bold shadow-yellow-glow-lg p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-black/20 flex items-center justify-center">
                {displayAvatar ? (
                  <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-black/50">{displayInitial}</span>
                )}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleEditProfile}
              className="absolute bottom-1 right-1 w-10 h-10 bg-card-bg border-2 border-primary-yellow rounded-full flex items-center justify-center shadow-yellow-glow z-20"
            >
              <FiEdit2 size={16} className="text-primary-yellow" />
            </motion.button>
          </div>

          {/* User Info */}
          <h1 className="text-3xl font-heading font-bold text-white mb-1">
            {displayName}
          </h1>
          <p className="text-muted-text text-sm">{displayEmail}</p>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {/* Account Settings */}
          <div>
            <h2 className="text-lg font-heading font-bold text-white mb-4">Account Settings</h2>
            <div className="space-y-2">
              <SettingsRow
                icon={FiEdit2}
                title="Edit Profile"
                subtitle="Update avatar & personal info"
                onClick={handleEditProfile}
              />
              <SettingsRow
                icon={FiClock}
                title="Watch History"
                subtitle="View your watching history"
                onClick={handleWatchHistory}
              />
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h2 className="text-lg font-heading font-bold text-white mb-4">Preferences</h2>
            <div className="space-y-2">
              <SettingsRow
                icon={FiBell}
                title="Notifications"
                subtitle={notifications ? 'Enabled' : 'Disabled'}
                rightElement={
                  <ThemeToggle
                    enabled={notifications}
                    onChange={toggleNotifications}
                  />
                }
              />
              <SettingsRow
                icon={FiMoon}
                title="Dark Theme"
                subtitle={darkTheme ? 'Enabled' : 'Disabled'}
                rightElement={
                  <ThemeToggle
                    enabled={darkTheme}
                    onChange={toggleDarkTheme}
                  />
                }
              />
              <SettingsRow
                icon={FiGlobe}
                title="Language"
                subtitle="English"
                onClick={handleLanguage}
              />
            </div>
          </div>

          {/* Support & Info */}
          <div>
            <h2 className="text-lg font-heading font-bold text-white mb-4">Support & Info</h2>
            <div className="space-y-2">
              <SettingsRow
                icon={FiLock}
                title="Privacy & Security"
                subtitle="Manage your privacy settings"
                onClick={handlePrivacySecurity}
              />
              <SettingsRow
                icon={FiHelpCircle}
                title="Help & Support"
                subtitle="Get help and contact support"
                onClick={handleHelpSupport}
              />
              <SettingsRow
                icon={FiInfo}
                title="About"
                subtitle={`Version 1.0.0 • © ${new Date().getFullYear()} 5indShow`}
                onClick={handleAbout}
              />
            </div>
          </div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl bg-primary-yellow hover:bg-primary-yellow-hover text-black font-bold text-lg transition-all shadow-yellow-glow flex items-center justify-center gap-3"
          >
            <FiLogOut size={20} />
            Logout
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-[#9AA0A6] pb-8"
        >
          <p>Made with 🎬 for movie lovers</p>
        </motion.div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg card-elevated p-6 shadow-yellow-glow-lg my-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-bold text-white">Edit Profile</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 rounded-xl hover:bg-card-bg text-muted-text hover:text-white transition-all"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Avatar Selection Section */}
              <div className="mb-0">
                <label className="block text-sm font-bold text-white mb-3">Choose Avatar</label>
                <AvatarSelector
                  selectedAvatar={selectedAvatar}
                  onSelect={setSelectedAvatar}
                />
              </div>

              {/* Input */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-white mb-2">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 rounded-xl bg-card-bg border-2 border-card-border focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow/30 focus:shadow-yellow-glow transition-all focus:outline-none text-white placeholder-muted-text font-medium"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 sticky bottom-0 bg-[#121212] pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 rounded-xl bg-card-bg hover:bg-card-bg/80 text-white border border-card-border font-bold transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveProfile}
                  disabled={isSaving || !editName.trim()}
                  className="flex-1 py-3 rounded-xl bg-primary-yellow hover:bg-primary-yellow-hover disabled:bg-gray-700 disabled:opacity-50 text-black font-bold transition-all shadow-yellow-glow flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-5 h-5 border-2 border-transparent border-t-white rounded-full"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={18} />
                      Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;



