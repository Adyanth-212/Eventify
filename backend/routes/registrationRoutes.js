import express from 'express';
import {
  registerForEvent,
  unregisterFromEvent,
  getMyRegistrations,
  getEventRegistrations
} from '../controllers/registrationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/:eventId', protect, registerForEvent);
router.delete('/:eventId', protect, unregisterFromEvent);
router.get('/my', protect, getMyRegistrations);
router.get('/event/:eventId', protect, getEventRegistrations);

export default router;
