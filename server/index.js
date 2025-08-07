require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const os = require('os');

const app = express();

// --- THIS IS THE CHANGE ---
// This simple configuration allows requests from any origin.
// It is the most reliable setting for this deployment.
app.use(cors());
// --- END OF CHANGE ---

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(os.tmpdir(), 'uploads')));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/predict', require('./routes/predictionRoutes'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
