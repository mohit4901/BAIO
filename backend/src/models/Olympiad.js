const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const slugify = require('slugify');

const olympiadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Olympiad title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      enum: ['AI', 'Science', 'Mathematics', 'Technology', 'Coding', 'Robotics', 'General'],
      required: [true, 'Category is required'],
    },
    examDate: {
      type: Date,
      required: [true, 'Exam date is required'],
    },
    examTime: String,
    resultDate: Date,
    registrationStartDate: { type: Date, default: Date.now },
    registrationLastDate: {
      type: Date,
      required: [true, 'Registration last date is required'],
    },
    eligibility: {
      classes: [String],
      minAge: Number,
      maxAge: Number,
      description: String,
    },
    syllabus: {
      url: String,
      publicId: String,
    },
    samplePapers: [
      {
        title: String,
        url: String,
        publicId: String,
      },
    ],
    instructions: {
      type: String,
    },
    bannerImage: {
      url: String,
      publicId: String,
    },
    thumbnailImage: {
      url: String,
      publicId: String,
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    isFree: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['draft', 'upcoming', 'registration_open', 'registration_closed', 'ongoing', 'completed', 'cancelled'],
      default: 'draft',
    },
    isFeatured: { type: Boolean, default: false },
    totalRegistrations: { type: Number, default: 0 },
    maxParticipants: Number,
    level: {
      type: String,
      enum: ['national', 'state', 'district', 'school'],
      default: 'national',
    },
    prizes: [
      {
        rank: Number,
        prize: String,
        amount: Number,
      },
    ],
    coordinators: [String],
    tags: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
olympiadSchema.index({ slug: 1 });
olympiadSchema.index({ status: 1 });
olympiadSchema.index({ category: 1 });
olympiadSchema.index({ isFeatured: 1 });
olympiadSchema.index({ examDate: 1 });
olympiadSchema.index({ registrationLastDate: 1 });
olympiadSchema.index({ createdAt: -1 });

// Generate slug
olympiadSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

olympiadSchema.virtual('isRegistrationOpen').get(function () {
  const now = new Date();
  return (
    this.status === 'registration_open' &&
    now >= this.registrationStartDate &&
    now <= this.registrationLastDate
  );
});

olympiadSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Olympiad', olympiadSchema);
