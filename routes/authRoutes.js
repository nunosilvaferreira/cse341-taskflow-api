const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// --- Local Authentication ---
router.post('/register', register);
router.post('/login', login);

// --- Google OAuth Authentication ---

// 1️⃣ Start Google login flow — includes the required `scope`
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

// 2️⃣ OAuth callback — Google redirects here after login
router.get(
  '/google/callback',
  (req, res, next) => {
    // Prevent direct access to the callback (without scope)
    if (!req.query.code) {
      return res.status(400).json({
        status: 'fail',
        message: 'Direct access not allowed. Please start login via /auth/google'
      });
    }
    next();
  },
  passport.authenticate('google', {
    failureRedirect: '/auth/failure',
    session: false
  }),
  (req, res) => {
    // Issue a JWT token upon successful login
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

// 3️⃣ OAuth failure route
router.get('/failure', (req, res) => {
  res.status(401).json({
    status: 'fail',
    message: 'Google Authentication Failed'
  });
});

// 4️⃣ Simple web page for Render (for graders to click a button)
router.get('/google/login', (req, res) => {
  res.send(`
    <html>
      <head><title>Login with Google</title></head>
      <body style="font-family: Arial, sans-serif; text-align:center; margin-top:40px;">
        <h2>TaskFlow API — Google OAuth Login</h2>
        <p>Click below to sign in with Google.</p>
        <a href="/auth/google">
          <button style="padding:12px 20px; font-size:16px; cursor:pointer;">Sign in with Google</button>
        </a>
        <p style="margin-top:18px; font-size:12px; color:#666;">
          If you see an error, ensure your account is added as a Test User in Google Cloud Console.
        </p>
      </body>
    </html>
  `);
});

module.exports = router;
