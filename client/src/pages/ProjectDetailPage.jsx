import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import TaskModal from '../components/tasks/TaskModal';
import ProjectModal from '../components/projects/ProjectModal';
import Button from '../components/ui/Button';
import { 
    ArrowLeft, 
    FolderKanban, 
    Plus, 
    Edit2, 
    Trash2,
    CheckCircle2,
    Circle,
    Clock,
    AlertCircle,
    Calendar,
    Tag
} from 'lucide-react';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isSavingProject, setIsSavingProject] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user && user.token) {
            fetchProject();
            fetchTasks();
        } else {
            setIsLoading(false);
        }
    }, [id, user]);

    const fetchProject = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`http://localhost:5000/api/projects/${id}`, config);
            setProject(data);
        } catch (error) {
            console.error('Error fetching project:', error);
            if (error.response?.status === 404) {
                alert('Project not found');
                navigate('/projects');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/tasks', config);
            
            console.log('Fetched all tasks:', data.length);
            console.log('Current project ID:', id);
            
            // Filter tasks that belong to this project
            const projectTasks = data.filter(task => {
                if (!task.project) {
                    console.log('Task has no project:', task.title);
                    return false;
                }
                // Handle different formats: ObjectId object, populated object, or string
                let taskProjectId;
                if (typeof task.project === 'object' && task.project !== null) {
                    taskProjectId = task.project._id ? task.project._id.toString() : task.project.toString();
                } else {
                    taskProjectId = task.project.toString();
                }
                const projectId = id.toString();
                const matches = taskProjectId === projectId;
                console.log(`Task "${task.title}": project=${taskProjectId}, current=${projectId}, match=${matches}`);
                return matches;
            });
            
            console.log('Filtered project tasks:', projectTasks.length);
            setTasks(projectTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleOpenTaskModal = (task = null) => {
        // If creating new task, include project ID
        if (!task) {
            task = { project: id };
        } else if (task._id) {
            // Editing existing task - keep it as is, project will be preserved
            setCurrentTask(task);
        } else {
            // New task with project
            task = { ...task, project: id };
            setCurrentTask(task);
        }
        setIsModalOpen(true);
    };

    const handleCloseTaskModal = () => {
        setIsModalOpen(false);
        setCurrentTask(null);
        fetchTasks();
    };

    const handleSaveTask = async (taskData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            };

            // Always ensure project ID is set for tasks created from project page
            if (!taskData.project && id) {
                taskData.project = id;
            }

            console.log('Saving task - Project ID:', taskData.project, 'Current project ID:', id);

            if (currentTask && currentTask._id) {
                // Update existing task - preserve project if it exists
                if (!taskData.project && currentTask.project) {
                    taskData.project = currentTask.project._id || currentTask.project;
                }
                const response = await axios.put(`http://localhost:5000/api/tasks/${currentTask._id}`, taskData, config);
                console.log('Task updated, response:', response.data);
            } else {
                // Create new task with project association
                const response = await axios.post('http://localhost:5000/api/tasks', taskData, config);
                console.log('Task created, response:', response.data);
                console.log('Created task project field:', response.data.project);
            }
            
            // Refresh tasks after save
            await fetchTasks();
            handleCloseTaskModal();
        } catch (error) {
            console.error('Error saving task:', error);
            console.error('Error response:', error.response?.data);
            alert('Failed to save task. Please try again.');
        }
    };

    const handleDeleteProject = async () => {
        if (!window.confirm('Are you sure you want to delete this project? Tasks will not be deleted, only removed from the project.')) {
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`http://localhost:5000/api/projects/${id}`, config);
            navigate('/projects');
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project. Please try again.');
        }
    };

    const handleUpdateProject = async (projectData) => {
        setIsSavingProject(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`http://localhost:5000/api/projects/${id}`, projectData, config);
            setIsProjectModalOpen(false);
            fetchProject();
        } catch (error) {
            console.error('Error updating project:', error);
            alert('Failed to update project. Please try again.');
        } finally {
            setIsSavingProject(false);
        }
    };

    const getTaskCounts = () => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'done').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        const todo = tasks.filter(t => t.status === 'todo').length;
        return { total, completed, inProgress, todo };
    };

    const getProgressPercentage = () => {
        const counts = getTaskCounts();
        if (counts.total === 0) return 0;
        return Math.round((counts.completed / counts.total) * 100);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-600 dark:text-red-400';
            case 'medium': return 'text-yellow-600 dark:text-yellow-400';
            case 'low': return 'text-green-600 dark:text-green-400';
            default: return 'text-slate-600 dark:text-slate-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'done': return <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
            case 'in-progress': return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
            case 'todo': return <Circle className="w-4 h-4 text-slate-400" />;
            default: return <Circle className="w-4 h-4 text-slate-400" />;
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!project) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-64">
                    <AlertCircle className="w-16 h-16 text-slate-400 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Project not found
                    </h2>
                    <Button onClick={() => navigate('/projects')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Projects
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const counts = getTaskCounts();
    const progress = getProgressPercentage();

    return (
        <DashboardLayout>
            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/projects')}
                    className="mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Projects
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: project.color }}
                        >
                            <FolderKanban className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                {project.name}
                            </h1>
                            {project.description && (
                                <p className="text-slate-600 dark:text-slate-400 mb-3">
                                    {project.description}
                                </p>
                            )}
                            <div className="flex items-center space-x-4 text-sm">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        project.status === 'active'
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                            : project.status === 'completed'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                                >
                                    {project.status}
                                </span>
                                <span className="text-slate-500 dark:text-slate-400">
                                    Created {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsProjectModalOpen(true)}
                        >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Project
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDeleteProject}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="glass rounded-2xl p-6 mb-6 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Progress
                    </h2>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {progress}%
                    </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4">
                    <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: project.color
                        }}
                    />
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {counts.total}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Total</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {counts.completed}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {counts.inProgress}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">In Progress</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                            {counts.todo}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">To Do</div>
                    </div>
                </div>
            </div>

            {/* Tasks Section */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Tasks ({tasks.length})
                </h2>
                <Button onClick={() => handleOpenTaskModal({ project: id })}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                </Button>
            </div>

            {tasks.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center border border-slate-200/50 dark:border-slate-700/50">
                    <FolderKanban className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        No tasks yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Add your first task to this project
                    </p>
                    <Button onClick={() => handleOpenTaskModal(null)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="glass rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => handleOpenTaskModal(task)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex-1">
                                    {task.title}
                                </h3>
                                {getStatusIcon(task.status)}
                            </div>
                            
                            {task.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                                    {task.description}
                                </p>
                            )}

                            <div className="flex items-center justify-between text-xs">
                                <span className={`font-semibold ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                                {task.dueDate && (
                                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                )}
                            </div>

                            {task.tags && task.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {task.tags.slice(0, 3).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-xs flex items-center"
                                        >
                                            <Tag className="w-3 h-3 mr-1" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Task Modal */}
            {isModalOpen && (
                <TaskModal
                    task={currentTask || { project: id }}
                    isOpen={isModalOpen}
                    onClose={handleCloseTaskModal}
                    onSubmit={handleSaveTask}
                />
            )}

            {/* Project Edit Modal */}
            {isProjectModalOpen && (
                <ProjectModal
                    isOpen={isProjectModalOpen}
                    onClose={() => setIsProjectModalOpen(false)}
                    onSubmit={handleUpdateProject}
                    project={project}
                    isLoading={isSavingProject}
                />
            )}
        </DashboardLayout>
    );
};

export default ProjectDetailPage;
