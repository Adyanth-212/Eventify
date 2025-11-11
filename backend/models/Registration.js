import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    },
    ticketNumber: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

// Ensure one user can only register once per event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
