import express from 'express';
import {
  getAllEvents,
  getEventById,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
  getAllEventsAdmin
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/search', searchEvents);
router.get('/my-events', protect, authorize('organizer', 'admin'), getMyEvents);
router.get('/admin/all', protect, authorize('admin'), getAllEventsAdmin);
router.get('/:id', getEventById);
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

export default router;
