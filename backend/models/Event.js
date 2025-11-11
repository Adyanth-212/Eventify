import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: 2000
    },
    category: {
      type: String,
      enum: ['conference', 'workshop', 'seminar', 'networking', 'concert', 'sports', 'other'],
      default: 'other'
    },
    image: {
      type: String,
      default: null
    },
    date: {
      type: Date,
      required: [true, 'Please add an event date']
    },
    time: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: [true, 'Please add a location']
    },
    latitude: Number,
    longitude: Number,
    capacity: {
      type: Number,
      required: [true, 'Please add capacity'],
      min: 1
    },
    registeredCount: {
      type: Number,
      default: 0
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    },
    price: {
      type: Number,
      default: 0
    },
    tags: [String],
    requirements: String
  },
  { timestamps: true }
);

// Index for search
eventSchema.index({ title: 'text', description: 'text', category: 1, status: 1 });

export default mongoose.model('Event', eventSchema);
