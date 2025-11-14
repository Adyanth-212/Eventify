import { body, validationResult } from 'express-validator';

export const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name too long'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['attendee','organizer','admin']).withMessage('Invalid role')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required')
];

export const eventCreateValidation = [
  body('title').trim().notEmpty().withMessage('Title required').isLength({ max: 100 }).withMessage('Title too long'),
  body('description').trim().notEmpty().withMessage('Description required').isLength({ max: 2000 }).withMessage('Description too long'),
  body('category').optional().isIn(['conference','workshop','seminar','networking','concert','sports','other']).withMessage('Invalid category'),
  body('date').notEmpty().withMessage('Date required').isISO8601().withMessage('Date must be ISO8601'),
  body('time').notEmpty().withMessage('Time required'),
  body('location').trim().notEmpty().withMessage('Location required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be >= 1'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be >= 0'),
  body('tags').optional().isArray().withMessage('Tags must be array'),
];

export const eventUpdateValidation = [
  body('title').optional().isLength({ max: 100 }).withMessage('Title too long'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description too long'),
  body('category').optional().isIn(['conference','workshop','seminar','networking','concert','sports','other']).withMessage('Invalid category'),
  body('date').optional().isISO8601().withMessage('Date must be ISO8601'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be >= 1'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be >= 0'),
  body('tags').optional().isArray().withMessage('Tags must be array'),
];

export const profileUpdateValidation = [
  body('name').optional().isLength({ max: 50 }).withMessage('Name too long'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio too long'),
  body('phone').optional().isLength({ max: 20 }).withMessage('Phone too long'),
  body('profilePicture').optional().isURL().withMessage('profilePicture must be a valid URL'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation error', errors: errors.array() });
  }
  next();
};
