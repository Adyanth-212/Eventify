import express from 'express';
import { upload, uploadToCloudinary } from '../config/cloudinary.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Upload single image
router.post('/image', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'eventify/events');

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image'
    });
  }
});

// Upload profile picture
router.post('/profile', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file provided' 
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'eventify/profiles');

    return res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload profile picture'
    });
  }
});

export default router;
