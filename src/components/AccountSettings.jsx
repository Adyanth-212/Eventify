import { useState } from 'react';
import { useAuth } from '../utils/useAuth';
import { authService } from '../services/api';
import '../styles/AccountSettings.css';

export const AccountSettings = () => {
  const { user, setUser } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || ''
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const res = await authService.updateProfile(profileForm);
      setUser(res.data.user);
      setMessage('✅ Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setMessage('✅ Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-settings">
      <div className="settings-navigation">
        <button
          className={activeSection === 'profile' ? 'active' : ''}
          onClick={() => setActiveSection('profile')}
        >
          👤 Profile
        </button>
        <button
          className={activeSection === 'password' ? 'active' : ''}
          onClick={() => setActiveSection('password')}
        >
          🔒 Password
        </button>
        <button
          className={activeSection === 'account' ? 'active' : ''}
          onClick={() => setActiveSection('account')}
        >
          ⚙️ Account
        </button>
      </div>

      <div className="settings-content">
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {activeSection === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="settings-form">
            <h2>Profile Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                placeholder="e.g. +1 234 567 8900"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {activeSection === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="settings-form">
            <h2>Change Password</h2>

            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}

        {activeSection === 'account' && (
          <div className="account-info">
            <h2>Account Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Account Type:</span>
                <span className="value">{user?.role === 'organizer' ? '🎤 Event Organizer' : '👤 Attendee'}</span>
              </div>
              <div className="info-item">
                <span className="label">Member Since:</span>
                <span className="value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Events Created:</span>
                <span className="value">{user?.eventsCreated?.length || 0}</span>
              </div>
              <div className="info-item">
                <span className="label">Events Registered:</span>
                <span className="value">{user?.eventsRegistered?.length || 0}</span>
              </div>
            </div>

            {user?.role === 'attendee' && (
              <div className="upgrade-section">
                <h3>Want to create events?</h3>
                <p>Upgrade to an Organizer account to start creating and managing your own events.</p>
                <button className="btn-primary" disabled>
                  Request Organizer Access
                </button>
                <p className="note">Contact support to upgrade your account</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
