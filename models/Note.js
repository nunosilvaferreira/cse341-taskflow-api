// /models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  pinned: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
