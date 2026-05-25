const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    olympiad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Olympiad',
      required: true,
    },
    rollNumber: { type: String, required: true },
    studentName: String,
    schoolName: String,
    class: String,
    state: String,
    totalMarks: { type: Number, default: 0 },
    obtainedMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    rank: { type: Number },
    nationalRank: Number,
    stateRank: Number,
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'],
    },
    percentile: Number,
    sectionWiseMarks: [
      {
        section: String,
        totalMarks: Number,
        obtainedMarks: Number,
      },
    ],
    certificate: {
      url: String,
      publicId: String,
      generatedAt: Date,
    },
    hallTicket: {
      url: String,
      publicId: String,
    },
    isPublished: { type: Boolean, default: false },
    publishedAt: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    remarks: String,
  },
  { timestamps: true }
);

// Compound unique index
resultSchema.index({ student: 1, olympiad: 1 }, { unique: true });
resultSchema.index({ rollNumber: 1 });
resultSchema.index({ olympiad: 1, rank: 1 });
resultSchema.index({ olympiad: 1, isPublished: 1 });
resultSchema.index({ state: 1, olympiad: 1 });

module.exports = mongoose.model('Result', resultSchema);
