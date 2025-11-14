import { useState, useEffect } from 'react';
import { registrationService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/MyRegistrations.css';

export const MyRegistrations = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await registrationService.getMyRegistrations();
      setRegistrations(res.data.registrations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId, registrationId) => {
    if (!confirm('Are you sure you want to cancel this registration?')) return;
    
    try {
      await registrationService.unregister(eventId);
      setRegistrations(prev => prev.filter(r => r._id !== registrationId));
      alert('Registration cancelled successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel registration');
    }
  };

  if (loading) return <div className="loading">Loading your registrations...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="registrations-container">
      <h2>My Registrations</h2>

      {registrations.length === 0 ? (
        <div className="no-registrations">
          <p>You haven't registered for any events yet.</p>
          <button className="btn-primary" onClick={() => navigate('/events')}>
            Browse Events
          </button>
        </div>
      ) : (
        <div className="registrations-list">
          {registrations.map((registration) => {
            const event = registration.event;
            if (!event) return null;
            
            const eventDate = new Date(event.date);
            const isPast = eventDate < new Date();
            
            return (
              <div key={registration._id} className="registration-card">
                <img 
                  src={event.image || 'https://via.placeholder.com/200x150'} 
                  alt={event.title}
                  className="registration-image"
                />
                <div className="registration-content">
                  <div className="registration-header">
                    <h3>{event.title}</h3>
                    <span className={`status-badge ${registration.status}`}>
                      {registration.status}
                    </span>
                  </div>
                  
                  <div className="registration-details">
                    <p>📅 {eventDate.toLocaleDateString()} at {event.time}</p>
                    <p>📍 {event.location}</p>
                    <p>🎟️ Ticket #{registration.ticketNumber || 'N/A'}</p>
                    <p className="registration-date">
                      Registered on: {new Date(registration.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="registration-actions">
                    <button 
                      className="btn-secondary" 
                      onClick={() => navigate(`/events/${event._id}`)}
                    >
                      View Event
                    </button>
                    {!isPast && registration.status === 'registered' && (
                      <button 
                        className="btn-danger" 
                        onClick={() => handleCancel(event._id, registration._id)}
                      >
                        Cancel Registration
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
