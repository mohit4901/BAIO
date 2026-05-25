const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    type: {
      type: String,
      enum: ['announcement', 'notice', 'alert', 'update', 'result', 'event'],
      default: 'announcement',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    attachments: [
      {
        name: String,
        url: String,
        publicId: String,
        fileType: String,
      },
    ],
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'schools', 'admins'],
      default: 'all',
    },
    olympiad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Olympiad',
    },
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
    expiresAt: Date,
    isPinned: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

announcementSchema.index({ isPublished: 1, createdAt: -1 });
announcementSchema.index({ type: 1 });
announcementSchema.index({ priority: 1 });
announcementSchema.index({ isPinned: -1, createdAt: -1 });

announcementSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Announcement', announcementSchema);
