/*
File: server/routes/authRoutes.js
Purpose: Defines the API endpoints for authentication and user management.
*/
const express = require('express');
const router = express.Router();

// Import all necessary controller functions and middleware
const { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    updateUserPassword,
    deleteUserAccount // <-- Import the new function
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// --- Public Routes ---
// These routes are accessible to anyone.
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Protected Routes ---
// These routes require a valid JSON Web Token (JWT) to be accessed.
// The 'protect' middleware verifies the token before allowing the request to proceed.
router.put('/profile', protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);
router.delete('/account', protect, deleteUserAccount); // <-- Add this new route

module.exports = router;
