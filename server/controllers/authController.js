/*
File: server/controllers/authController.js
Purpose: Handles all logic for user accounts, including creation, authentication, updates, and deletion.
*/
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Prediction = require('../models/Prediction'); // Required for deleting user's prediction data

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * @param {string} id - The user's MongoDB ObjectId.
 * @returns {string} The generated JWT.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });
        if (user) {
            res.status(201).json({ _id: user.id, name: user.name, email: user.email, token: generateToken(user._id) });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

/**
 * @desc    Authenticate a user (login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ _id: user.id, name: user.name, email: user.email, token: generateToken(user._id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

/**
 * @desc    Update user profile (name & email)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            const updatedUser = await user.save();
            res.json({ _id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, token: generateToken(updatedUser._id) });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};

/**
 * @desc    Update user password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const updateUserPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide both current and new passwords.' });
    }
    try {
        const user = await User.findById(req.user.id);
        if (user && (await bcrypt.compare(currentPassword, user.password))) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        console.error('Password Update Error:', error);
        res.status(500).json({ message: 'Server error while updating password' });
    }
};

/**
 * @desc    Delete user account and all their data
 * @route   DELETE /api/auth/account
 * @access  Private
 */
const deleteUserAccount = async (req, res) => {
    try {
        // Find and delete all predictions made by the user
        await Prediction.deleteMany({ user: req.user.id });

        // Find and delete the user
        await User.findByIdAndDelete(req.user.id);

        res.json({ message: 'User account and all associated data deleted successfully.' });
    } catch (error) {
        console.error('Account Deletion Error:', error);
        res.status(500).json({ message: 'Server error while deleting account.' });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    updateUserProfile, 
    updateUserPassword, 
    deleteUserAccount 
};
