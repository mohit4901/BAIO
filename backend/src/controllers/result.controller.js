const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Result = require('../models/Result');
const Student = require('../models/Student');
const { successResponse, paginatedResponse } = require('../utils/responseHelper');
const csv = require('fast-csv');
const fs = require('fs');

// @desc    Get results by roll number or email (public)
// @route   GET /api/v1/results/search
// @access  Public
exports.searchResult = catchAsync(async (req, res, next) => {
  const { rollNumber, email, olympiadId } = req.query;

  if (!rollNumber && !email) {
    return next(new AppError('Please provide roll number or email.', 400));
  }

  let studentQuery = {};
  if (rollNumber) studentQuery.rollNumber = rollNumber.toUpperCase();
  if (email) studentQuery.email = email.toLowerCase();

  const student = await Student.findOne(studentQuery).select('_id fullName rollNumber email class schoolName state');
  if (!student) return next(new AppError('Student not found. Please check your credentials.', 404));

  const resultQuery = { student: student._id, isPublished: true };
  if (olympiadId) resultQuery.olympiad = olympiadId;

  const results = await Result.find(resultQuery)
    .populate('olympiad', 'title slug category examDate')
    .sort('-createdAt');

  if (!results.length) return next(new AppError('No published results found.', 404));

  successResponse(res, 'Results fetched.', { student, results });
});

// @desc    Get all results (admin)
// @route   GET /api/v1/results
// @access  Admin
exports.getAllResults = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, olympiad, state, isPublished, search, sort = '-createdAt' } = req.query;

  const query = {};
  if (olympiad) query.olympiad = olympiad;
  if (state) query.state = state;
  if (isPublished !== undefined) query.isPublished = isPublished === 'true';
  if (search) {
    query.$or = [
      { rollNumber: { $regex: search, $options: 'i' } },
      { studentName: { $regex: search, $options: 'i' } },
    ];
  }

  const options = {
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 100),
    sort,
    populate: [
      { path: 'student', select: 'fullName rollNumber email class' },
      { path: 'olympiad', select: 'title slug' },
    ],
  };

  const Result = require('../models/Result');
  const mongoosePaginate = require('mongoose-paginate-v2');
  Result.paginate = mongoosePaginate;

  const results = await Result.find(query)
    .populate('student', 'fullName rollNumber email class')
    .populate('olympiad', 'title slug')
    .sort(sort)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await Result.countDocuments(query);

  paginatedResponse(res, 'Results fetched.', results, {
    totalDocs: total, page: parseInt(page), limit: parseInt(limit),
    totalPages: Math.ceil(total / parseInt(limit)),
    hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
    hasPrevPage: parseInt(page) > 1,
  });
});

// @desc    Create single result
// @route   POST /api/v1/results
// @access  Result Admin
exports.createResult = catchAsync(async (req, res, next) => {
  const { studentId, olympiadId, obtainedMarks, totalMarks, rank, grade } = req.body;

  const student = await Student.findById(studentId).select('fullName rollNumber class schoolName state');
  if (!student) return next(new AppError('Student not found.', 404));

  const existing = await Result.findOne({ student: studentId, olympiad: olympiadId });
  if (existing) return next(new AppError('Result for this student and olympiad already exists.', 409));

  const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(2) : 0;
  const result = await Result.create({
    student: studentId,
    olympiad: olympiadId,
    rollNumber: student.rollNumber,
    studentName: student.fullName,
    schoolName: student.schoolName,
    class: student.class,
    state: student.state,
    obtainedMarks,
    totalMarks,
    percentage,
    rank,
    grade,
    uploadedBy: req.user._id,
  });

  successResponse(res, 'Result created.', { result }, 201);
});

// @desc    Bulk upload results from CSV
// @route   POST /api/v1/results/bulk-upload
// @access  Result Admin
exports.bulkUploadResults = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('Please upload a CSV file.', 400));
  const { olympiadId } = req.body;
  if (!olympiadId) return next(new AppError('Olympiad ID is required.', 400));

  const results = [];
  const errors = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: true, trim: true }))
      .on('data', (row) => results.push(row))
      .on('error', reject)
      .on('end', resolve);
  });

  let inserted = 0;
  for (const row of results) {
    try {
      const student = await Student.findOne({ rollNumber: row.rollNumber?.toUpperCase() });
      if (!student) { errors.push({ rollNumber: row.rollNumber, error: 'Student not found' }); continue; }

      await Result.findOneAndUpdate(
        { student: student._id, olympiad: olympiadId },
        {
          student: student._id, olympiad: olympiadId,
          rollNumber: student.rollNumber, studentName: student.fullName,
          schoolName: student.schoolName, class: student.class, state: student.state,
          obtainedMarks: parseFloat(row.obtainedMarks || 0),
          totalMarks: parseFloat(row.totalMarks || 100),
          percentage: parseFloat(row.percentage || 0),
          rank: parseInt(row.rank || 0),
          grade: row.grade,
          uploadedBy: req.user._id,
        },
        { upsert: true, new: true }
      );
      inserted++;
    } catch (err) {
      errors.push({ rollNumber: row.rollNumber, error: err.message });
    }
  }

  fs.unlinkSync(req.file.path);
  successResponse(res, `Bulk upload complete. ${inserted} results processed.`, { inserted, errors: errors.slice(0, 50) });
});

// @desc    Publish results
// @route   PATCH /api/v1/results/publish/:olympiadId
// @access  Result Admin
exports.publishResults = catchAsync(async (req, res, next) => {
  const result = await Result.updateMany(
    { olympiad: req.params.olympiadId, isPublished: false },
    { isPublished: true, publishedAt: new Date() }
  );

  const emailService = require('../services/email.service');
  // Async email notifications (don't await)
  Result.find({ olympiad: req.params.olympiadId, isPublished: true })
    .populate('student', 'fullName email rollNumber')
    .populate('olympiad', 'title')
    .limit(1000)
    .then((results) => {
      results.forEach((r) => {
        if (r.student?.email) {
          emailService.sendResultNotification(r.student, r.olympiad?.title, r.rank).catch(() => {});
        }
      });
    });

  successResponse(res, `${result.modifiedCount} results published.`);
});
