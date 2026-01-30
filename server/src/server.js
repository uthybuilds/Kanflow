const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const contactRoutes = require('./routes/contact');
const { verifyConnection } = require('./config/email');

// Initialize config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(morgan('dev')); // Logging

// Routes
app.use('/api', contactRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// Start Server
const startServer = async () => {
  // Verify SMTP before starting
  const isEmailServiceReady = await verifyConnection();
  if (!isEmailServiceReady) {
    console.warn('⚠️  Warning: Email service is not ready. Check credentials.');
  }

  app.listen(PORT, () => {
    console.log(`
🚀 Server is running on port ${PORT}
🌐 Client URL: ${process.env.CLIENT_URL}
📧 Email User: ${process.env.EMAIL_USER}
    `);
  });
};

startServer();
