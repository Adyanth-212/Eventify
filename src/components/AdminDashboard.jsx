import { useState, useEffect } from 'react';
import { useAuth } from '../utils/useAuth';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

// API service for admin operations
const adminService = {
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/users?${queryString}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },
  
  getAllEvents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/events/admin/all?${queryString}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },
  
  deleteEvent: async (eventId) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },
  
  deleteUser: async (userId) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },
  
  updateUserRole: async (userId, role) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role })
    });
    return response.json();
  }
};

export const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    adminUsers: 0,
    organizers: 0,
    attendees: 0
  });

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab !== 'overview') {
      fetchData();
    } else {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes] = await Promise.all([
        adminService.getAllUsers({ limit: 1000 }),
        adminService.getAllEvents({ limit: 1000 })
      ]);

      if (usersRes.success && eventsRes.success) {
        setStats({
          totalUsers: usersRes.total || 0,
          totalEvents: eventsRes.total || 0,
          adminUsers: usersRes.users?.filter(u => u.role === 'admin').length || 0,
          organizers: usersRes.users?.filter(u => u.role === 'organizer').length || 0,
          attendees: usersRes.users?.filter(u => u.role === 'attendee').length || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await adminService.getAllUsers({ detailed: true, limit: 100 });
        if (res.success) {
          setUsers(res.users || []);
        }
      } else if (activeTab === 'events') {
        const res = await adminService.getAllEvents({ limit: 100 });
        console.log('Events API Response:', res); // Debug log
        if (res.success) {
          setEvents(res.events || []);
          console.log('Events set:', res.events?.length || 0); // Debug log
        } else {
          console.error('Events API error:', res.message);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This will also delete all registrations for this event.`)) return;
    
    try {
      const res = await adminService.deleteEvent(eventId);
      if (res.success) {
        setEvents(prev => prev.filter(e => e._id !== eventId));
        alert('Event deleted successfully');
      } else {
        alert(res.message || 'Failed to delete event');
      }
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This will also delete all their events and registrations.`)) return;
    
    try {
      const res = await adminService.deleteUser(userId);
      if (res.success) {
        setUsers(prev => prev.filter(u => u._id !== userId));
        alert('User deleted successfully');
      } else {
        alert(res.message || 'Failed to delete user');
      }
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleUpdateUserRole = async (userId, newRole, userName) => {
    if (!confirm(`Are you sure you want to change ${userName}'s role to ${newRole}?`)) return;
    
    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.success) {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
        alert('User role updated successfully');
      } else {
        alert(res.message || 'Failed to update user role');
      }
    } catch (error) {
      alert('Failed to update user role');
    }
  };

  if (user?.role !== 'admin') {
    return <div className="loading">Checking permissions...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>System administration and management</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="overview-section">
                <h2>System Overview</h2>
                <div className="admin-stats">
                  <div className="stat-card">
                    <h3>{stats.totalUsers}</h3>
                    <p>Total Users</p>
                  </div>
                  <div className="stat-card">
                    <h3>{stats.totalEvents}</h3>
                    <p>Total Events</p>
                  </div>
                  <div className="stat-card">
                    <h3>{stats.adminUsers}</h3>
                    <p>Admins</p>
                  </div>
                  <div className="stat-card">
                    <h3>{stats.organizers}</h3>
                    <p>Organizers</p>
                  </div>
                  <div className="stat-card">
                    <h3>{stats.attendees}</h3>
                    <p>Attendees</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-section">
                <div className="section-header">
                  <h2>User Management</h2>
                  <div className="db-info">
                    <span className="db-label">Total Records:</span>
                    <span className="db-value">{users.length}</span>
                  </div>
                </div>
                
                <div className="table-container enhanced">
                  <table className="admin-table detailed">
                    <thead>
                      <tr>
                        <th>User Profile</th>
                        <th>Contact Info</th>
                        <th>Security</th>
                        <th>Role & Status</th>
                        <th>Activity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(userItem => (
                        <tr key={userItem._id} className="user-row">
                          <td>
                            <div className="user-profile">
                              <div className="user-avatar-container">
                                {userItem.profilePicture ? (
                                  <img src={userItem.profilePicture} alt={userItem.name} className="user-avatar" />
                                ) : (
                                  <div className="avatar-placeholder">
                                    {userItem.name?.charAt(0)?.toUpperCase() || '?'}
                                  </div>
                                )}
                              </div>
                              <div className="user-details">
                                <span className="user-name">{userItem.name}</span>
                                <small className="user-id">ID: {userItem._id}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="contact-info">
                              <div className="email">{userItem.email}</div>
                              {userItem.phone && (
                                <div className="phone">Phone: {userItem.phone}</div>
                              )}
                              {userItem.bio && (
                                <div className="bio">Bio: {userItem.bio.substring(0, 50)}{userItem.bio.length > 50 ? '...' : ''}</div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="security-info">
                              <div className="password-field">
                                <span className="field-label">Password:</span>
                                <span className="password-masked">{userItem.maskedPassword || '••••••••'}</span>
                              </div>
                              <div className="created-date">
                                <span className="field-label">Created:</span>
                                <span>{new Date(userItem.createdAt).toLocaleDateString()}</span>
                              </div>
                              {userItem.updatedAt && (
                                <div className="updated-date">
                                  <span className="field-label">Updated:</span>
                                  <span>{new Date(userItem.updatedAt).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="role-status">
                              <select 
                                value={userItem.role} 
                                onChange={(e) => handleUpdateUserRole(userItem._id, e.target.value, userItem.name)}
                                className={`role-badge enhanced ${userItem.role}`}
                                disabled={userItem._id === user._id}
                              >
                                <option value="attendee">Attendee</option>
                                <option value="organizer">Organizer</option>
                                <option value="admin">Admin</option>
                              </select>
                              <div className="status-indicators">
                                {userItem._id === user._id && <span className="current-user">Current User</span>}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="activity-stats">
                              <div className="stat">
                                <span className="stat-label">Events Created:</span>
                                <span className="stat-value">{userItem.eventsCreated?.length || 0}</span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">Registered:</span>
                                <span className="stat-value">{userItem.eventsRegistered?.length || 0}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-danger btn-small"
                                onClick={() => handleDeleteUser(userItem._id, userItem.name)}
                                disabled={userItem._id === user._id}
                                title="Delete User"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="events-section">
                <div className="section-header">
                  <h2>Event Management</h2>
                  <div className="db-info">
                    <span className="db-label">Total Records:</span>
                    <span className="db-value">{events.length}</span>
                  </div>
                </div>
                
                <div className="table-container enhanced">
                  <table className="admin-table detailed">
                    <thead>
                      <tr>
                        <th>Event Details</th>
                        <th>Organizer Info</th>
                        <th>Schedule & Location</th>
                        <th>Registration Data</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map(event => (
                        <tr key={event._id} className="event-row">
                          <td>
                            <div className="event-details">
                              <div className="event-image-container">
                                {event.image ? (
                                  <img src={event.image} alt={event.title} className="event-thumbnail" />
                                ) : (
                                  <div className="image-placeholder">IMG</div>
                                )}
                              </div>
                              <div className="event-info">
                                <span className="event-title">{event.title}</span>
                                <small className="event-id">ID: {event._id}</small>
                                {event.category && (
                                  <span className="event-category">{event.category}</span>
                                )}
                                {event.description && (
                                  <div className="event-description">
                                    {event.description.substring(0, 80)}{event.description.length > 80 ? '...' : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="organizer-info">
                              <span className="organizer-name">{event.organizer?.name || 'Unknown'}</span>
                              {event.organizer?.email && (
                                <div className="organizer-email">{event.organizer.email}</div>
                              )}
                              {event.organizer?._id && (
                                <small className="organizer-id">ID: {event.organizer._id}</small>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="schedule-location">
                              <div className="date-time">
                                <span className="field-label">Date:</span>
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                              {event.time && (
                                <div className="time">
                                  <span className="field-label">Time:</span>
                                  <span>{event.time}</span>
                                </div>
                              )}
                              {event.location && (
                                <div className="location">
                                  <span className="field-label">Location:</span>
                                  <span>{event.location}</span>
                                </div>
                              )}
                              <div className="created-date">
                                <span className="field-label">Created:</span>
                                <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="registration-data">
                              <div className="capacity-info">
                                <span className="registrations">{event.registeredCount || 0}</span>
                                <span className="separator">/</span>
                                <span className="capacity">{event.capacity}</span>
                              </div>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill"
                                  style={{ width: `${((event.registeredCount || 0) / event.capacity) * 100}%` }}
                                ></div>
                              </div>
                              <div className="registration-percentage">
                                {Math.round(((event.registeredCount || 0) / event.capacity) * 100)}% Full
                              </div>
                              {event.tags && event.tags.length > 0 && (
                                <div className="event-tags">
                                  {event.tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="tag">{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-danger btn-small"
                                onClick={() => handleDeleteEvent(event._id, event.title)}
                                title="Delete Event"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};