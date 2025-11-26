require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const workshopController = require('./controllers/workshopController');
const contactController = require('./controllers/contactController');
const paymentController = require('./controllers/paymentController');
const donationController = require('./controllers/donationController');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const publicPath = path.join(__dirname, '../../public');

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://udeakucarespringsupportfoundation.org', 'https://www.udeakucarespringsupportfoundation.org'] 
  : ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:5001', 'http://127.0.0.1:5001'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security middleware with relaxed CSP for development
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://maps.googleapis.com https://www.youtube.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://api.udeakucarespringsupportfoundation.org http://localhost:5001; frame-src 'self' https://www.google.com https://maps.google.com https://www.youtube.com https://player.vimeo.com;"
  );
  next();
});

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Basic static file serving first
app.use(express.static(publicPath));

// API Routes
app.post('/api/register', workshopController.registerForWorkshop);
app.post('/api/contact', contactController.submitContact);
app.post('/api/send-partnership-email', contactController.sendPartnershipEmail);

// Payment Routes
app.post('/api/payment/initialize', paymentController.initializePayment);
app.get('/api/payment/verify/:reference', paymentController.verifyPayment);
app.post('/api/payment/webhook', paymentController.handleWebhook);

// Donation Routes (Admin)
app.get('/api/donations', donationController.getAllDonations);
app.get('/api/donations/:id', donationController.getDonationById);
app.post('/api/donations', donationController.createDonation);
app.patch('/api/donations/:id/status', donationController.updateDonationStatus);
app.get('/api/donations/stats', donationController.getDonationStats);
app.delete('/api/donations/:id', donationController.deleteDonation);

// Log all API requests
app.use('/api', (req, res, next) => {
  console.log(`🚨 API Request: ${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test route
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});