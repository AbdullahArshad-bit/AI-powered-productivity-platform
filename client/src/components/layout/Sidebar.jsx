import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import { 
    LayoutDashboard, 
    CheckSquare, 
    FileText, 
    Bot, 
    LogOut, 
    X, 
    Moon, 
    Sun,
    Calendar,
    Tag,
    FolderKanban,
    Settings,
    Sparkles
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout, user } = useContext(AuthContext);
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useDarkMode();

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
        { name: 'Tasks', path: '/tasks', icon: CheckSquare, color: 'text-green-500' },
        { name: 'Projects', path: '/projects', icon: FolderKanban, color: 'text-purple-500' },
        { name: 'Notes', path: '/notes', icon: FileText, color: 'text-yellow-500' },
        { name: 'Calendar', path: '/calendar', icon: Calendar, color: 'text-red-500' },
        { name: 'AI Assistant', path: '/chat', icon: Bot, color: 'text-indigo-500' },
        { name: 'Tags', path: '/tags', icon: Tag, color: 'text-pink-500' },
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };


    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            ></div>

            {/* Sidebar Content */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 glass border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/dashboard" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    AI Assistant
                                </h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Task & Knowledge</p>
                            </div>
                        </Link>
                        <button
                            onClick={onClose}
                            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => window.innerWidth < 768 && onClose()}
                                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    active
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                }`}
                            >
                                <Icon
                                    size={20}
                                    className={`${active ? 'text-white' : item.color} transition-transform group-hover:scale-110`}
                                />
                                <span className={`font-medium ${active ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {item.name}
                                </span>
                                {active && (
                                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-2">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        {darkMode ? (
                            <Sun size={20} className="text-yellow-500" />
                        ) : (
                            <Moon size={20} className="text-slate-500" />
                        )}
                        <span className="font-medium">Dark Mode</span>
                    </button>

                    {/* Settings */}
                    <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                    >
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </Link>

                    {/* User Profile */}
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {user?.email || 'user@example.com'}
                            </p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
