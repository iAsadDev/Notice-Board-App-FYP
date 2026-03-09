import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Academic', 'Events', 'Urgent', 'General', 'Announcement'],
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please provide an expiry date'],
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'draft'],
    default: 'active',
  },
  views: {
    type: Number,
    default: 0,
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
  }],
});

// ✅ SIMPLE FIX: Remove pre-save hook completely
// We'll handle expiry in the API instead

export default mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);