import { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import { EventForm } from './EventForm';
import { useAuth } from '../utils/useAuth';
import '../styles/MyEvents.css';

export const MyEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await eventService.getMyEvents();
      setEvents(res.data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventService.delete(eventId);
      setEvents(prev => prev.filter(e => e._id !== eventId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleUpdateSuccess = (updatedEvent) => {
    setEvents(prev => prev.map(e => e._id === updatedEvent._id ? updatedEvent : e));
    setEditingEvent(null);
    setShowForm(false);
    alert('Event updated successfully!');
  };

  if (loading) return <div className="loading">Loading your events...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="my-events-container">
      <div className="my-events-header">
        <h2>My Events</h2>
        <button 
          className="btn-primary" 
          onClick={() => {
            setEditingEvent(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? '✕ Cancel' : '+ Create New Event'}
        </button>
      </div>

      {showForm && (
        <div className="event-form-container">
          <EventForm
            initialValues={editingEvent}
            onSuccess={(event) => {
              if (editingEvent) {
                handleUpdateSuccess(event);
              } else {
                setEvents(prev => [event, ...prev]);
                setShowForm(false);
                alert(`Event "${event.title}" created successfully!`);
              }
            }}
          />
        </div>
      )}

      {events.length === 0 ? (
        <div className="no-events">
          <p>You haven't created any events yet.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <img 
                src={event.image || 'https://via.placeholder.com/400x200'} 
                alt={event.title}
                className="event-image"
              />
              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-date">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </p>
                <p className="event-location">{event.location}</p>
                <p className="event-capacity">
                  👥 {event.registeredCount || 0} / {event.capacity} registered
                </p>
                <div className="event-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleEdit(event)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
