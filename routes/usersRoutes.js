// /routes/userRoutes.js
const express = require('express');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/usersController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes below require authentication
router.use(protect);

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
