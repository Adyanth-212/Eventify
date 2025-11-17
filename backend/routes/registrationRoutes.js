import express from 'express';
import {
  registerForEvent,
  unregisterFromEvent,
  getMyRegistrations,
  getEventRegistrations,
  getAllRegistrationsAdmin,
  deleteRegistrationAdmin
} from '../controllers/registrationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/:eventId', protect, registerForEvent);
router.delete('/:eventId', protect, unregisterFromEvent);
router.get('/my', protect, getMyRegistrations);
router.get('/event/:eventId', protect, getEventRegistrations);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllRegistrationsAdmin);
router.delete('/admin/:registrationId', protect, authorize('admin'), deleteRegistrationAdmin);

export default router;
