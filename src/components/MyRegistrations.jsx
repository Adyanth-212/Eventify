import { useState, useEffect } from 'react';
import { registrationService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/MyRegistrations.css';

export const MyRegistrations = ({ onUpdate }) => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

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
      if (onUpdate) onUpdate(); // Refresh parent stats
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel registration');
    }
  };

  const handleViewTicket = (registration) => {
    setSelectedTicket(registration);
    setShowTicketModal(true);
  };

  const handleCloseTicket = () => {
    setSelectedTicket(null);
    setShowTicketModal(false);
  };

  if (loading) return <div className="loading">Loading your registrations...</div>;
  if (error) return <div className="error-message">{error}</div>;

  // Ticket Modal Component
  const TicketModal = ({ ticket, onClose }) => {
    if (!ticket || !ticket.event) return null;
    
    const event = ticket.event;
    const eventDate = new Date(event.date);
    const registrationDate = new Date(ticket.createdAt);
    const isPastEvent = eventDate < new Date();
    
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>🎟️ Event Ticket</h2>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          
          <div className="ticket-content">
            <div className="ticket-event-info">
              <img 
                src={event.image || 'https://via.placeholder.com/200x150'} 
                alt={event.title}
                className="ticket-image"
              />
              <div className="ticket-details">
                <h3>{event.title}</h3>
                <div className="ticket-info-grid">
                  <div className="ticket-info-item">
                    <strong>Date & Time:</strong>
                    <span>{eventDate.toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="ticket-info-item">
                    <strong>Location:</strong>
                    <span>{event.location}</span>
                  </div>
                  <div className="ticket-info-item">
                    <strong>Ticket Number:</strong>
                    <span>#{ticket.ticketNumber || 'N/A'}</span>
                  </div>
                  <div className="ticket-info-item">
                    <strong>Status:</strong>
                    <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
                  </div>
                  <div className="ticket-info-item">
                    <strong>Capacity:</strong>
                    <span>{event.registeredCount || 0} / {event.capacity}</span>
                  </div>
                  <div className="ticket-info-item">
                    <strong>Category:</strong>
                    <span>{event.category}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {event.description && (
              <div className="ticket-description">
                <strong>Event Description:</strong>
                <p>{event.description}</p>
              </div>
            )}
            
            <div className="ticket-footer">
              <p><strong>Registered on:</strong> {registrationDate.toLocaleDateString()}</p>
              {isPastEvent && (
                <p className="past-event-note">This event has already taken place.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
                    <p>{eventDate.toLocaleDateString()} at {event.time}</p>
                    <p>{event.location}</p>
                    <p>Ticket #{registration.ticketNumber || 'N/A'}</p>
                    <p className="registration-date">
                      Registered on: {new Date(registration.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="registration-actions">
                    <button 
                      className="btn-primary" 
                      onClick={() => handleViewTicket(registration)}
                    >
                      View Ticket
                    </button>
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

      {/* Ticket Modal */}
      {showTicketModal && selectedTicket && (
        <TicketModal ticket={selectedTicket} onClose={handleCloseTicket} />
      )}
    </div>
  );
};
