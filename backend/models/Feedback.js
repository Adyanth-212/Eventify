import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add your email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      maxlength: 200
    },
    message: {
      type: String,
      required: [true, 'Please add your message'],
      maxlength: 5000
    },
    type: {
      type: String,
      enum: ['feedback', 'bug', 'suggestion', 'complaint'],
      default: 'feedback'
    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'resolved'],
      default: 'new'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', feedbackSchema);
