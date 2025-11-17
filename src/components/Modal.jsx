import '../styles/Modal.css';

export const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export const RegistrationModal = ({ isOpen, onClose, event, registration }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registration Successful!">
      <div className="registration-success">
        <div className="success-icon">✓</div>
        <h3>You're all set for {event?.title}!</h3>
        
        <div className="ticket-details">
          <div className="ticket-header">
            <span className="ticket-label">Your Ticket</span>
          </div>
          <div className="ticket-info">
            <p><strong>Event:</strong> {event?.title}</p>
            <p><strong>Date:</strong> {event?.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</p>
            <p><strong>Time:</strong> {event?.time}</p>
            <p><strong>Location:</strong> {event?.location}</p>
            <p><strong>Ticket Number:</strong> #{registration?.ticketNumber || 'Will be sent via email'}</p>
          </div>
        </div>

        <div className="next-steps">
          <h4>What's Next?</h4>
          <ul>
            <li>Check your email for confirmation</li>
            <li>Add the event to your calendar</li>
            <li>View your registrations in the Dashboard</li>
          </ul>
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </Modal>
  );
};
