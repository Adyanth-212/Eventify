import Event from '../models/Event.js';
import User from '../models/User.js';

export const getAllEvents = async (req, res, next) => {
  
  try {
    const { status, category, page = 1, limit = 12, dateFrom, dateTo } = req.query;
    const filter = {};

    // Handle date-based filtering for upcoming/past events
    if (status) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      
      if (status === 'upcoming') {
        filter.date = { $gte: today };
      } else if (status === 'past') {
        filter.date = { $lt: today };
      }
    }

    // Handle custom date range filtering (overrides status-based filtering)
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) {
        filter.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999); // End of the day
        filter.date.$lte = endDate;
      }
    }

    if (category && ['conference', 'workshop', 'seminar', 'networking', 'concert', 'sports', 'other'].includes(category)) {
      filter.category = category;
    }

    const skip = (page - 1) * limit;
    const events = await Event.find(filter)
      .populate('organizer', 'name email profilePicture')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await Event.countDocuments(filter);

    return res.status(200).json({
      success: true,
      events,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email profilePicture bio phone')
      .populate('attendees', 'name email profilePicture');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    return res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  
  try {
    const { title, description, category, date, time, location, capacity, price, tags, image } = req.body;

    if (!title || !description || !date || !time || !location || !capacity) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const event = new Event({
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      price,
      tags,
      image,
      organizer: req.user.id
    });

    await event.save();

    // Add event to user's eventsCreated
    await User.findByIdAndUpdate(req.user.id, {
      $push: { eventsCreated: event._id }
    });

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if user is organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check if user is organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Remove from user's eventsCreated
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { eventsCreated: req.params.id }
    });

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const searchEvents = async (req, res, next) => {
  
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Please provide search query' });
    }

    const events = await Event.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('organizer', 'name email profilePicture');

    return res.status(200).json({
      success: true,
      events
    });
  } catch (error) {
    next(error);
  }
};
