const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schoolSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
      maxlength: [200, 'School name cannot exceed 200 characters'],
    },
    principalName: {
      type: String,
      required: [true, 'Principal name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      match: [/^[6-9]\d{9}$/, 'Invalid Indian mobile number'],
    },
    alternatePhone: String,
    board: {
      type: String,
      enum: ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Other'],
      required: [true, 'Board is required'],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: String,
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    numberOfStudents: {
      type: Number,
      default: 0,
    },
    schoolCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    udiseCode: String,
    affiliationNumber: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'suspended'],
      default: 'pending',
    },
    verificationNote: String,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    verifiedAt: Date,
    logo: {
      url: String,
      publicId: String,
    },
    documents: [
      {
        name: String,
        url: String,
        publicId: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    registeredStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    isActive: { type: Boolean, default: true },
    coordinatorName: String,
    coordinatorPhone: String,
    coordinatorEmail: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
schoolSchema.index({ email: 1 });
schoolSchema.index({ schoolCode: 1 });
schoolSchema.index({ verificationStatus: 1 });
schoolSchema.index({ 'address.state': 1, 'address.city': 1 });
schoolSchema.index({ board: 1 });
schoolSchema.index({ createdAt: -1 });

// Auto-generate school code
schoolSchema.pre('save', async function (next) {
  if (!this.schoolCode) {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await mongoose.model('School').countDocuments();
    const stateCode = this.address.state.slice(0, 2).toUpperCase();
    this.schoolCode = `SCH${stateCode}${year}${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

schoolSchema.virtual('studentCount').get(function () {
  return this.registeredStudents ? this.registeredStudents.length : 0;
});

schoolSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('School', schoolSchema);
