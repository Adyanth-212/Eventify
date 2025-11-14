import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../utils/useAuth';
import { RegistrationModal } from '../components/Modal';
import '../styles/EventDetails.css';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [registration, setRegistration] = useState(null);

  const isRegistered = useMemo(() => {
    if (!user || !event?.attendees) return false;
    return event.attendees.some((a) => (a?._id || a?.id) === (user?._id || user?.id));
  }, [user, event]);

  const isOrganizer = useMemo(() => {
    if (!user || !event?.organizer) return false;
    const organizerId = event.organizer?._id || event.organizer?.id || event.organizer;
    return organizerId === (user?._id || user?.id);
  }, [user, event]);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await eventService.getById(id);
        setEvent(res.data.event);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!user) return navigate('/login');
    setActionLoading(true);
    setError('');
    try {
      const res = await registrationService.register(id);
      setRegistration(res.data.registration);
      // Optimistic local update
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              registeredCount: (prev.registeredCount || 0) + 1,
              attendees: [...(prev.attendees || []), { _id: user._id, name: user.name }],
            }
          : prev
      );
      setShowModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    setActionLoading(true);
    setError('');
    try {
      await registrationService.unregister(id);
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              registeredCount: Math.max((prev.registeredCount || 1) - 1, 0),
              attendees: (prev.attendees || []).filter((a) => (a?._id || a?.id) !== (user?._id || user?.id)),
            }
          : prev
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Unregister failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading event...</div>;
  if (error) return (
    <div className="error-message" style={{ padding: '2rem', margin: '2rem' }}>
      {error}
    </div>
  );
  if (!event) return <div className="no-events" style={{ padding: '2rem', margin: '2rem' }}>Event not found</div>;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = event.time || eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const capacityPercentage = ((event.registeredCount || 0) / event.capacity) * 100;
  const isFull = event.registeredCount >= event.capacity;

  return (
    <div className="event-details">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back to Events
      </button>

      <div className="event-hero">
        <div className="event-hero-image">
          <img
            src={event.image || 'https://via.placeholder.com/480x350?text=Event+Image'}
            alt={event.title}
          />
        </div>
        
        <div className="event-hero-content">
          {event.category && (
            <div className="event-category-badge">{event.category}</div>
          )}
          
          <h1>{event.title}</h1>

          <div className="event-info-grid">
            <div className="event-info-item">
              <div>
                <strong>📅 Date</strong>
                <span>{formattedDate}</span>
              </div>
            </div>
            
            <div className="event-info-item">
              <div>
                <strong>� Time</strong>
                <span>{formattedTime}</span>
              </div>
            </div>
            
            <div className="event-info-item">
              <div>
                <strong>📍 Location</strong>
                <span>{event.location}</span>
              </div>
            </div>
            
            {event.price > 0 && (
              <div className="event-info-item">
                <div>
                  <strong>💳 Price</strong>
                  <span>${event.price}</span>
                </div>
              </div>
            )}
          </div>

          {event.tags?.length > 0 && (
            <div className="event-tags">
              {event.tags.map((tag, index) => (
                <span key={index} className="event-tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="event-capacity-bar">
            <div className="capacity-label">
              <span>👥 Attendees</span>
              <span><strong>{event.registeredCount || 0}</strong> / {event.capacity}</span>
            </div>
            <div className="capacity-progress">
              <div 
                className="capacity-fill" 
                style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
              />
            </div>
          </div>

          {isFull && <div className="event-full-badge">⚠️ This event is full</div>}

          {event.organizer && (
            <div className="event-organizer">
              <div className="event-organizer-avatar">
                {event.organizer.name?.[0]?.toUpperCase() || 'O'}
              </div>
              <div className="event-organizer-info">
                <h4>Organized by {event.organizer.name || 'Unknown'}</h4>
                {event.organizer.email && <p>{event.organizer.email}</p>}
              </div>
            </div>
          )}

          {!isOrganizer && (
            <div className="event-actions">
              {isRegistered ? (
                <button className="btn-secondary" onClick={handleUnregister} disabled={actionLoading}>
                  {actionLoading ? 'Unregistering...' : '✓ Registered - Click to Unregister'}
                </button>
              ) : (
                <button 
                  className="btn-primary" 
                  onClick={handleRegister} 
                  disabled={actionLoading || isFull}
                >
                  {actionLoading ? 'Processing...' : isFull ? '🚫 Event Full' : '🎟️ Register for Event'}
                </button>
              )}
            </div>
          )}

          {isOrganizer && (
            <div className="event-actions">
              <button className="btn-secondary" onClick={() => navigate(`/dashboard`)}>
                📊 Manage Event
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="event-description-section">
        <h2>About This Event</h2>
        <p>{event.description}</p>
      </div>

      <RegistrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        event={event}
        registration={registration}
      />
    </div>
  );
};
