require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const connectDB = require('./src/config/database');
const swaggerSpec = require('./src/config/swagger');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middlewares/error.middleware');
const AppError = require('./src/utils/AppError');

// Route imports
const authRoutes = require('./src/routes/auth.routes');
const studentRoutes = require('./src/routes/student.routes');
const schoolRoutes = require('./src/routes/school.routes');
const olympiadRoutes = require('./src/routes/olympiad.routes');
const resultRoutes = require('./src/routes/result.routes');
const announcementRoutes = require('./src/routes/announcement.routes');
const cmsRoutes = require('./src/routes/cms.routes');
const adminRoutes = require('./src/routes/admin.routes');

const app = express();

// ============ SECURITY MIDDLEWARE ============
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.ADMIN_URL || 'http://localhost:5174',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || 100),
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.startsWith('/api/v1/cms') && req.method === 'GET',
});
app.use('/api/', globalLimiter);

// ============ CORE MIDDLEWARE ============
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(mongoSanitize());

// HTTP Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: (msg) => logger.http(msg.trim()) } }));
}

// Uploads static
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// ============ API DOCS ============
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: 'BAIO API Docs',
  customCss: '.swagger-ui .topbar { background-color: #001F5E; }',
}));

// ============ ROUTES ============
const API_PREFIX = `/api/${process.env.API_VERSION || 'v1'}`;

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🏆 Bharat AI Olympiad API - Enterprise Grade',
    version: process.env.API_VERSION || 'v1',
    docs: `/api-docs`,
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/students`, studentRoutes);
app.use(`${API_PREFIX}/schools`, schoolRoutes);
app.use(`${API_PREFIX}/olympiads`, olympiadRoutes);
app.use(`${API_PREFIX}/results`, resultRoutes);
app.use(`${API_PREFIX}/announcements`, announcementRoutes);
app.use(`${API_PREFIX}/cms`, cmsRoutes);
app.use(`${API_PREFIX}/admins`, adminRoutes);

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found.`, 404));
});

// Global error handler
app.use(errorHandler);

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      logger.info(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      logger.info(`🔗 API Base: http://localhost:${PORT}/api/v1`);
    });

    // Graceful shutdown
    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err) => {
      logger.error(`Uncaught Exception: ${err.message}`);
      process.exit(1);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
