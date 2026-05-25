const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'content_admin', 'result_admin'],
      default: 'admin',
    },
    permissions: {
      students: { type: Boolean, default: false },
      schools: { type: Boolean, default: false },
      olympiads: { type: Boolean, default: false },
      results: { type: Boolean, default: false },
      announcements: { type: Boolean, default: false },
      cms: { type: Boolean, default: false },
      admins: { type: Boolean, default: false },
      analytics: { type: Boolean, default: false },
    },
    profilePhoto: {
      url: { type: String, default: '' },
      publicId: String,
    },
    phone: String,
    department: String,
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    lastLoginIp: String,
    refreshToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);

  // Set default permissions based on role
  if (this.role === 'super_admin') {
    Object.keys(this.permissions).forEach((k) => (this.permissions[k] = true));
  } else if (this.role === 'content_admin') {
    this.permissions.cms = true;
    this.permissions.announcements = true;
    this.permissions.olympiads = true;
  } else if (this.role === 'result_admin') {
    this.permissions.results = true;
    this.permissions.students = true;
  }
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
