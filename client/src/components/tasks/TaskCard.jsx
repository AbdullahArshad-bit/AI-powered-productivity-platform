import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Tag, MoreVertical, Clock, AlertCircle, CheckCircle2, Link2, File } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task._id, data: task });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const priorityConfigs = {
        low: { color: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', label: 'Low' },
        medium: { color: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', label: 'Medium' },
        high: { color: 'bg-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-400', label: 'High' },
    };

    const priority = priorityConfigs[task.priority] || priorityConfigs.medium;
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="glass rounded-xl p-4 shadow-2xl ring-2 ring-blue-500/50 opacity-90 rotate-2 cursor-grabbing border-2 border-blue-400"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onEdit(task)}
            className="group glass rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg hover:border-blue-400/50 transition-all duration-200 cursor-grab active:cursor-grabbing relative overflow-hidden card-hover"
        >
            {/* Priority Indicator Bar */}
            <div className={`absolute top-0 left-0 w-1 h-full ${priority.color}`}></div>

            <div className="flex justify-between items-start mb-2 pl-2">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-1">
                    {task.title}
                </h3>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                        className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            {task.description && (
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 pl-2 line-clamp-2">
                    {task.description}
                </p>
            )}

            {/* Subtasks */}
            {task.subtasks && task.subtasks.length > 0 && (
                <div className="mb-2 pl-2">
                    <div className="flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400">
                        <CheckCircle2 size={12} />
                        <span>
                            {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length} subtasks
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-1">
                        <div
                            className="bg-green-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Dependencies */}
            {task.dependencies && task.dependencies.length > 0 && (
                <div className="mb-2 pl-2 flex items-center space-x-1 text-xs text-indigo-600 dark:text-indigo-400">
                    <Link2 size={12} />
                    <span>{task.dependencies.length} dependency{task.dependencies.length > 1 ? 'ies' : ''}</span>
                </div>
            )}

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
                <div className="mb-2 pl-2 flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-400">
                    <File size={12} />
                    <span>{task.attachments.length} file{task.attachments.length > 1 ? 's' : ''}</span>
                </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3 pl-2">
                    {task.tags.slice(0, 3).map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        >
                            {tag}
                        </span>
                    ))}
                    {task.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            +{task.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs pl-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3 flex-wrap gap-2">
                    {/* Priority Badge */}
                    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${priority.bg} ${priority.text}`}>
                        {priority.label}
                    </span>

                    {/* Time Tracking */}
                    {(task.timeSpent > 0 || task.estimatedTime > 0) && (
                        <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <Clock size={12} className="mr-1" />
                            {task.timeSpent > 0 && (
                                <span>{Math.round(task.timeSpent)}m</span>
                            )}
                            {task.estimatedTime > 0 && (
                                <span className="ml-1">
                                    / {Math.round(task.estimatedTime)}m
                                </span>
                            )}
                        </div>
                    )}

                    {/* Due Date */}
                    {task.dueDate && (
                        <div className={`flex items-center ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {isOverdue ? (
                                <AlertCircle size={12} className="mr-1" />
                            ) : (
                                <Calendar size={12} className="mr-1" />
                            )}
                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
