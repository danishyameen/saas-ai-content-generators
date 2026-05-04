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
const registerRoute = (name, path) => {
  try {
    const router = require(path);
    const r = (router && router.default) || router;
    if (typeof r === 'function') {
      app.use(name, r);
      console.log(`Route ${name} registered successfully.`);
    } else {
      console.error(`ERROR: Route ${name} from ${path} is not a function. Type: ${typeof r}`);
      // Mount a dummy route to avoid crash
      app.use(name, (req, res) => res.status(500).json({ success: false, message: 'Route load error' }));
    }
  } catch (err) {
    console.error(`CRITICAL: Failed to load route ${name} from ${path}:`, err.message);
  }
};

registerRoute('/api/auth', './routes/auth');
registerRoute('/api/ai', './routes/ai');
registerRoute('/api/payments', './routes/payments');
registerRoute('/api/admin', './routes/admin');
registerRoute('/api/affiliates', './routes/affiliates');
registerRoute('/api/whatsapp', './routes/whatsapp');

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
