import { useState, useEffect, useContext } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import {
    CheckSquare,
    FileText,
    Bot,
    TrendingUp,
    Calendar,
    Clock,
    Target,
    Sparkles,
    ArrowRight,
    Plus,
    Activity
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        tasks: { total: 0, completed: 0, pending: 0, inProgress: 0 },
        notes: 0,
        aiUsage: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            const [tasksRes, notesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/tasks', config).catch(() => ({ data: [] })),
                axios.get('http://localhost:5000/api/notes', config).catch(() => ({ data: [] }))
            ]);

            const tasks = tasksRes.data || [];
            const notes = notesRes.data || [];

            const completed = tasks.filter(t => t.status === 'done').length;
            const pending = tasks.filter(t => t.status === 'todo').length;
            const inProgress = tasks.filter(t => t.status === 'in-progress').length;

            setStats({
                tasks: {
                    total: tasks.length,
                    completed,
                    pending,
                    inProgress
                },
                notes: notes.length,
                aiUsage: 0,
                recentActivity: []
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Tasks',
            value: stats.tasks.total,
            change: '+12%',
            icon: CheckSquare,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400',
            link: '/tasks'
        },
        {
            title: 'Completed',
            value: stats.tasks.completed,
            change: `${stats.tasks.total > 0 ? Math.round((stats.tasks.completed / stats.tasks.total) * 100) : 0}%`,
            icon: Target,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            textColor: 'text-green-600 dark:text-green-400',
            link: '/tasks'
        },
        {
            title: 'In Progress',
            value: stats.tasks.inProgress,
            change: 'Active',
            icon: Activity,
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
            textColor: 'text-yellow-600 dark:text-yellow-400',
            link: '/tasks'
        },
        {
            title: 'Knowledge Notes',
            value: stats.notes,
            change: '+5 new',
            icon: FileText,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            textColor: 'text-purple-600 dark:text-purple-400',
            link: '/notes'
        },
    ];

    const quickActions = [
        { title: 'Create Task', icon: Plus, color: 'bg-blue-500', hoverColor: 'hover:bg-blue-600', link: '/tasks', action: () => navigate('/tasks') },
        { title: 'New Note', icon: FileText, color: 'bg-purple-500', hoverColor: 'hover:bg-purple-600', link: '/notes', action: () => navigate('/notes') },
        { title: 'AI Chat', icon: Bot, color: 'bg-indigo-500', hoverColor: 'hover:bg-indigo-600', link: '/chat', action: () => navigate('/chat') },
        { title: 'Calendar', icon: Calendar, color: 'bg-red-500', hoverColor: 'hover:bg-red-600', link: '/calendar', action: () => navigate('/calendar') },
    ];

    if (loading) {
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
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            Here's what's happening with your tasks and projects today.
                        </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
                        <Sparkles size={20} />
                        <span className="font-semibold">AI Powered</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            onClick={() => navigate(card.link)}
                            className="glass card-hover rounded-2xl p-6 cursor-pointer border border-slate-200/50 dark:border-slate-700/50"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-sm font-semibold ${card.textColor}`}>
                                    {card.change}
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                                {card.value}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {card.title}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-2">
                    <div className="glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Quick Actions</h2>
                            <ArrowRight className="text-slate-400 dark:text-slate-500" size={20} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <button
                                        key={index}
                                        onClick={action.action}
                                        className="flex flex-col items-center justify-center p-6 glass rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:scale-105 transition-all group"
                                    >
                                        <div className={`w-12 h-12 ${action.color} ${action.hoverColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-all shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                                            {action.title}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent Activity / Tips */}
                <div className="space-y-6">
                    {/* Progress Overview */}
                    <div className="glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Progress</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-600 dark:text-slate-400">Tasks Completion</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        {stats.tasks.total > 0 ? Math.round((stats.tasks.completed / stats.tasks.total) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-slate-600 dark:text-slate-400">In Progress</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        {stats.tasks.inProgress}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                    <div
                                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2.5 rounded-full transition-all duration-500"
                                        style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.inProgress / stats.tasks.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Tips */}
                    <div className="glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">AI Tip</h3>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Use AI Assistant to automatically organize your tasks and generate insights from your notes.
                        </p>
                        <button
                            onClick={() => navigate('/chat')}
                            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] transition-all text-sm shadow-md"
                        >
                            Try AI Assistant
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
