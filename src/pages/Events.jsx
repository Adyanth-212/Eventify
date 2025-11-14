import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { eventService } from '../services/api';
import '../styles/Events.css';

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [category, setCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [filter, category]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (category) params.category = category;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      
      const response = await eventService.getAll(params);
      setEvents(response.data.events || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      fetchEvents();
      return;
    }
    setLoading(true);
    try {
      const response = await eventService.search(search);
      setEvents(response.data.events || []);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Discover Events</h1>
        <p>Find and join amazing events in your area</p>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search events by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div className="filters-section">
        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Events
          </button>
          <button
            className={filter === 'upcoming' ? 'active' : ''}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={filter === 'past' ? 'active' : ''}
            onClick={() => setFilter('past')}
          >
            Past Events
          </button>
        </div>

        <div className="advanced-filters">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="networking">Networking</option>
            <option value="concert">Concert</option>
            <option value="sports">Sports</option>
            <option value="other">Other</option>
          </select>

          <div className="date-filters">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From"
              className="filter-input"
            />
            <span>to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To"
              className="filter-input"
            />
            <button 
              type="button" 
              onClick={fetchEvents}
              className="btn-secondary"
            >
              Apply
            </button>
            {(dateFrom || dateTo || category) && (
              <button 
                type="button" 
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setCategory('');
                  fetchEvents();
                }}
                className="btn-secondary"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="no-events">No events found</div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onRegister={handleViewEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
};
