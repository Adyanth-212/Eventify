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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [filter, category, currentPage]);

  // Separate useEffect for date changes to avoid too many API calls
  useEffect(() => {
    if (dateFrom || dateTo) {
      const timeout = setTimeout(() => {
        setCurrentPage(1);
        fetchEvents();
      }, 500); // Debounce date changes
      return () => clearTimeout(timeout);
    }
  }, [dateFrom, dateTo]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12 // Show 12 events per page
      };
      if (filter !== 'all') params.status = filter;
      if (category) params.category = category;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      
      const response = await eventService.getAll(params);
      setEvents(response.data.events || []);
      setTotalPages(response.data.pages || 1);
      setTotalEvents(response.data.total || 0);
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
      setCurrentPage(1);
      fetchEvents();
      return;
    }
    setLoading(true);
    try {
      const response = await eventService.search(search);
      setEvents(response.data.events || []);
      setCurrentPage(1);
      setTotalPages(1);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handleDateFilter = () => {
    setCurrentPage(1);
    fetchEvents();
  };

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setCategory('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            onClick={() => handleFilterChange('all')}
          >
            All Events
          </button>
          <button
            className={filter === 'upcoming' ? 'active' : ''}
            onClick={() => handleFilterChange('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={filter === 'past' ? 'active' : ''}
            onClick={() => handleFilterChange('past')}
          >
            Past Events
          </button>
        </div>

        <div className="advanced-filters">
          <div className="filter-group">
            <label htmlFor="category-filter" className="filter-label">📂 Category</label>
            <select 
              id="category-filter"
              value={category} 
              onChange={(e) => handleCategoryChange(e.target.value)}
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
          </div>

          <div className="date-filters">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Start Date"
              className="filter-input"
              title="Filter events from this date"
            />
            <span>to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="End Date"
              className="filter-input"
              title="Filter events until this date"
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
        <>
          <div className="events-header-info">
            <p>Showing {events.length} of {totalEvents} events</p>
          </div>
          <div className="events-grid">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRegister={handleViewEvent}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
