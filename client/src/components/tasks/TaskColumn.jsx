import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const TaskColumn = ({ id, title, tasks, onEdit, onDelete }) => {
    const { setNodeRef } = useDroppable({ id });

    const columnConfigs = {
        'todo': {
            title: 'To Do',
            color: 'from-slate-500 to-slate-600',
            bg: 'bg-slate-50 dark:bg-slate-900/50',
            border: 'border-slate-200 dark:border-slate-800',
            headerBg: 'bg-slate-100 dark:bg-slate-800',
            text: 'text-slate-700 dark:text-slate-300'
        },
        'in-progress': {
            title: 'In Progress',
            color: 'from-blue-500 to-indigo-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            headerBg: 'bg-blue-100 dark:bg-blue-900/30',
            text: 'text-blue-700 dark:text-blue-300'
        },
        'done': {
            title: 'Done',
            color: 'from-green-500 to-emerald-600',
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800',
            headerBg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-700 dark:text-green-300'
        }
    };

    const config = columnConfigs[id] || columnConfigs['todo'];

    return (
        <div className={`flex flex-col min-w-[320px] w-80 rounded-2xl p-4 glass border ${config.border} ${config.bg} h-full transition-all`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.color}`}></div>
                    <h3 className={`font-bold text-sm uppercase tracking-wide ${config.text}`}>
                        {title || config.title}
                    </h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${config.headerBg} ${config.text}`}>
                    {tasks.length}
                </span>
            </div>

            {/* Tasks List */}
            <div ref={setNodeRef} className="flex-1 overflow-y-auto pr-1 space-y-3">
                <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </SortableContext>
                {tasks.length === 0 && (
                    <div className={`h-32 w-full border-2 border-dashed ${config.border} rounded-xl flex items-center justify-center ${config.text} text-sm font-medium opacity-50`}>
                        Drop tasks here
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskColumn;
