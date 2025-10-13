// /controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '30d').trim()
  });
};

// ----------------------------
// LOCAL AUTHENTICATION
// ----------------------------

// @desc    Register user
// @route   POST /auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ----------------------------
// GOOGLE OAUTH 2.0 AUTHENTICATION
// ----------------------------

// @desc    Handle Google OAuth callback
// @route   GET /auth/google/callback
// @access  Public (callback from Google)
exports.oauthCallback = (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'OAuth failed: no user returned from Google'
      });
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'OAuth callback error'
    });
  }
};

// @desc    OAuth failure route
// @route   GET /auth/google/failure
exports.oauthFailure = (req, res) => {
  res.status(401).json({
    status: 'fail',
    message: 'Google OAuth login failed'
  });
};
