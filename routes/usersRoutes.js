// /routes/usersRoutes.js
const express = require('express');
const { getUsers, getUser } = require('../controllers/usersController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All user routes are protected
router.use(protect);

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser);

module.exports = router;
