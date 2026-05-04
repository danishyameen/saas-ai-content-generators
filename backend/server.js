require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Initialize app
const app = express();

// Trust proxy for Vercel (required for express-rate-limit)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(cors({
  origin: '*', // Allow all origins to avoid Vercel CORS issues
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const loadRoute = (path, modulePath) => {
  try {
    const route = require(modulePath);
    if (typeof route === 'function') {
      app.use(path, route);
      console.log(`Route ${path} loaded successfully.`);
    } else if (route && typeof route.default === 'function') {
      app.use(path, route.default);
      console.log(`Route ${path} loaded via .default.`);
    } else {
      console.error(`ERROR: Route ${path} is not a function. Type: ${typeof route}. Keys: ${Object.keys(route || {})}`);
      const dummyRouter = express.Router();
      dummyRouter.all('*', (req, res) => res.status(500).json({ 
        success: false, 
        message: 'Route configuration error',
        debug: { path, type: typeof route }
      }));
      app.use(path, dummyRouter);
    }
  } catch (err) {
    console.error(`CRITICAL: Failed to load route ${path}:`, err.message);
  }
};

loadRoute('/api/auth', './routes/auth');
loadRoute('/api/ai', './routes/ai');
loadRoute('/api/payments', './routes/payments');
loadRoute('/api/admin', './routes/admin');
loadRoute('/api/affiliates', './routes/affiliates');
loadRoute('/api/whatsapp', './routes/whatsapp');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

// Vercel serverless export
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}
