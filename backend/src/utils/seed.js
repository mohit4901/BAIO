require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const CMS = require('../models/CMS');
const Olympiad = require('../models/Olympiad');
const Announcement = require('../models/Announcement');
const logger = require('./logger');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding...');

    // Seed Super Admin
    const existingAdmin = await Admin.findOne({ email: process.env.SUPER_ADMIN_EMAIL });
    if (!existingAdmin) {
      await Admin.create({
        fullName: 'Super Admin',
        email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@baio.in',
        password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@2024!',
        role: 'super_admin',
        permissions: {
          students: true, schools: true, olympiads: true, results: true,
          announcements: true, cms: true, admins: true, analytics: true,
        },
      });
      logger.info('✅ Super Admin seeded');
    }

    // Seed CMS FAQs
    const faqs = [
      { key: 'faq_1', type: 'faq', order: 1, question: 'What is Bharat AI Olympiad?', answer: 'BAIO is India\'s premier AI-focused olympiad platform for students in classes 1-12.' },
      { key: 'faq_2', type: 'faq', order: 2, question: 'Who can participate?', answer: 'Students from classes 1 to 12 from any recognized school across India.' },
      { key: 'faq_3', type: 'faq', order: 3, question: 'How to register?', answer: 'Click on Register, fill your details, select your olympiad, and submit.' },
      { key: 'faq_4', type: 'faq', order: 4, question: 'Are results available online?', answer: 'Yes! Results are published on our Result Search page. Search by roll number or email.' },
      { key: 'faq_5', type: 'faq', order: 5, question: 'Will I receive a certificate?', answer: 'Yes, all participants receive digital certificates and top rankers receive special awards.' },
    ];

    for (const faq of faqs) {
      await CMS.findOneAndUpdate({ key: faq.key }, faq, { upsert: true });
    }
    logger.info('✅ FAQs seeded');

    // Seed Stats
    const stats = [
      { key: 'stat_students', type: 'setting', title: 'Students Registered', value: '50,000+' },
      { key: 'stat_schools', type: 'setting', title: 'Partner Schools', value: '10,000+' },
      { key: 'stat_states', type: 'setting', title: 'States Covered', value: '28+' },
      { key: 'stat_olympiads', type: 'setting', title: 'Olympiads Conducted', value: '100+' },
    ];

    for (const stat of stats) {
      await CMS.findOneAndUpdate({ key: stat.key }, stat, { upsert: true });
    }
    logger.info('✅ Stats seeded');

    // Seed Sample Olympiad
    const existingOlympiad = await Olympiad.findOne({ slug: 'baio-ai-2024' });
    if (!existingOlympiad) {
      await Olympiad.create({
        title: 'BAIO AI Olympiad 2024',
        slug: 'baio-ai-2024',
        description: 'The flagship Bharat AI Olympiad testing knowledge of Artificial Intelligence, Machine Learning, and Data Science concepts for students across India.',
        shortDescription: 'India\'s premier AI olympiad for class 6-12 students',
        category: 'AI',
        examDate: new Date('2024-12-15'),
        registrationStartDate: new Date(),
        registrationLastDate: new Date('2024-11-30'),
        eligibility: { classes: ['6','7','8','9','10','11','12'], description: 'Open to all students in classes 6-12' },
        status: 'registration_open',
        isFeatured: true,
        isFree: true,
        level: 'national',
        prizes: [
          { rank: 1, prize: 'Gold Medal + Certificate + ₹10,000 Scholarship', amount: 10000 },
          { rank: 2, prize: 'Silver Medal + Certificate + ₹7,000 Scholarship', amount: 7000 },
          { rank: 3, prize: 'Bronze Medal + Certificate + ₹5,000 Scholarship', amount: 5000 },
        ],
        tags: ['AI', 'Machine Learning', 'Data Science', 'Coding'],
      });
      logger.info('✅ Sample Olympiad seeded');
    }

    // Seed Sample Announcement
    const existingAnn = await Announcement.findOne({ title: { $regex: 'Welcome', $options: 'i' } });
    if (!existingAnn) {
      const admin = await Admin.findOne({ role: 'super_admin' });
      await Announcement.create({
        title: 'Welcome to Bharat AI Olympiad 2024!',
        content: 'We are thrilled to announce the launch of BAIO 2024! Registrations are now open. Register today and be part of India\'s most prestigious AI olympiad.',
        type: 'announcement',
        priority: 'high',
        isPublished: true,
        publishedAt: new Date(),
        isPinned: true,
        createdBy: admin._id,
      });
      logger.info('✅ Sample Announcement seeded');
    }

    logger.info('🌱 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
