import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { CURRENCIES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';
import './Profile.css';

export default function Profile() {
  const { currentUser, updateUser } = useAuth();

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    full_name: currentUser?.full_name || '',
    currency: currentUser?.currency || 'INR',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const res = await authAPI.updateProfile(profileData);
      updateUser(res.user || profileData);
      setProfileSuccess('Profile preferences saved successfully!');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (passwordData.new_password.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    try {
      await authAPI.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setPasswordSuccess('Password successfully updated!');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>User Account & Settings</h2>
        <p className="text-secondary">Manage your identity, preferred currency, and account credentials.</p>
      </div>

      <div className="profile-grid">
        {/* Account Info Card */}
        <Card title="Account Overview" className="profile-info-card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {(currentUser?.full_name || currentUser?.username || 'U')[0].toUpperCase()}
            </div>
            <div className="profile-names">
              <h3>{currentUser?.full_name || currentUser?.username}</h3>
              <p className="text-muted">@{currentUser?.username}</p>
            </div>
          </div>

          <div className="profile-meta-list">
            <div className="profile-meta-item">
              <span className="meta-label">Email Address</span>
              <span className="meta-val">{currentUser?.email}</span>
            </div>
            <div className="profile-meta-item">
              <span className="meta-label">Account Created</span>
              <span className="meta-val">{formatDate(currentUser?.created_at)}</span>
            </div>
            <div className="profile-meta-item">
              <span className="meta-label">Active Currency</span>
              <span className="meta-val font-bold">{currentUser?.currency || 'INR'}</span>
            </div>
          </div>
        </Card>

        {/* Profile Settings Form */}
        <Card title="Personal Preferences" className="profile-form-card">
          {profileSuccess && (
            <div className="alert-success-box">✓ {profileSuccess}</div>
          )}
          {profileError && (
            <div className="alert-error-box">⚠️ {profileError}</div>
          )}

          <form onSubmit={handleProfileSubmit} className="profile-form">
            <Input
              label="Full Name"
              type="text"
              value={profileData.full_name}
              onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="e.g. Rahul Sharma"
              icon="👤"
            />

            <div className="input-group">
              <label className="input-label">Preferred Currency</label>
              <select
                value={profileData.currency}
                onChange={(e) => setProfileData(prev => ({ ...prev, currency: e.target.value }))}
                className="input-field"
              >
                {CURRENCIES.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol}) - {curr.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="profile-form-actions">
              <Button type="submit" variant="primary" loading={profileLoading}>
                Save Preferences
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card title="Security & Password" className="profile-form-card">
          {passwordSuccess && (
            <div className="alert-success-box">✓ {passwordSuccess}</div>
          )}
          {passwordError && (
            <div className="alert-error-box">⚠️ {passwordError}</div>
          )}

          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.current_password}
              onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
              placeholder="••••••••"
              icon="🔒"
              required
            />

            <Input
              label="New Password"
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
              placeholder="At least 6 characters"
              icon="🔑"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
              placeholder="Re-type new password"
              icon="🔐"
              required
            />

            <div className="profile-form-actions">
              <Button type="submit" variant="primary" loading={passwordLoading}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

