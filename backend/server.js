
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const logger = require('./middleware/logger');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 3. Limit Request Body Size
app.use(express.json({ limit: '10kb' }));
const containsUnsafeKeys = (value) => {
  if (!value || typeof value !== 'object') return false;

  return Object.entries(value).some(([key, val]) =>
    key.startsWith('$') ||
    key.includes('.') ||
    containsUnsafeKeys(val)
  );
};

app.use((req, res, next) => {
  if (
    containsUnsafeKeys(req.body) ||
    containsUnsafeKeys(req.query) ||
    containsUnsafeKeys(req.params)
  ) {
    return res.status(400).json({
      message: 'Invalid request data'
    });
  }

  next();
});



// 4. Request Logger
app.use(logger);

// 6-1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// 7-1. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);

// 8-1. Health Check
app.get('/', (req, res) => {
  res.send('TechFest 2026 Backend API is running...');
});

// 9-1. 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// 10-1. Central Error Handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({
    message: err.status ? err.message : 'Internal Server Error'
  });
});

// 11-1. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
