// /routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  oauthCallback,
  oauthFailure
} = require('../controllers/authController');

const router = express.Router();

// Local authentication
router.post('/register', register);
router.post('/login', login);

// ----------------------------
// Google OAuth 2.0 Authentication
// ----------------------------

// Step 1 – Redirect user to Google for login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// Step 2 – Google redirects back to our callback route
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google/failure',
    session: false
  }),
  oauthCallback // handled in authController
);

// Optional failure route
router.get('/google/failure', oauthFailure);

module.exports = router;
