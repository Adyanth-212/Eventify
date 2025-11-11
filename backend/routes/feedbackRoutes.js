import express from 'express';
import {
  submitFeedback,
  getAllFeedback,
  updateFeedbackStatus
} from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitFeedback);
router.get('/', protect, authorize('admin'), getAllFeedback);
router.put('/:id', protect, authorize('admin'), updateFeedbackStatus);

export default router;
