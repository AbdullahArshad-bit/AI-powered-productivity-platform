import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { X, Sparkles, Loader2, Calendar, Tag as TagIcon, Plus, Trash2, Link2, File, Check, Clock } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSubmit, task = null, isLoading = false }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: '',
        tags: '',
        subtasks: [],
        dependencies: [],
        estimatedTime: 0,
    });

    const [aiSuggestions, setAiSuggestions] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [availableTasks, setAvailableTasks] = useState([]);
    const [attachments, setAttachments] = useState([]);
    const formRef = useRef(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (isOpen) {
            if (task && task._id) {
                // Editing existing task - fetch full task data with attachments
                fetchTaskDetails(task._id);
            } else if (task && !task._id) {
                // New task with project ID
                setFormData({
                    title: '',
                    description: '',
                    priority: 'medium',
                    dueDate: '',
                    tags: '',
                    subtasks: [],
                    dependencies: [],
                    estimatedTime: 0,
                });
                setAttachments([]);
                setAiSuggestions(null);
            } else {
                // No task - new task
                setFormData({
                    title: '',
                    description: '',
                    priority: 'medium',
                    dueDate: '',
                    tags: '',
                    subtasks: [],
                    dependencies: [],
                    estimatedTime: 0,
                });
                setAttachments([]);
                setAiSuggestions(null);
            }
        }
    }, [task, isOpen]);

    const fetchTaskDetails = async (taskId) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`http://localhost:5000/api/tasks/${taskId}`, config);
            
            // Handle due date
            let dueDateValue = '';
            if (data.dueDate) {
                if (typeof data.dueDate === 'string' && data.dueDate.includes('T')) {
                    dueDateValue = data.dueDate.split('T')[0];
                } else {
                    dueDateValue = data.dueDate;
                }
            }
            
            setFormData({
                title: data.title || '',
                description: data.description || '',
                priority: data.priority || 'medium',
                dueDate: dueDateValue,
                tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
                subtasks: data.subtasks || [],
                dependencies: data.dependencies ? (Array.isArray(data.dependencies) ? data.dependencies.map(d => d._id || d) : []) : [],
                estimatedTime: data.estimatedTime || 0,
            });
            
            // Load attachments - ensure we have the full attachment data
            if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
                setAttachments(data.attachments);
            } else {
                setAttachments([]);
            }
            
            if (data.aiMeta && data.aiMeta.suggestedSteps) {
                setAiSuggestions({ steps: data.aiMeta.suggestedSteps });
            } else {
                setAiSuggestions(null);
            }
        } catch (error) {
            console.error('Error fetching task details:', error);
            // Fallback to using task prop if fetch fails
            if (task) {
                let dueDateValue = '';
                if (task.dueDate) {
                    if (typeof task.dueDate === 'string' && task.dueDate.includes('T')) {
                        dueDateValue = task.dueDate.split('T')[0];
                    } else {
                        dueDateValue = task.dueDate;
                    }
                }
                
                setFormData({
                    title: task.title || '',
                    description: task.description || '',
                    priority: task.priority || 'medium',
                    dueDate: dueDateValue,
                    tags: Array.isArray(task.tags) ? task.tags.join(', ') : (task.tags || ''),
                    subtasks: task.subtasks || [],
                    dependencies: task.dependencies ? (Array.isArray(task.dependencies) ? task.dependencies.map(d => d._id || d) : []) : [],
                    estimatedTime: task.estimatedTime || 0,
                });
                setAttachments(task.attachments || []);
            }
        }
    };

    useEffect(() => {
        if (isOpen && user?.token) {
            fetchAvailableTasks();
        }
    }, [isOpen, user]);

    const fetchAvailableTasks = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get('http://localhost:5000/api/tasks', config);
            // Filter out current task if editing
            const filtered = task 
                ? data.filter(t => t._id !== task._id)
                : data;
            setAvailableTasks(filtered);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addSubtask = () => {
        setFormData(prev => ({
            ...prev,
            subtasks: [...prev.subtasks, { title: '', completed: false, order: prev.subtasks.length }]
        }));
    };

    const updateSubtask = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.map((st, i) => 
                i === index ? { ...st, [field]: value } : st
            )
        }));
    };

    const removeSubtask = (index) => {
        setFormData(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter((_, i) => i !== index)
        }));
    };

    const toggleDependency = (taskId) => {
        setFormData(prev => ({
            ...prev,
            dependencies: prev.dependencies.includes(taskId)
                ? prev.dependencies.filter(id => id !== taskId)
                : [...prev.dependencies, taskId]
        }));
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        // For now, store file info (in production, upload to cloud storage)
        const newAttachments = files.map(file => ({
            filename: file.name,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            url: URL.createObjectURL(file), // Temporary local URL
            uploadedAt: new Date(),
            file: file, // Store file object for later use
        }));
        setAttachments(prev => [...prev, ...newAttachments]);
        
        // Reset input to allow same file to be selected again
        e.target.value = '';
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

        const taskData = { 
            ...formData, 
            tags: tagsArray,
            subtasks: formData.subtasks.filter(st => st.title.trim()),
            attachments: attachments,
        };
        
        // Preserve project field if it was passed in task prop
        // Handle both object format (task.project._id) and string format (task.project)
        if (task && task.project) {
            if (typeof task.project === 'object' && task.project._id) {
                taskData.project = task.project._id.toString();
            } else {
                taskData.project = task.project.toString();
            }
        }
        
        if (aiSuggestions) {
            taskData.aiMeta = { 
                suggestedSteps: aiSuggestions.steps, 
                estimatedTime: aiSuggestions.overallEstimateHours 
            };
        }

        onSubmit(taskData);
    };

    const handleAiBreakdown = async () => {
        if (!formData.title) {
            alert("Please enter a title first");
            return;
        }
        setIsAiLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await axios.post('http://localhost:5000/api/ai/breakdown', {
                title: formData.title,
                description: formData.description,
                dueDate: formData.dueDate,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            }, config);

            console.log("AI Breakdown Response:", data);
            
            // Validate response structure
            if (data && data.steps && Array.isArray(data.steps)) {
                setAiSuggestions(data);
                if (data.suggestedPriority) {
                    setFormData(prev => ({ ...prev, priority: data.suggestedPriority }));
                }
            } else {
                console.warn("Invalid breakdown response structure:", data);
                // Set default suggestions if response is invalid
                setAiSuggestions({
                    steps: [
                        { step: "Plan and analyze requirements", estimateHours: "2", difficulty: "medium" },
                        { step: "Design the solution", estimateHours: "3", difficulty: "medium" },
                        { step: "Implement the solution", estimateHours: "5", difficulty: "high" },
                        { step: "Test and verify", estimateHours: "2", difficulty: "medium" }
                    ],
                    overallEstimateHours: 12,
                    suggestedPriority: "high"
                });
            }
        } catch (error) {
            console.error("AI Breakdown Error", error);
            console.error("Error Response:", error.response?.data);
            
            // Even on error, set default suggestions so user can still use the feature
            setAiSuggestions({
                steps: [
                    { step: "Plan and analyze requirements", estimateHours: "2", difficulty: "medium" },
                    { step: "Design the solution", estimateHours: "3", difficulty: "medium" },
                    { step: "Implement the solution", estimateHours: "5", difficulty: "high" },
                    { step: "Test and verify", estimateHours: "2", difficulty: "medium" }
                ],
                overallEstimateHours: 12,
                suggestedPriority: "high"
            });
            
            // Show a friendly message instead of error
            console.log("Using default breakdown suggestions");
        } finally {
            setIsAiLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto" style={{ paddingTop: '2rem' }}>
            <div className="w-full max-w-2xl glass rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 my-8 animate-fadeIn max-h-[90vh] flex flex-col">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1">
                <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title with AI Button */}
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            <Input
                                label="Task Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Fix Navigation Bug"
                                required
                            />
                        </div>
                        <div className="pt-7">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleAiBreakdown}
                                disabled={isAiLoading || !formData.title}
                                className="flex items-center whitespace-nowrap"
                            >
                                {isAiLoading ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 mr-1" />
                                        <span className="hidden sm:inline">AI Help</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                            placeholder="Detailed explanation of the task..."
                        />
                    </div>

                    {/* AI Suggestions */}
                    {aiSuggestions && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                            <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3 flex items-center">
                                <Sparkles size={16} className="mr-2" />
                                AI Suggestions
                            </h4>
                            <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-300">
                                {aiSuggestions.steps?.map((step, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <span className="font-bold mr-2 text-purple-600 dark:text-purple-400">{idx + 1}.</span>
                                        <div className="flex-1">
                                            <span className="font-medium">{step.step}</span>
                                            {step.estimateHours && (
                                                <span className="text-xs text-purple-600 dark:text-purple-400 ml-2">
                                                    (~{step.estimateHours}h)
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {aiSuggestions.overallEstimateHours && (
                                <p className="mt-3 text-xs font-bold text-purple-700 dark:text-purple-400 pt-3 border-t border-purple-200 dark:border-purple-800">
                                    Total Estimated Time: ~{aiSuggestions.overallEstimateHours} hours
                                </p>
                            )}
                        </div>
                    )}

                    {/* Priority and Due Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Due Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                            <TagIcon size={16} className="mr-2" />
                            Tags (comma separated)
                        </label>
                        <Input
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="frontend, bug, urgent"
                        />
                    </div>

                    {/* Subtasks */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Subtasks
                            </label>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={addSubtask}
                                className="text-xs"
                            >
                                <Plus size={14} className="mr-1" />
                                Add Subtask
                            </Button>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {formData.subtasks.map((subtask, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={subtask.completed}
                                        onChange={(e) => updateSubtask(index, 'completed', e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <Input
                                        value={subtask.title}
                                        onChange={(e) => updateSubtask(index, 'title', e.target.value)}
                                        placeholder="Subtask title..."
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeSubtask(index)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {formData.subtasks.length === 0 && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                    No subtasks. Click "Add Subtask" to create one.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Dependencies */}
                    {availableTasks.length > 0 && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                                <Link2 size={16} className="mr-2" />
                                Dependencies (Link to other tasks)
                            </label>
                            <div className="max-h-24 overflow-y-auto space-y-1 border border-slate-200 dark:border-slate-700 rounded-xl p-2">
                                {availableTasks.map((t) => (
                                    <label key={t._id} className="flex items-center space-x-2 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.dependencies.includes(t._id)}
                                            onChange={() => toggleDependency(t._id)}
                                            className="w-4 h-4 text-indigo-600 rounded"
                                        />
                                        <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">
                                            {t.title}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            t.status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                                            t.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                            'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>
                                            {t.status}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Estimated Time */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                            <Clock size={16} className="mr-2" />
                            Estimated Time (minutes)
                        </label>
                        <Input
                            type="number"
                            name="estimatedTime"
                            value={formData.estimatedTime}
                            onChange={handleChange}
                            placeholder="60"
                            min="0"
                        />
                    </div>

                    {/* File Attachments */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
                            <File size={16} className="mr-2" />
                            Attachments
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors bg-white dark:bg-slate-800">
                                <File size={18} className="mr-2 text-slate-400" />
                                <span className="text-sm text-slate-600 dark:text-slate-400">Click to upload files</span>
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload-input"
                                />
                            </label>
                            {attachments.length > 0 && (
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {attachments.map((att, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                                                <File size={16} className="text-slate-400 flex-shrink-0" />
                                                <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                                                    {att.originalName}
                                                </span>
                                                <span className="text-xs text-slate-500 flex-shrink-0">
                                                    ({(att.size / 1024).toFixed(1)} KB)
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    removeAttachment(index);
                                                }}
                                                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex-shrink-0 ml-2"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </form>
                </div>

                {/* Footer - Fixed */}
                <div className="flex justify-end pt-4 pb-6 px-6 space-x-3 border-t border-slate-200/50 dark:border-slate-700/50 flex-shrink-0 bg-white dark:bg-slate-900 rounded-b-2xl">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                        type="button" 
                        variant="primary" 
                        disabled={isLoading} 
                        onClick={() => {
                            if (formRef.current) {
                                formRef.current.requestSubmit();
                            }
                        }}
                    >
                        {isLoading ? 'Saving...' : (task ? 'Save Changes' : 'Create Task')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
