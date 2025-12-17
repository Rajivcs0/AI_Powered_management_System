import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Key, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    uniqueId: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { changePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.uniqueId.match(/^\d{4,8}$/)) {
      alert('Unique ID must be 4-8 digits only');
      return false;
    }
    if (formData.newPassword.length !== 8) {
      alert('New password must be exactly 8 characters');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      alert('New password must be different from current password');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    const result = await changePassword(formData.currentPassword, formData.newPassword);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <Key className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Password Changed Successfully!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your password has been updated successfully.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Redirecting to login page in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-md w-full">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Change Password Card */}
        <div className="card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <Key className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Change Password
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update your account password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label htmlFor="uniqueId" className="form-label">
                Unique ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="uniqueId"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleChange}
                placeholder="Enter your unique ID (4-8 digits)"
                className="form-input"
                required
                pattern="[0-9]{4,8}"
                title="Please enter 4-8 digits only"
              />
              <p className="text-xs text-gray-500 mt-1">Must be 4-8 digits only</p>
            </div>

            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="input-group">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className="form-input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="input-icon"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="input-group">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (8 characters)"
                  className="form-input pr-10"
                  required
                  minLength="8"
                  maxLength="8"
                  title="Password must be exactly 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="input-icon"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be exactly 8 characters</p>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="form-input pr-10"
                  required
                  minLength="8"
                  maxLength="8"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="input-icon"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
            >
              {loading ? <LoadingSpinner /> : 'Change Password'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
              >
                Sign in here
              </Link>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <Link
                to="/signup"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
              >
                Create new account
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; 2024 Global Analyst Technologies. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
