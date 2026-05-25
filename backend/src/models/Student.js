const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const mongoosePaginate = require('mongoose-paginate-v2');

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^[6-9]\d{9}$/, 'Invalid Indian mobile number'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
    },
    schoolName: { type: String, trim: true },
    class: {
      type: String,
      enum: ['1','2','3','4','5','6','7','8','9','10','11','12'],
      required: [true, 'Class is required'],
    },
    section: { type: String, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String },
    profilePhoto: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshToken: { type: String, select: false },
    registeredOlympiads: [
      {
        olympiad: { type: mongoose.Schema.Types.ObjectId, ref: 'Olympiad' },
        registeredAt: { type: Date, default: Date.now },
        paymentStatus: {
          type: String,
          enum: ['pending', 'paid', 'failed', 'free'],
          default: 'pending',
        },
        paymentId: String,
        hallTicket: {
          url: String,
          generatedAt: Date,
        },
        score: Number,
        rank: Number,
        percentile: Number,
        grade: String,
        certificate: {
          url: String,
          generatedAt: Date,
        },
        resultPublished: { type: Boolean, default: false },
      },
    ],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
studentSchema.index({ email: 1 });
studentSchema.index({ mobile: 1 });
studentSchema.index({ rollNumber: 1 });
studentSchema.index({ state: 1, city: 1 });
studentSchema.index({ class: 1 });
studentSchema.index({ createdAt: -1 });
studentSchema.index({ 'registeredOlympiads.olympiad': 1 });

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate roll number
studentSchema.pre('save', async function (next) {
  if (!this.rollNumber) {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await mongoose.model('Student').countDocuments();
    this.rollNumber = `BAIO${year}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

studentSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  return obj;
};

studentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Student', studentSchema);
