// /controllers/usersController.js
const User = require('../models/User');

// GET /users - return all users (for demo/testing; protected)
exports.getUsers = async (req, res, next) => {
  try {
    // Optionally restrict fields returned
    const users = await User.find().select('name email createdAt updatedAt').sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

// GET /users/:id - return single user (protected)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name email createdAt updatedAt');

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};
