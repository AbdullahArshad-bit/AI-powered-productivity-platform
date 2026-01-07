const TimeLog = require('../models/TimeLog');
const Task = require('../models/Task');

// @desc    Start time tracking
// @route   POST /api/timelogs/start
// @access  Private
const startTimeLog = async (req, res) => {
    try {
        const { taskId, type = 'work' } = req.body;

        // Stop any active timers for this user
        await TimeLog.updateMany(
            { user: req.user.id, isActive: true },
            { isActive: false, endTime: new Date() }
        );

        const timeLog = new TimeLog({
            user: req.user.id,
            task: taskId,
            startTime: new Date(),
            type,
            isActive: true,
        });

        const savedLog = await timeLog.save();
        res.status(201).json(savedLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Stop time tracking
// @route   POST /api/timelogs/stop/:id
// @access  Private
const stopTimeLog = async (req, res) => {
    try {
        const timeLog = await TimeLog.findById(req.params.id);

        if (!timeLog) {
            return res.status(404).json({ message: 'Time log not found' });
        }

        if (timeLog.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const endTime = new Date();
        const duration = Math.round((endTime - timeLog.startTime) / 1000 / 60); // minutes

        timeLog.endTime = endTime;
        timeLog.duration = duration;
        timeLog.isActive = false;

        // Update task time spent
        const task = await Task.findById(timeLog.task);
        if (task) {
            task.timeSpent = (task.timeSpent || 0) + duration;
            task.timeLogs.push({
                startTime: timeLog.startTime,
                endTime: endTime,
                duration: duration,
                notes: '',
            });
            await task.save();
        }

        await timeLog.save();
        res.json(timeLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get active time log
// @route   GET /api/timelogs/active
// @access  Private
const getActiveTimeLog = async (req, res) => {
    try {
        const timeLog = await TimeLog.findOne({
            user: req.user.id,
            isActive: true,
        }).populate('task', 'title');

        if (!timeLog) {
            return res.json(null);
        }

        res.json(timeLog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get time logs for task
// @route   GET /api/timelogs/task/:taskId
// @access  Private
const getTaskTimeLogs = async (req, res) => {
    try {
        const timeLogs = await TimeLog.find({
            user: req.user.id,
            task: req.params.taskId,
        }).sort({ startTime: -1 });

        res.json(timeLogs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all time logs for user
// @route   GET /api/timelogs
// @access  Private
const getTimeLogs = async (req, res) => {
    try {
        const timeLogs = await TimeLog.find({ user: req.user.id })
            .populate('task', 'title')
            .sort({ startTime: -1 });

        res.json(timeLogs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    startTimeLog,
    stopTimeLog,
    getActiveTimeLog,
    getTaskTimeLogs,
    getTimeLogs,
};
