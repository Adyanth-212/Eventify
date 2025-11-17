import { useState, useEffect } from 'react';
import { useAuth } from '../utils/useAuth';
import { useNavigate } from 'react-router-dom';
import { EventForm } from '../components/EventForm';
import { AccountSettings } from '../components/AccountSettings';
import { MyEvents } from '../components/MyEvents';
import { MyRegistrations } from '../components/MyRegistrations';
import { AdminDashboard } from '../components/AdminDashboard';
import { eventService, registrationService } from '../services/api';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    eventsCount: 0,
    upcomingCount: 0,
    attendeesCount: 0
  });

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      if (user?.role === 'organizer') {
        // For organizers: fetch their created events
        const res = await eventService.getMyEvents();
        const events = res.data.events || [];
        const upcoming = events.filter(e => new Date(e.date) >= new Date());
        const totalAttendees = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);
        
        setStats({
          eventsCount: events.length,
          upcomingCount: upcoming.length,
          attendeesCount: totalAttendees
        });
      } else {
        // For attendees: fetch their registrations
        const res = await registrationService.getMyRegistrations();
        const registrations = res.data.registrations || [];
        const upcoming = registrations.filter(r => {
          const eventDate = new Date(r.event?.date);
          return eventDate >= new Date();
        });
        
        setStats({
          eventsCount: registrations.length,
          upcomingCount: upcoming.length,
          attendeesCount: registrations.filter(r => r.status === 'registered').length
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  // Show admin dashboard for admin users
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Role: <strong>{user?.role === 'organizer' ? 'Event Organizer' : user?.role === 'admin' ? 'Administrator' : 'Attendee'}</strong></p>
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => {
            setActiveTab('overview');
            fetchStats(); // Refresh stats when clicking Overview
          }}
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
                <h3>{stats.eventsCount}</h3>
                <p>Events {user?.role === 'organizer' ? 'Created' : 'Registered'}</p>
              </div>
              <div className="stat-card">
                <h3>{stats.upcomingCount}</h3>
                <p>Upcoming Events</p>
              </div>
              <div className="stat-card">
                <h3>{stats.attendeesCount}</h3>
                <p>{user?.role === 'organizer' ? 'Total Attendees' : 'Active Registrations'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-events' && (
          <div className="my-events-section">
            <MyEvents />
          </div>
        )}

        {activeTab === 'create-event' && (
          <div className="create-event-section">
            <EventForm onSuccess={(event) => {
              alert(`Event "${event.title}" created successfully!`);
              fetchStats(); // Refresh stats after creating event
              setActiveTab('my-events');
            }} />
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="registrations-section">
            <MyRegistrations onUpdate={fetchStats} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <AccountSettings />
          </div>
        )}
      </div>
    </div>
  );
};
