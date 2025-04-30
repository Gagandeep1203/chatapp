const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as necessary
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user (password hashing is handled by pre-save hook in User model)
        user = new User({
            username,
            email,
            password,
        });

        await user.save();

        // Create JWT payload
        const payload = {
            user: {
                id: user.id, // Use user.id provided by mongoose
            },
        };

        // Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour (adjust as needed)
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token }); // Return token upon successful registration
            }
        );

    } catch (err) {
        console.error(err.message);
        // Check for validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user
        let user = await User.findOne({ email }).select('+password'); // Include password for comparison
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
            },
        };

        // Sign the token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/auth/me
// @desc    Get current logged in user data
// @access  Private
router.get('/me', protect, async (req, res) => {
  // req.user is attached by the protect middleware
  if (req.user) {
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      // Add any other non-sensitive fields you want
    });
  } else {
    // This case should ideally be handled by the middleware, but as a fallback:
    res.status(401).json({ message: 'Not authorized' });
  }
});

module.exports = router; 