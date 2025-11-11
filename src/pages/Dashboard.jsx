import { useState, useEffect } from 'react';
import { useAuth } from '../utils/useAuth';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}! 👋</h1>
        <p>Role: <strong>{user?.role === 'organizer' ? '🎤 Event Organizer' : '👤 Attendee'}</strong></p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        {user?.role === 'organizer' && (
          <button
            className={activeTab === 'my-events' ? 'active' : ''}
            onClick={() => setActiveTab('my-events')}
          >
            My Events
          </button>
        )}
        {user?.role === 'organizer' && (
          <button
            className={activeTab === 'create-event' ? 'active' : ''}
            onClick={() => setActiveTab('create-event')}
          >
            Create Event
          </button>
        )}
        <button
          className={activeTab === 'registrations' ? 'active' : ''}
          onClick={() => setActiveTab('registrations')}
        >
          My Registrations
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>0</h3>
                <p>Events {user?.role === 'organizer' ? 'Created' : 'Registered'}</p>
              </div>
              <div className="stat-card">
                <h3>0</h3>
                <p>Upcoming Events</p>
              </div>
              <div className="stat-card">
                <h3>0</h3>
                <p>Total Attendees</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-events' && (
          <div className="my-events-section">
            <h2>My Events</h2>
            <button className="btn-primary" onClick={() => setActiveTab('create-event')}>
              + Create New Event
            </button>
            <p>Your organized events will appear here.</p>
          </div>
        )}

        {activeTab === 'create-event' && (
          <div className="create-event-section">
            <h2>Create New Event</h2>
            <p>Event creation form coming soon...</p>
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="registrations-section">
            <h2>My Registrations</h2>
            <p>Your event registrations will appear here.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2>Profile Settings</h2>
            <p>Email: {user?.email}</p>
            <p>Account Settings coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};
