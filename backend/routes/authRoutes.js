import express from 'express';
import { 
  signup, 
  login, 
  getMe, 
  updateProfile, 
  changePassword,
  getAllUsersAdmin,
  updateUserRoleAdmin,
  deleteUserAdmin 
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// Admin routes
router.get('/admin/users', protect, authorize('admin'), getAllUsersAdmin);
router.put('/admin/users/:userId/role', protect, authorize('admin'), updateUserRoleAdmin);
router.delete('/admin/users/:userId', protect, authorize('admin'), deleteUserAdmin);

export default router;
