import { useEffect, useState } from 'react';
import { eventService } from '../services/api';
import '../styles/EventCard.css';

export const EventCard = ({ event, onRegister }) => {
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="event-card">
      <div className="event-image">
        <img src={event.image || 'https://via.placeholder.com/300x200'} alt={event.title} />
      </div>
      <div className="event-content">
        <h3>{event.title}</h3>
        <p className="event-date">📅 {eventDate}</p>
        <p className="event-location">📍 {event.location}</p>
        <p className="event-description">{event.description?.substring(0, 100)}...</p>
        <div className="event-footer">
          <span className="event-capacity">{event.registeredCount || 0} / {event.capacity} attending</span>
          <button 
            className="btn-primary" 
            onClick={() => onRegister(event._id)}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};
