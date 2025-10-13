const express = require('express');
const passport = require('passport');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Normal registration and login routes
router.post('/register', register);
router.post('/login', login);

// --- Google OAuth routes ---

// 1️⃣ Start Google authentication (asks for email and profile)
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 2️⃣ Google callback URL (redirects here after login)
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  (req, res) => {
    // If successful, return a JWT token and user info
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: (process.env.JWT_EXPIRES_IN || '30d').trim()
    });

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email
        }
      }
    });
  }
);

// 3️⃣ Handle OAuth failure
router.get('/failure', (req, res) => {
  res.status(401).json({
    status: 'fail',
    message: 'Google Authentication Failed'
  });
});

module.exports = router;
