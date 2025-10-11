// /controllers/noteController.js
const Note = require('../models/Note');

// GET /notes
exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ pinned: -1, updatedAt: -1 });
    res.status(200).json({
      status: 'success',
      results: notes.length,
      data: { notes }
    });
  } catch (error) {
    next(error);
  }
};

// GET /notes/:id
exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });

    if (!note) {
      return res.status(404).json({ status: 'fail', message: 'Note not found' });
    }

    res.status(200).json({ status: 'success', data: { note } });
  } catch (error) {
    next(error);
  }
};

// POST /notes
exports.createNote = async (req, res, next) => {
  try {
    const { title, content, pinned } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ status: 'fail', message: 'Note title is required' });
    }

    const note = await Note.create({
      title: title.trim(),
      content,
      pinned: !!pinned,
      userId: req.user.id
    });

    res.status(201).json({ status: 'success', data: { note } });
  } catch (error) {
    next(error);
  }
};

// PUT /notes/:id
exports.updateNote = async (req, res, next) => {
  try {
    const updates = {};

    if (req.body.title !== undefined) {
      if (!req.body.title || req.body.title.trim().length === 0) {
        return res.status(400).json({ status: 'fail', message: 'Note title cannot be empty' });
      }
      updates.title = req.body.title.trim();
    }

    if (req.body.content !== undefined) updates.content = req.body.content;
    if (req.body.pinned !== undefined) updates.pinned = !!req.body.pinned;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ status: 'fail', message: 'Note not found' });
    }

    res.status(200).json({ status: 'success', data: { note } });
  } catch (error) {
    next(error);
  }
};

// DELETE /notes/:id
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!note) {
      return res.status(404).json({ status: 'fail', message: 'Note not found' });
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};
