const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all projects for a user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id })
            .populate('tasks', 'title status priority dueDate')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate('tasks', 'title description status priority dueDate tags');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { name, description, color } = req.body;

        console.log('=== Create Project Request ===');
        console.log('User ID:', req.user.id);
        console.log('Body:', { name, description, color });

        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Project name is required' });
        }

        const project = new Project({
            user: req.user.id,
            name: name.trim(),
            description: description || '',
            color: color || '#8b5cf6',
            tasks: [],
        });

        const createdProject = await project.save();
        console.log('Project created successfully:', createdProject._id);
        res.status(201).json(createdProject);
    } catch (error) {
        console.error('Error creating project:', error);
        console.error('Error stack:', error.stack);
        res.status(400).json({ message: error.message || 'Failed to create project' });
    }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    const { name, description, color, status } = req.body;

    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (name !== undefined) project.name = name.trim();
        if (description !== undefined) project.description = description;
        if (color !== undefined) project.color = color;
        if (status !== undefined) project.status = status;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Remove project reference from tasks
        await Task.updateMany(
            { project: req.params.id },
            { $unset: { project: '' } }
        );

        await project.deleteOne();
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add task to project
// @route   POST /api/projects/:id/tasks
// @access  Private
const addTaskToProject = async (req, res) => {
    const { taskId } = req.body;

    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const task = await Task.findOne({
            _id: taskId,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (!project.tasks.includes(taskId)) {
            project.tasks.push(taskId);
            await project.save();
        }

        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Remove task from project
// @route   DELETE /api/projects/:id/tasks/:taskId
// @access  Private
const removeTaskFromProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.tasks = project.tasks.filter(
            taskId => taskId.toString() !== req.params.taskId
        );
        await project.save();

        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addTaskToProject,
    removeTaskFromProject,
};
