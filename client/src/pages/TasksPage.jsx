import { useState, useEffect, useContext } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import TaskColumn from '../components/tasks/TaskColumn';
import TaskModal from '../components/tasks/TaskModal';
import TaskCard from '../components/tasks/TaskCard';
import Button from '../components/ui/Button';
import { Plus, Filter, Search, Sparkles } from 'lucide-react';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');
    const { user } = useContext(AuthContext);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/tasks', config);
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeTask = tasks.find(t => t._id === active.id);
        const overId = over.id;

        let newStatus = activeTask.status;
        if (['todo', 'in-progress', 'done'].includes(overId)) {
            newStatus = overId;
        } else {
            const overTask = tasks.find(t => t._id === overId);
            if (overTask) {
                newStatus = overTask.status;
            }
        }

        if (activeTask.status !== newStatus) {
            const updatedTasks = tasks.map(t =>
                t._id === activeTask._id ? { ...t, status: newStatus } : t
            );
            setTasks(updatedTasks);

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                };
                await axios.put(`http://localhost:5000/api/tasks/${activeTask._id}`, { status: newStatus }, config);
            } catch (error) {
                console.error('Error updating task status:', error);
                fetchTasks();
            }
        }

        setActiveId(null);
    };

    const handleSaveTask = async (taskData) => {
        setIsLoading(true);
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            },
        };

        try {
            if (currentTask) {
                const { data } = await axios.put(`http://localhost:5000/api/tasks/${currentTask._id}`, taskData, config);
                setTasks(tasks.map(t => t._id === data._id ? data : t));
            } else {
                const { data } = await axios.post('http://localhost:5000/api/tasks', taskData, config);
                setTasks([data, ...tasks]);
            }
            setIsModalOpen(false);
            setCurrentTask(null);
        } catch (error) {
            console.error('Error saving task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, config);
            setTasks(tasks.filter(t => t._id !== taskId));
        } catch (error) {
            console.error("Error deleting task", error);
        }
    };

    const openModal = (task = null) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const columns = [
        { id: 'todo', title: 'To Do' },
        { id: 'in-progress', title: 'In Progress' },
        { id: 'done', title: 'Done' },
    ];

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
        return matchesSearch && matchesPriority;
    });

    const getTasksByStatus = (status) => {
        return filteredTasks.filter(task => task.status === status);
    };

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            My Tasks
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Organize and track your work with AI-powered insights
                        </p>
                    </div>
                    <Button 
                        onClick={() => openModal()} 
                        className="shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all"
                    >
                        <Plus size={20} className="mr-2" />
                        New Task
                    </Button>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search tasks..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                        >
                            <option value="all">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-6 overflow-x-auto pb-8 h-[calc(100vh-18rem)]">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-6 min-w-max">
                        {columns.map((col) => (
                            <TaskColumn
                                key={col.id}
                                id={col.id}
                                title={col.title}
                                tasks={getTasksByStatus(col.id)}
                                onEdit={openModal}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>

                    <DragOverlay>
                        {activeId ? (
                            <div className="transform rotate-3 opacity-90">
                                <TaskCard task={tasks.find(t => t._id === activeId)} />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Task Modal */}
            {isModalOpen && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setCurrentTask(null);
                    }}
                    onSubmit={handleSaveTask}
                    task={currentTask}
                    isLoading={isLoading}
                />
            )}

            {/* Empty State */}
            {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        No tasks yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Create your first task to get started
                    </p>
                    <Button onClick={() => openModal()}>
                        <Plus size={20} className="mr-2" />
                        Create Task
                    </Button>
                </div>
            )}
        </DashboardLayout>
    );
};

export default TasksPage;
