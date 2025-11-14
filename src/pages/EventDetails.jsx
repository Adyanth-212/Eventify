import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../utils/useAuth';

export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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
      await registrationService.register(id);
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
    <div className="error-message" style={{ padding: '1rem' }}>
      {error}
    </div>
  );
  if (!event) return <div className="no-events">Event not found</div>;

  const eventDate = new Date(event.date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="event-details" style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <button onClick={() => navigate(-1)} className="btn-secondary" style={{ marginBottom: '1rem' }}>
        ← Back
      </button>

      <div className="event-hero" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <img
          src={event.image || 'https://via.placeholder.com/480x300'}
          alt={event.title}
          style={{ width: '100%', maxWidth: 480, borderRadius: 12 }}
        />
        <div style={{ flex: 1, minWidth: 280 }}>
          <h1 style={{ marginTop: 0 }}>{event.title}</h1>
          <p><strong>📅 Date:</strong> {eventDate}</p>
          <p><strong>📍 Location:</strong> {event.location}</p>
          {event.price > 0 && <p><strong>💳 Price:</strong> ${event.price}</p>}
          <p><strong>👥 Capacity:</strong> {event.registeredCount || 0} / {event.capacity}</p>
          {event.tags?.length > 0 && (
            <p><strong>🏷️ Tags:</strong> {event.tags.join(', ')}</p>
          )}
          {event.organizer && (
            <p>
              <strong>🎤 Organizer:</strong> {event.organizer.name || 'Unknown'}
            </p>
          )}

          {!isOrganizer && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              {isRegistered ? (
                <button className="btn-secondary" onClick={handleUnregister} disabled={actionLoading}>
                  {actionLoading ? 'Unregistering...' : 'Unregister'}
                </button>
              ) : (
                <button className="btn-primary" onClick={handleRegister} disabled={actionLoading || (event.registeredCount >= event.capacity)}>
                  {actionLoading ? 'Registering...' : (event.registeredCount >= event.capacity ? 'Event Full' : 'Register')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <section style={{ marginTop: '1.5rem' }}>
        <h2>About this event</h2>
        <p style={{ lineHeight: 1.6 }}>{event.description}</p>
      </section>
    </div>
  );
};
