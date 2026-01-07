import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import TaskModal from '../components/tasks/TaskModal';
import { 
    Calendar as CalendarIcon, 
    ChevronLeft, 
    ChevronRight, 
    Clock,
    CheckCircle2,
    Circle,
    AlertCircle
} from 'lucide-react';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateTasks, setSelectedDateTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    // Update selected date tasks when tasks change
    useEffect(() => {
        if (selectedDate) {
            const dateTasks = getTasksForDate(selectedDate);
            setSelectedDateTasks(dateTasks);
        }
    }, [tasks, selectedDate]);

    const fetchTasks = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/tasks', config);
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const getTasksForDate = (date) => {
        if (!date) return [];
        // Get date in YYYY-MM-DD format (local timezone)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            // Parse task dueDate and compare in local timezone
            const taskDateObj = new Date(task.dueDate);
            const taskYear = taskDateObj.getFullYear();
            const taskMonth = String(taskDateObj.getMonth() + 1).padStart(2, '0');
            const taskDay = String(taskDateObj.getDate()).padStart(2, '0');
            const taskDateStr = `${taskYear}-${taskMonth}-${taskDay}`;
            return taskDateStr === dateStr;
        });
    };

    const handleDateClick = (date) => {
        if (!date) return;
        setSelectedDate(date);
        const dateTasks = getTasksForDate(date);
        setSelectedDateTasks(dateTasks);
    };

    const handleTaskClick = (task) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentTask(null);
        fetchTasks().then(() => {
            // Refresh selected date tasks after fetching
            if (selectedDate) {
                const updatedTasks = getTasksForDate(selectedDate);
                setSelectedDateTasks(updatedTasks);
            }
        });
    };

    const handleTaskSubmit = async (taskData) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            if (currentTask) {
                await axios.put(`http://localhost:5000/api/tasks/${currentTask._id}`, taskData, config);
            } else {
                await axios.post('http://localhost:5000/api/tasks', taskData, config);
            }
            handleModalClose();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
        handleDateClick(new Date());
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date) => {
        if (!date || !selectedDate) return false;
        return date.toDateString() === selectedDate.toDateString();
    };

    const getTaskStatusIcon = (status) => {
        switch (status) {
            case 'done':
                return <CheckCircle2 className="w-3 h-3 text-green-500" />;
            case 'in-progress':
                return <Circle className="w-3 h-3 text-yellow-500" />;
            default:
                return <Circle className="w-3 h-3 text-blue-500" />;
        }
    };

    const getTaskPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            default:
                return 'bg-blue-500';
        }
    };

    const isOverdue = (task) => {
        if (!task.dueDate || task.status === 'done') return false;
        return new Date(task.dueDate) < new Date() && new Date(task.dueDate).toDateString() !== new Date().toDateString();
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = getDaysInMonth(currentDate);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Calendar
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            View your tasks and events by due date
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            💡 Tasks with a due date will appear on the calendar
                        </p>
                    </div>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-md"
                    >
                        Today
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <div className="lg:col-span-2">
                    <div className="glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => navigateMonth(-1)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <button
                                onClick={() => navigateMonth(1)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                        </div>

                        {/* Day Names */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {dayNames.map(day => (
                                <div
                                    key={day}
                                    className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400 py-2"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {days.map((date, index) => {
                                const dateTasks = date ? getTasksForDate(date) : [];
                                const hasTasks = dateTasks.length > 0;
                                const overdueTasks = dateTasks.filter(isOverdue);

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleDateClick(date)}
                                        className={`
                                            min-h-[100px] p-2 rounded-lg border-2 transition-all cursor-pointer
                                            ${!date ? 'bg-transparent border-transparent' : ''}
                                            ${date && isToday(date) ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : ''}
                                            ${date && isSelected(date) && !isToday(date) ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500' : ''}
                                            ${date && !isToday(date) && !isSelected(date) ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600' : ''}
                                        `}
                                    >
                                        {date && (
                                            <>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span
                                                        className={`
                                                            text-sm font-semibold
                                                            ${isToday(date) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}
                                                        `}
                                                    >
                                                        {date.getDate()}
                                                    </span>
                                                    {overdueTasks.length > 0 && (
                                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    {dateTasks.slice(0, 3).map(task => (
                                                        <div
                                                            key={task._id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleTaskClick(task);
                                                            }}
                                                            className={`
                                                                text-xs px-2 py-1 rounded truncate cursor-pointer
                                                                ${getTaskPriorityColor(task.priority)}/20
                                                                border ${getTaskPriorityColor(task.priority)}/40
                                                                hover:${getTaskPriorityColor(task.priority)}/30
                                                                transition-all
                                                            `}
                                                            title={task.title}
                                                        >
                                                            <div className="flex items-center gap-1">
                                                                {getTaskStatusIcon(task.status)}
                                                                <span className="truncate text-slate-700 dark:text-slate-200">
                                                                    {task.title}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {dateTasks.length > 3 && (
                                                        <div className="text-xs text-slate-500 dark:text-slate-400 px-2">
                                                            +{dateTasks.length - 3} more
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    </div>

                {/* Selected Date Tasks */}
                <div className="space-y-6">
                    <div className="glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-3 mb-4">
                            <CalendarIcon className="w-5 h-5 text-red-500" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {selectedDate
                                    ? selectedDate.toLocaleDateString('en-US', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric',
                                      })
                                    : 'Select a date'}
                    </h3>
                        </div>

                        {selectedDate ? (
                            <div className="space-y-3">
                                {selectedDateTasks.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                        <p>No tasks for this date</p>
                                        <button
                                            onClick={() => {
                                                // Create a task object with pre-filled dueDate
                                                const year = selectedDate.getFullYear();
                                                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                                const day = String(selectedDate.getDate()).padStart(2, '0');
                                                const dueDateStr = `${year}-${month}-${day}`;
                                                setCurrentTask({ dueDate: dueDateStr });
                                                setIsModalOpen(true);
                                            }}
                                            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Add Task
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                            {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''}
                                        </div>
                                        {selectedDateTasks.map(task => (
                                            <div
                                                key={task._id}
                                                onClick={() => handleTaskClick(task)}
                                                className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {task.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        {getTaskStatusIcon(task.status)}
                                                        {isOverdue(task) && (
                                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                                        )}
                                                    </div>
                                                </div>
                                                {task.description && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                                                        {task.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                    <span
                                                        className={`px-2 py-1 rounded ${
                                                            task.priority === 'high'
                                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                                : task.priority === 'medium'
                                                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                        }`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(task.dueDate).toLocaleTimeString('en-US', {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                // Create a task object with pre-filled dueDate
                                                const year = selectedDate.getFullYear();
                                                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                                                const day = String(selectedDate.getDate()).padStart(2, '0');
                                                const dueDateStr = `${year}-${month}-${day}`;
                                                setCurrentTask({ dueDate: dueDateStr });
                                                setIsModalOpen(true);
                                            }}
                                            className="w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Add New Task
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                <p>Click on a date to view tasks</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Task Modal */}
            {isModalOpen && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSubmit={handleTaskSubmit}
                    task={currentTask}
                />
            )}
        </DashboardLayout>
    );
};

export default CalendarPage;
