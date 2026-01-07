import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { X, Eye, Edit3, FileText } from 'lucide-react';

const NoteModal = ({ isOpen, onClose, onSubmit, note = null, isLoading = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });

    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        if (note) {
            setFormData({
                title: note.title || '',
                content: note.content || '',
            });
        } else {
            setFormData({
                title: '',
                content: '',
            });
        }
        setIsPreview(false);
    }, [note, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-5xl glass rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 h-[85vh] flex flex-col my-8 animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {note ? 'Edit Note' : 'Create New Note'}
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => setIsPreview(!isPreview)}
                            className="flex items-center"
                        >
                            {isPreview ? (
                                <>
                                    <Edit3 size={16} className="mr-2" />
                                    Edit
                                </>
                            ) : (
                                <>
                                    <Eye size={16} className="mr-2" />
                                    Preview
                                </>
                            )}
                        </Button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 pb-4">
                        <Input
                            label="Note Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Meeting Notes, Project Ideas..."
                            required
                        />
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 px-6 pb-6">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Content (Markdown supported)
                        </label>
                        {isPreview ? (
                            <div className="flex-1 overflow-y-auto glass rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 prose prose-slate dark:prose-invert max-w-none">
                                <ReactMarkdown>{formData.content || '*No content yet*'}</ReactMarkdown>
                            </div>
                        ) : (
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="flex-1 w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 font-mono text-sm resize-none"
                                placeholder="# Heading\n\n## Subheading\n\n- List item 1\n- List item 2\n\n**Bold text** and *italic text*\n\n```\nCode block\n```"
                            />
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end p-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 space-x-3">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : (note ? 'Save Changes' : 'Create Note')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteModal;
