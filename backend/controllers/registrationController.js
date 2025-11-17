import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

export const registerForEvent = async (req, res, next) => {
  try{
    const { eventId } = req.params;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if event is in the past
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    if (eventDate < today) {
      return res.status(400).json({ success: false, message: 'Cannot register for past events' });
    }

    // Check if user already registered
    const existingRegistration = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event' });
    }

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    // Create registration
    const ticketNumber = `TKT-${eventId.slice(-6)}-${req.user.id.slice(-6)}-${Date.now()}`;

    const registration = new Registration({
      user: req.user.id,
      event: eventId,
      ticketNumber
    });

    await registration.save();

    // Update event
    await Event.findByIdAndUpdate(eventId, {
      $inc: { registeredCount: 1 },
      $push: { attendees: req.user.id }
    });

    // Update user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { eventsRegistered: eventId }
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      registration
    });
  } catch (error) {
    next(error);
  }
};

export const unregisterFromEvent = async (req, res, next) => {
  
  try {
    const { eventId } = req.params;

    // Check if registration exists
    const registration = await Registration.findOne({
      user: req.user.id,
      event: eventId
    });

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    await Registration.findByIdAndDelete(registration._id);

    // Update event
    await Event.findByIdAndUpdate(eventId, {
      $inc: { registeredCount: -1 },
      $pull: { attendees: req.user.id }
    });

    // Update user
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { eventsRegistered: eventId }
    });

    return res.status(200).json({
      success: true,
      message: 'Unregistered successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRegistrations = async (req, res, next) => {
  
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate({
        path: 'event',
        select: 'title description date location image capacity registeredCount'
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      registrations
    });
  } catch (error) {
    next(error);
  }
};

export const getEventRegistrations = async (req, res, next) => {
  
  try {
    const { eventId } = req.params;

    // Check if user is organizer
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate('user', 'name email phone profilePicture')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      registrations
    });
  } catch (error) {
    next(error);
  }
};
