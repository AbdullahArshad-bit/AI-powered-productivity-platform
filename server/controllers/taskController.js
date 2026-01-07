const Task = require('../models/Task');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Check if user owns the task
        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const { 
        title, 
        description, 
        priority, 
        dueDate, 
        tags, 
        subtasks, 
        parentTask, 
        dependencies,
        estimatedTime,
        project
    } = req.body;

    try {
        const task = new Task({
            user: req.user.id,
            title,
            description,
            priority,
            dueDate,
            tags,
            subtasks: subtasks || [],
            parentTask: parentTask || null,
            dependencies: dependencies || [],
            estimatedTime: estimatedTime || 0,
            project: project || null,
        });

        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    const { 
        title, 
        description, 
        status, 
        priority, 
        dueDate, 
        tags, 
        subtasks,
        parentTask,
        dependencies,
        estimatedTime,
        timeSpent,
        project
    } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            // Check if user owns the task
            if (task.user.toString() !== req.user.id) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            if (title !== undefined) task.title = title;
            if (description !== undefined) task.description = description;
            if (status !== undefined) task.status = status;
            if (priority !== undefined) task.priority = priority;
            if (dueDate !== undefined) task.dueDate = dueDate;
            if (tags !== undefined) task.tags = tags;
            if (subtasks !== undefined) task.subtasks = subtasks;
            if (parentTask !== undefined) task.parentTask = parentTask;
            if (dependencies !== undefined) task.dependencies = dependencies;
            if (estimatedTime !== undefined) task.estimatedTime = estimatedTime;
            if (timeSpent !== undefined) task.timeSpent = timeSpent;
            if (project !== undefined) {
                task.project = project || null;
            }

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            if (task.user.toString() !== req.user.id) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            await task.deleteOne();
            res.json({ message: 'Task removed' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add attachment to task
// @route   POST /api/tasks/:id/attachments
// @access  Private
const addAttachment = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // File info from multer (if using file upload middleware)
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const attachment = {
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`, // Adjust based on your storage
            uploadedAt: new Date(),
        };

        task.attachments.push(attachment);
        await task.save();

        res.json({ message: 'Attachment added', attachment });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete attachment from task
// @route   DELETE /api/tasks/:id/attachments/:attachmentId
// @access  Private
const deleteAttachment = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        task.attachments = task.attachments.filter(
            att => att._id.toString() !== req.params.attachmentId
        );
        await task.save();

        res.json({ message: 'Attachment deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get task with dependencies
// @route   GET /api/tasks/:id/dependencies
// @access  Private
const getTaskDependencies = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('dependencies', 'title status')
            .populate('parentTask', 'title status');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { 
    getTasks,
    getTaskById,
    createTask, 
    updateTask, 
    deleteTask,
    addAttachment,
    deleteAttachment,
    getTaskDependencies
};
