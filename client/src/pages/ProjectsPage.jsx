import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProjectModal from '../components/projects/ProjectModal';
import Button from '../components/ui/Button';
import { 
    Plus, 
    FolderKanban, 
    Calendar, 
    Users, 
    Target,
    Edit2,
    Trash2,
    MoreVertical,
    CheckCircle2,
    Circle,
    Clock
} from 'lucide-react';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.token) {
            fetchProjects();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchProjects = async () => {
        if (!user || !user.token) {
            console.error('User not authenticated');
            setIsLoading(false);
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/projects', config);
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (project = null) => {
        setCurrentProject(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProject(null);
    };

    const handleSubmit = async (projectData) => {
        if (!user || !user.token) {
            alert('Please login to create projects');
            return;
        }

        setIsSaving(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            if (currentProject) {
                await axios.put(`http://localhost:5000/api/projects/${currentProject._id}`, projectData, config);
            } else {
                await axios.post('http://localhost:5000/api/projects', projectData, config);
            }
            
            handleCloseModal();
            fetchProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save project. Please try again.';
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (projectId) => {
        if (!user || !user.token) {
            alert('Please login to delete projects');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this project? Tasks will not be deleted, only removed from the project.')) {
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`http://localhost:5000/api/projects/${projectId}`, config);
            fetchProjects();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project. Please try again.');
        }
    };

    const getTaskCounts = (project) => {
        if (!project.tasks || project.tasks.length === 0) {
            return { total: 0, completed: 0, inProgress: 0, todo: 0 };
        }
        
        const total = project.tasks.length;
        const completed = project.tasks.filter(t => t.status === 'done').length;
        const inProgress = project.tasks.filter(t => t.status === 'in-progress').length;
        const todo = project.tasks.filter(t => t.status === 'todo').length;
        
        return { total, completed, inProgress, todo };
    };

    const getProgressPercentage = (project) => {
        const counts = getTaskCounts(project);
        if (counts.total === 0) return 0;
        return Math.round((counts.completed / counts.total) * 100);
    };

    if (isLoading || !user) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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
                            Projects
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Organize your tasks into projects and track progress
                        </p>
                    </div>
                    <Button 
                        onClick={() => handleOpenModal()} 
                        className="shadow-lg shadow-purple-500/20"
                    >
                        <Plus size={20} className="mr-2" />
                        New Project
                    </Button>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg">
                        <FolderKanban className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        No projects yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Create your first project to organize your tasks
                    </p>
                    <Button onClick={() => handleOpenModal()}>
                        <Plus size={20} className="mr-2" />
                        Create Project
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => {
                        const counts = getTaskCounts(project);
                        const progress = getProgressPercentage(project);
                        
                        return (
                            <div
                                key={project._id}
                                className="glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all group relative"
                            >
                                {/* Project Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                                            style={{ backgroundColor: project.color }}
                                        >
                                            <FolderKanban className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                                                {project.name}
                                            </h3>
                                            {project.description && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                                                    {project.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Actions Menu */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setDeleteConfirm(deleteConfirm === project._id ? null : project._id)}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <MoreVertical className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        </button>
                                        
                                        {deleteConfirm === project._id && (
                                            <div className="absolute right-0 top-10 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-10 min-w-[120px]">
                                                <button
                                                    onClick={() => handleOpenModal(project)}
                                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded flex items-center space-x-2"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project._id)}
                                                    className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center space-x-2"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-600 dark:text-slate-400">
                                            Progress
                                        </span>
                                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                                            {progress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div
                                            className="h-2 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${progress}%`,
                                                backgroundColor: project.color
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Task Stats */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                                            <Target className="w-4 h-4" />
                                            <span>{counts.total} tasks</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>{counts.completed}</span>
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                            project.status === 'active'
                                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                : project.status === 'completed'
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        {project.status}
                                    </span>
                                </div>

                                {/* View Project Button */}
                                <button
                                    onClick={() => navigate(`/projects/${project._id}`)}
                                    className="w-full mt-4 py-2 text-sm font-semibold rounded-lg transition-colors"
                                    style={{
                                        backgroundColor: `${project.color}20`,
                                        color: project.color
                                    }}
                                >
                                    View Project
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Project Modal */}
            {isModalOpen && (
                <ProjectModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    project={currentProject}
                    isLoading={isSaving}
                />
            )}
        </DashboardLayout>
    );
};

export default ProjectsPage;
