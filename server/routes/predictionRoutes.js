const express = require('express');
const router = express.Router();
const { 
    predictDisease, 
    getHistory, 
    getStats, 
    deletePredictions,
    getRemedyDetails,
    getWeeklyActivity // <-- Import the new function
} = require('../controllers/predictionController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// POST a new prediction
router.post('/', protect, upload, predictDisease);

// GET user's prediction history
router.get('/history', protect, getHistory);

// GET user's prediction statistics
router.get('/stats', protect, getStats);

// DELETE multiple predictions
router.delete('/', protect, deletePredictions);

// POST to get detailed remedy info for a given disease
router.post('/remedy', protect, getRemedyDetails);

// GET weekly activity for the dashboard chart
router.get('/activity', protect, getWeeklyActivity);

module.exports = router;
