import Feedback from '../models/Feedback.js';

export const submitFeedback = async (req, res, next) => {
  
  try {
    const { name, email, subject, message, type } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const feedback = new Feedback({
      name,
      email,
      subject,
      message,
      type: type || 'feedback'
    });

    await feedback.save();

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFeedback = async (req, res, next) => {
  
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      feedback
    });
  } catch (error) {
    next(error);
  }
};

export const updateFeedbackStatus = async (req, res, next) => {
  
  try {
    const { status } = req.body;

    if (!['new', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback updated',
      feedback
    });
  } catch (error) {
    next(error);
  }
};
