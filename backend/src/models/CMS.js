const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['banner', 'text', 'faq', 'testimonial', 'sponsor', 'gallery', 'page', 'setting'],
      required: true,
    },
    title: String,
    subtitle: String,
    content: String,
    richContent: String,
    image: {
      url: String,
      publicId: String,
      alt: String,
    },
    link: String,
    linkText: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    // For FAQs
    question: String,
    answer: String,
    // For Testimonials
    author: String,
    designation: String,
    rating: { type: Number, min: 1, max: 5 },
    // For sponsors
    logoUrl: String,
    websiteUrl: String,
    // For gallery
    images: [
      {
        url: String,
        publicId: String,
        caption: String,
        order: Number,
      },
    ],
    // For settings
    value: mongoose.Schema.Types.Mixed,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

cmsSchema.index({ key: 1 });
cmsSchema.index({ type: 1, isActive: 1 });
cmsSchema.index({ type: 1, order: 1 });

module.exports = mongoose.model('CMS', cmsSchema);
