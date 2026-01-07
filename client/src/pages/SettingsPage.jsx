import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AuthContext from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import axios from 'axios';
import { 
    User, 
    Mail, 
    Lock, 
    Bell, 
    Moon, 
    Sun, 
    Trash2, 
    Save, 
    Eye, 
    EyeOff,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';

const SettingsPage = () => {
    const { user, logout, updateUser } = useContext(AuthContext);
    const { darkMode, toggleDarkMode } = useDarkMode();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // Profile settings
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    // Password change
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        taskReminders: true,
        projectUpdates: true,
        weeklyReports: false
    });

    useEffect(() => {
        // Load user settings from backend
        const fetchSettings = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };
                const { data } = await axios.get('http://localhost:5000/api/auth/settings', config);
                if (data.notifications) {
                    setNotifications(data.notifications);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
                // Fallback to localStorage
                const savedNotifications = localStorage.getItem('notificationSettings');
                if (savedNotifications) {
                    setNotifications(JSON.parse(savedNotifications));
                }
            }
        };

        if (user?.token) {
            fetchSettings();
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };

            console.log('Updating profile:', { name: profileData.name, token: user.token ? 'present' : 'missing' });

            const { data } = await axios.put(
                'http://localhost:5000/api/auth/profile',
                { name: profileData.name },
                config
            );

            console.log('Profile update response:', data);

            // Update user in context
            if (data.user) {
                updateUser({ name: data.user.name });
            }
            
            setMessage({ type: 'success', text: data.message || 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Profile update error:', error);
            console.error('Error response:', error.response);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || error.message || 'Failed to update profile' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        setIsLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };

            console.log('Changing password:', { 
                hasCurrentPassword: !!passwordData.currentPassword,
                hasNewPassword: !!passwordData.newPassword,
                token: user.token ? 'present' : 'missing'
            });

            const { data } = await axios.put(
                'http://localhost:5000/api/auth/password',
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                config
            );

            console.log('Password change response:', data);

            setMessage({ type: 'success', text: data.message || 'Password changed successfully!' });
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error('Password change error:', error);
            console.error('Error response:', error.response);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || error.message || 'Failed to change password' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleNotificationChange = async (key) => {
        const updated = { ...notifications, [key]: !notifications[key] };
        setNotifications(updated);
        
        // Save to backend
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            };

            await axios.put(
                'http://localhost:5000/api/auth/settings',
                { notifications: updated },
                config
            );
            
            // Also save to localStorage as backup
            localStorage.setItem('notificationSettings', JSON.stringify(updated));
        } catch (error) {
            console.error('Error updating notifications:', error);
            // Revert on error
            setNotifications(notifications);
            setMessage({ 
                type: 'error', 
                text: 'Failed to update notification settings' 
            });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };


    const handleDeleteAccount = async () => {
        try {
            if (!user?.token) {
                setMessage({ type: 'error', text: 'Please login again to delete your account.' });
                return;
            }

            const ok = window.confirm(
                'Are you sure you want to delete your account? This will permanently delete your data and cannot be undone.'
            );
            if (!ok) return;

            const typed = window.prompt('Type DELETE to confirm account deletion:');
            if (typed !== 'DELETE') {
                setMessage({ type: 'error', text: 'Account deletion cancelled (confirmation text did not match).' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                return;
            }

            setIsLoading(true);
            setMessage({ type: '', text: '' });

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.delete('http://localhost:5000/api/auth/me', config);

            logout();
            navigate('/');
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || error.message || 'Failed to delete account',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'password', label: 'Password', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'appearance', label: 'Appearance', icon: darkMode ? Moon : Sun },
    ];

    return (
        <DashboardLayout>
            <div className="p-6 max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Settings
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 animate-fadeIn ${
                        message.type === 'success' 
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                    }`}>
                        {message.type === 'success' ? (
                            <CheckCircle2 className="w-5 h-5" />
                        ) : (
                            <XCircle className="w-5 h-5" />
                        )}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <div className="glass rounded-2xl p-2 border border-slate-200/50 dark:border-slate-700/50">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                                            isActive
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <div className="glass rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                                        Profile Information
                                    </h2>
                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <Input
                                            label="Full Name"
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            placeholder="Enter your email"
                                            required
                                            disabled
                                        />
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Email cannot be changed for security reasons
                                        </p>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={isLoading}
                                            className="w-full sm:w-auto"
                                        >
                                            {isLoading ? (
                                                <>Saving...</>
                                            ) : (
                                                <>
                                                    <Save size={18} className="mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </form>

                                    {/* Danger Zone (Profile) */}
                                    <div className="mt-8 glass rounded-2xl p-6 border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10">
                                        <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2 flex items-center">
                                            <AlertCircle className="w-5 h-5 mr-2" />
                                            Danger Zone
                                        </h3>
                                        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                                            Permanently delete your account and all associated data. This action cannot be undone.
                                        </p>
                                        <Button
                                            variant="secondary"
                                            onClick={handleDeleteAccount}
                                            disabled={isLoading}
                                            className="bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            <Trash2 size={18} className="mr-2" />
                                            Delete Account
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Password Tab */}
                            {activeTab === 'password' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                                        Change Password
                                    </h2>
                                    <form onSubmit={handlePasswordChange} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type={showPasswords.current ? 'text' : 'password'}
                                                    value={passwordData.currentPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                    placeholder="Enter current password"
                                                    required
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                >
                                                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type={showPasswords.new ? 'text' : 'password'}
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                    placeholder="Enter new password (min 8 characters)"
                                                    required
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                >
                                                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type={showPasswords.confirm ? 'text' : 'password'}
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                    placeholder="Confirm new password"
                                                    required
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                                >
                                                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={isLoading}
                                            className="w-full sm:w-auto"
                                        >
                                            {isLoading ? (
                                                <>Updating...</>
                                            ) : (
                                                <>
                                                    <Lock size={18} className="mr-2" />
                                                    Update Password
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                                        Notification Preferences
                                    </h2>
                                    <div className="space-y-4">
                                        {[
                                            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about your account' },
                                            { key: 'taskReminders', label: 'Task Reminders', desc: 'Get reminders for upcoming task deadlines' },
                                            { key: 'projectUpdates', label: 'Project Updates', desc: 'Notifications when projects are updated' },
                                            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly productivity reports' }
                                        ].map((item) => (
                                            <div
                                                key={item.key}
                                                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                                            >
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {item.label}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleNotificationChange(item.key)}
                                                    className={`relative w-14 h-8 rounded-full transition-colors ${
                                                        notifications[item.key]
                                                            ? 'bg-indigo-500'
                                                            : 'bg-slate-300 dark:bg-slate-600'
                                                    }`}
                                                >
                                                    <span
                                                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                                                            notifications[item.key] ? 'translate-x-6' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Appearance Tab */}
                            {activeTab === 'appearance' && (
                                <div className="animate-fadeIn">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                                        Appearance
                                    </h2>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center space-x-4">
                                                {darkMode ? (
                                                    <Moon className="w-6 h-6 text-indigo-500" />
                                                ) : (
                                                    <Sun className="w-6 h-6 text-yellow-500" />
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                                        Dark Mode
                                                    </h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                        {darkMode ? 'Currently using dark theme' : 'Currently using light theme'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={toggleDarkMode}
                                                className={`relative w-14 h-8 rounded-full transition-colors ${
                                                    darkMode
                                                        ? 'bg-indigo-500'
                                                        : 'bg-slate-300 dark:bg-slate-600'
                                                }`}
                                            >
                                                <span
                                                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                                                        darkMode ? 'translate-x-6' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SettingsPage;
