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
  origin: '*', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection helper
const startDB = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Initial DB Connection Error:', err.message);
  }
};
startDB();

// Routes
const authRouter = require('./routes/auth');
const aiRouter = require('./routes/ai');
const paymentsRouter = require('./routes/payments');
const adminRouter = require('./routes/admin');
const affiliatesRouter = require('./routes/affiliates');
const whatsappRouter = require('./routes/whatsapp');

const safeUse = (path, router) => {
  const r = (router && router.default) || router;
  if (typeof r === 'function') {
    app.use(path, r);
  } else {
    console.error(`ERROR: Route ${path} failed to load as a function. Type: ${typeof r}`);
    app.use(path, (req, res) => res.status(500).json({ success: false, message: 'Route configuration error' }));
  }
};

safeUse('/api/auth', authRouter);
safeUse('/api/ai', aiRouter);
safeUse('/api/payments', paymentsRouter);
safeUse('/api/admin', adminRouter);
safeUse('/api/affiliates', affiliatesRouter);
safeUse('/api/whatsapp', whatsappRouter);

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
