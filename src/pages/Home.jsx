import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Eventify</h1>
          <p>Discover, register, and manage events effortlessly</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/events')}>
              Explore Events
            </button>
            <button className="btn-secondary" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Eventify?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">Events</span>
            <h3>Discover Events</h3>
            <p>Find events in your area, filter by date, location, and category</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Register</span>
            <h3>Easy Registration</h3>
            <p>Register for events with just a few clicks</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Organize</span>
            <h3>Create Events</h3>
            <p>Organize and manage your own events easily</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">Notify</span>
            <h3>Stay Updated</h3>
            <p>Get notifications about your registered events</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to start?</h2>
        <p>Join thousands of event enthusiasts on Eventify</p>
        <button className="btn-primary" onClick={() => navigate('/signup')}>
          Sign Up Now
        </button>
      </section>
    </div>
  );
};
