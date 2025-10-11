// /routes/noteRoutes.js
const express = require('express');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // protect notes

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
