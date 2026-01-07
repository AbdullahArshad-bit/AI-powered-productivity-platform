import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import TagModal from '../components/tags/TagModal';
import Button from '../components/ui/Button';
import { Plus, Tag, Edit2, Trash2, Hash, TrendingUp, FileText, CheckCircle2 } from 'lucide-react';

const TagsPage = () => {
    const [tags, setTags] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTag, setCurrentTag] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user && user.token) {
            fetchTags();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const fetchTags = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/tags', config);
            setTags(data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (tag = null) => {
        setCurrentTag(tag);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentTag(null);
    };

    const handleSubmit = async (tagData) => {
        setIsSaving(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            if (currentTag) {
                await axios.put(`http://localhost:5000/api/tags/${currentTag._id}`, tagData, config);
            } else {
                await axios.post('http://localhost:5000/api/tags', tagData, config);
            }
            
            handleCloseModal();
            fetchTags();
        } catch (error) {
            console.error('Error saving tag:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save tag. Please try again.';
            alert(`Error: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (tagId) => {
        if (!window.confirm('Are you sure you want to delete this tag? It will be removed from all tasks and notes.')) {
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`http://localhost:5000/api/tags/${tagId}`, config);
            fetchTags();
        } catch (error) {
            console.error('Error deleting tag:', error);
            alert('Failed to delete tag. Please try again.');
        }
    };

    if (isLoading || !user) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
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
                            Tags
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            Organize and manage tags for your tasks and notes
                        </p>
                    </div>
                    <Button 
                        onClick={() => handleOpenModal()} 
                        className="shadow-lg shadow-pink-500/20"
                    >
                        <Plus size={20} className="mr-2" />
                        New Tag
                    </Button>
                </div>
            </div>

            {tags.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4 shadow-lg">
                        <Tag className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        No tags yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Create tags to organize your tasks and notes
                    </p>
                    <Button onClick={() => handleOpenModal()}>
                        <Plus size={20} className="mr-2" />
                        Create Tag
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tags.map((tag) => (
                        <div
                            key={tag._id}
                            className="glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all group relative"
                        >
                            {/* Tag Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3 flex-1">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                                        style={{ backgroundColor: tag.color }}
                                    >
                                        <Hash className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                                            {tag.name}
                                        </h3>
                                        {tag.description && (
                                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                                                {tag.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Actions Menu */}
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenModal(tag)}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tag._id)}
                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Usage Stats */}
                            <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1 text-slate-600 dark:text-slate-400">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{tag.usageCount || 0} uses</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-xs">
                                    <span>Created {new Date(tag.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tag Modal */}
            {isModalOpen && (
                <TagModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    tag={currentTag}
                    isLoading={isSaving}
                />
            )}
        </DashboardLayout>
    );
};

export default TagsPage;
