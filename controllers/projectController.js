// /controllers/projectController.js
const Project = require('../models/Project');

// GET /projects  -> get all projects for authenticated user
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: projects.length,
      data: { projects }
    });
  } catch (error) {
    next(error);
  }
};

// GET /projects/:id -> get single project
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user.id }).populate('tasks');

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) {
    next(error);
  }
};

// POST /projects -> create project (validate)
exports.createProject = async (req, res, next) => {
  try {
    const { name, description, tasks } = req.body;

    // Basic validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ status: 'fail', message: 'Project name is required' });
    }

    const project = await Project.create({
      name: name.trim(),
      description,
      tasks: Array.isArray(tasks) ? tasks : [],
      userId: req.user.id
    });

    res.status(201).json({ status: 'success', data: { project } });
  } catch (error) {
    next(error);
  }
};

// PUT /projects/:id -> update project (validate)
exports.updateProject = async (req, res, next) => {
  try {
    const updates = {};

    if (req.body.name !== undefined) {
      if (!req.body.name || req.body.name.trim().length === 0) {
        return res.status(400).json({ status: 'fail', message: 'Project name cannot be empty' });
      }
      updates.name = req.body.name.trim();
    }

    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.tasks !== undefined) updates.tasks = Array.isArray(req.body.tasks) ? req.body.tasks : req.body.tasks;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    res.status(200).json({ status: 'success', data: { project } });
  } catch (error) {
    next(error);
  }
};

// DELETE /projects/:id -> delete project
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!project) {
      return res.status(404).json({ status: 'fail', message: 'Project not found' });
    }

    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};
