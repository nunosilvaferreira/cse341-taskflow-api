// /controllers/usersController.js
const User = require('../models/User');

// ✅ GET /users - return all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('name email createdAt updatedAt');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

// ✅ GET /users/:id - get one user
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name email createdAt updatedAt');
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};

// ✅ PUT /users/:id - update user info
exports.updateUser = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'email', 'password'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field]) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .select('name email updatedAt');

    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// ✅ DELETE /users/:id - remove user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
