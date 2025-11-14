import { useState } from 'react';
import { eventService } from '../services/api';
import { useAuth } from '../utils/useAuth';
import '../styles/EventForm.css';

// Simple reusable EventForm (create mode); can be extended for edit by passing initialValues and onSuccess
export const EventForm = ({ initialValues = null, onSuccess }) => {
  const { user } = useAuth();
  const isEdit = !!initialValues;
  const [form, setForm] = useState(initialValues || {
    title: '',
    description: '',
    category: 'other',
    date: '',
    time: '',
    location: '',
    capacity: 1,
    price: 0,
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || (user.role !== 'organizer' && user.role !== 'admin')) {
    return <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: 8 }}>You must be an organizer to create events.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
        price: Number(form.price),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };
      let res;
      if (isEdit) {
        res = await eventService.update(initialValues._id, payload);
      } else {
        res = await eventService.create(payload);
      }
      if (onSuccess) onSuccess(res.data.event);
      if (!isEdit) {
        setForm({ title: '', description: '', category: 'other', date: '', time: '', location: '', capacity: 1, price: 0, tags: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h3>{isEdit ? 'Edit Event' : 'Create Event'}</h3>
      {error && <div className="error-message">{error}</div>}
      <label>
        Title
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>
      <label>
        Description
        <textarea name="description" value={form.description} onChange={handleChange} required rows={4} />
      </label>
      <label>
        Category
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="conference">Conference</option>
          <option value="workshop">Workshop</option>
          <option value="seminar">Seminar</option>
          <option value="networking">Networking</option>
          <option value="concert">Concert</option>
          <option value="sports">Sports</option>
          <option value="other">Other</option>
        </select>
      </label>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <label style={{ flex: 1 }}>
          Date
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>
        <label style={{ flex: 1 }}>
          Time
          <input type="time" name="time" value={form.time} onChange={handleChange} required />
        </label>
      </div>
      <label>
        Location
        <input name="location" value={form.location} onChange={handleChange} required />
      </label>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <label style={{ flex: 1 }}>
          Capacity
          <input type="number" min={1} name="capacity" value={form.capacity} onChange={handleChange} required />
        </label>
        <label style={{ flex: 1 }}>
          Price
          <input type="number" min={0} name="price" value={form.price} onChange={handleChange} />
        </label>
      </div>
      <label>
        Tags (comma-separated)
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. react,javascript" />
      </label>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Event')}
      </button>
    </form>
  );
};
