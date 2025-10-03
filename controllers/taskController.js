const Task = require('../models/Task');

// @desc    Get all tasks for user
// @route   GET /tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /tasks/:id
// @access  Private
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'Task not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /tasks
// @access  Private
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, status, category } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      status,
      category,
      userId: req.user.id
    });

    res.status(201).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'Task not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        task
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /tasks/:id
// @access  Private
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!task) {
      return res.status(404).json({
        status: 'fail',
        message: 'Task not found'
      });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};