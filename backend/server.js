require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', methods: ['GET','POST','PUT','DELETE'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/notices',       require('./routes/notices'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/faculty',       require('./routes/faculty'));
app.use('/api/gallery',       require('./routes/gallery'));
app.use('/api/homepage',      require('./routes/homepage'));
app.use('/api/contact',       require('./routes/contact'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/quickaccess',   require('./routes/quickAccess'));
app.use('/api/portal',        require('./routes/portalAuth'));
app.use('/api/portal',        require('./routes/studentProfile'));
app.use('/api/students',      require('./routes/students'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
