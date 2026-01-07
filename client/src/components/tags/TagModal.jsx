import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { X, Tag, Palette } from 'lucide-react';

const TagModal = ({ isOpen, onClose, onSubmit, tag = null, isLoading = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        color: '#8b5cf6',
    });
    const { user } = useContext(AuthContext);

    const colors = [
        { value: '#8b5cf6', name: 'Purple' },
        { value: '#3b82f6', name: 'Blue' },
        { value: '#10b981', name: 'Green' },
        { value: '#f59e0b', name: 'Amber' },
        { value: '#ef4444', name: 'Red' },
        { value: '#ec4899', name: 'Pink' },
        { value: '#06b6d4', name: 'Cyan' },
        { value: '#6366f1', name: 'Indigo' },
        { value: '#14b8a6', name: 'Teal' },
        { value: '#f97316', name: 'Orange' },
    ];

    useEffect(() => {
        if (tag) {
            setFormData({
                name: tag.name || '',
                description: tag.description || '',
                color: tag.color || '#8b5cf6',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                color: '#8b5cf6',
            });
        }
    }, [tag, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert('Tag name is required');
            return;
        }
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-2xl glass rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 my-8 animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                            <Tag className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {tag ? 'Edit Tag' : 'Create New Tag'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Tag Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Tag Name *
                        </label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., frontend, bug, urgent"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what this tag is for..."
                            rows={3}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all resize-none"
                        />
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center">
                            <Palette className="w-4 h-4 mr-2" />
                            Tag Color
                        </label>
                        <div className="grid grid-cols-10 gap-3">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                                    className={`
                                        w-12 h-12 rounded-xl transition-all
                                        ${formData.color === color.value 
                                            ? 'ring-4 ring-offset-2 ring-pink-500 scale-110' 
                                            : 'hover:scale-105'
                                        }
                                    `}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-4 space-x-3 border-t border-slate-200/50 dark:border-slate-700/50">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Saving...' : (tag ? 'Save Changes' : 'Create Tag')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TagModal;
