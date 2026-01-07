import { useState, useContext, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu, Search, Bell, UserCircle, Plus, Settings, LogOut, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';

const DashboardLayout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [notificationsError, setNotificationsError] = useState('');
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const notificationsRef = useRef(null);
    const profileMenuRef = useRef(null);

    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const buildNotificationsFromTasks = (tasks) => {
        const today = startOfDay(new Date());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const inDays = (date, days) => {
            const end = new Date(today);
            end.setDate(end.getDate() + days);
            return date >= today && date < end;
        };

        const items = [];

        for (const t of tasks) {
            if (!t || t.status === 'done' || !t.dueDate) continue;

            const due = new Date(t.dueDate);
            if (Number.isNaN(due.getTime())) continue;

            const dueDay = startOfDay(due);

            if (dueDay < today) {
                items.push({
                    id: `overdue-${t._id}`,
                    type: 'overdue',
                    title: 'Overdue task',
                    message: t.title,
                    date: dueDay,
                    href: '/tasks',
                });
                continue;
            }

            if (dueDay >= today && dueDay < tomorrow) {
                items.push({
                    id: `today-${t._id}`,
                    type: 'today',
                    title: 'Due today',
                    message: t.title,
                    date: dueDay,
                    href: '/tasks',
                });
                continue;
            }

            if (inDays(dueDay, 4)) {
                items.push({
                    id: `upcoming-${t._id}`,
                    type: 'upcoming',
                    title: 'Upcoming deadline',
                    message: t.title,
                    date: dueDay,
                    href: '/tasks',
                });
            }
        }

        const typeOrder = { overdue: 0, today: 1, upcoming: 2 };
        items.sort((a, b) => {
            const ao = typeOrder[a.type] ?? 99;
            const bo = typeOrder[b.type] ?? 99;
            if (ao !== bo) return ao - bo;
            return a.date.getTime() - b.date.getTime();
        });

        return items.slice(0, 10);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results or filter
            console.log('Searching for:', searchQuery);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Load notifications when dropdown opens
    useEffect(() => {
        const load = async () => {
            if (!notificationsOpen) return;
            if (!user?.token) {
                setNotifications([]);
                setNotificationsError('Please login to see notifications.');
                return;
            }

            setNotificationsLoading(true);
            setNotificationsError('');
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get('http://localhost:5000/api/tasks', config);
                setNotifications(buildNotificationsFromTasks(Array.isArray(data) ? data : []));
            } catch (err) {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Failed to load notifications';
                setNotifications([]);
                setNotificationsError(msg);
            } finally {
                setNotificationsLoading(false);
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notificationsOpen, user?.token]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const notificationCount = notifications.length;
    const typeStyles = {
        overdue: {
            dot: 'bg-red-500',
            title: 'text-red-700 dark:text-red-400',
        },
        today: {
            dot: 'bg-amber-500',
            title: 'text-amber-700 dark:text-amber-400',
        },
        upcoming: {
            dot: 'bg-blue-500',
            title: 'text-blue-700 dark:text-blue-400',
        },
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden md:ml-72 transition-all duration-300">
                {/* Top Navigation Bar */}
                <header className="h-16 glass border-b border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between px-4 sm:px-6 z-10">
                    <div className="flex items-center flex-1 space-x-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <Menu size={24} className="text-slate-700 dark:text-slate-300" />
                        </button>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search tasks, notes, projects..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Quick Add Button */}
                        <button
                            onClick={() => navigate('/tasks')}
                            className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all font-medium text-sm"
                        >
                            <Plus size={18} />
                            <span>New Task</span>
                        </button>

                        {/* Notifications */}
                        <div className="relative" ref={notificationsRef}>
                            <button 
                                onClick={() => setNotificationsOpen((v) => !v)}
                                className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <Bell size={20} className="text-slate-700 dark:text-slate-300" />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                        {notificationCount > 9 ? '9+' : notificationCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {notificationsOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setNotificationsOpen(false)}
                                    ></div>
                                    {/* Dropdown */}
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 animate-fadeIn">
                                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 rounded-t-2xl">
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Notifications</h3>
                                            <button
                                                onClick={() => setNotificationsOpen(false)}
                                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                            >
                                                <X size={16} className="text-slate-600 dark:text-slate-400" />
                                            </button>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto bg-white dark:bg-slate-800 rounded-b-2xl">
                                            <div className="p-2">
                                                {notificationsLoading ? (
                                                    <div className="p-4 text-center">
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Loading notifications...
                                                        </p>
                                                    </div>
                                                ) : notificationsError ? (
                                                    <div className="p-4">
                                                        <p className="text-sm text-red-600 dark:text-red-400">
                                                            {notificationsError}
                                                        </p>
                                                    </div>
                                                ) : notificationCount === 0 ? (
                                                    <div className="p-4 text-center py-8">
                                                        <Bell size={32} className="text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                                                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                                                            No new notifications
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="p-2 space-y-1">
                                                        {notifications.map((n) => {
                                                            const s = typeStyles[n.type] || typeStyles.upcoming;
                                                            return (
                                                                <button
                                                                    key={n.id}
                                                                    onClick={() => {
                                                                        setNotificationsOpen(false);
                                                                        navigate(n.href);
                                                                    }}
                                                                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors"
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <span className={`mt-1.5 w-2.5 h-2.5 rounded-full ${s.dot}`} />
                                                                        <div className="min-w-0 flex-1">
                                                                            <div className={`text-sm font-bold ${s.title}`}>
                                                                                {n.title}
                                                                            </div>
                                                                            <div className="text-sm text-slate-700 dark:text-slate-200 truncate">
                                                                                {n.message}
                                                                            </div>
                                                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                                                Due: {n.date.toLocaleDateString()}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                        <div className="pt-2">
                                                            <button
                                                                onClick={() => {
                                                                    setNotificationsOpen(false);
                                                                    navigate('/tasks');
                                                                }}
                                                                className="w-full px-3 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors"
                                                            >
                                                                View all tasks
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* User Avatar */}
                        <div className="relative" ref={profileMenuRef}>
                            <button 
                                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                                    {user?.name ? (
                                        user.name.charAt(0).toUpperCase()
                                    ) : (
                                        <UserCircle size={20} />
                                    )}
                                </div>
                            </button>

                            {/* Profile Menu Dropdown */}
                            {profileMenuOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setProfileMenuOpen(false)}
                                    ></div>
                                    {/* Dropdown */}
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 animate-fadeIn">
                                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-2xl">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                                        {user?.name || 'User'}
                                                    </p>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                                        {user?.email || ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 bg-white dark:bg-slate-800 rounded-b-2xl">
                                            <button
                                                onClick={() => {
                                                    navigate('/settings');
                                                    setProfileMenuOpen(false);
                                                }}
                                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                                            >
                                                <User size={18} />
                                                <span>View Profile</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigate('/settings');
                                                    setProfileMenuOpen(false);
                                                }}
                                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                                            >
                                                <Settings size={18} />
                                                <span>Settings</span>
                                            </button>
                                            <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                                            >
                                                <LogOut size={18} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
