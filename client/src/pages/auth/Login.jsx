import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { LayoutDashboard, ArrowRight, CheckCircle2, Eye, EyeOff, Sparkles, Home } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const result = await login(formData.email, formData.password);
            
            if (result.success) {
            navigate('/dashboard');
            } else {
                if (result.error?.includes('verify')) {
                    // If email verification required, navigate to verification page
                    navigate('/verify-email', { 
                        state: { email: formData.email } 
                    });
                } else {
                    setError(result.error || 'Login failed');
                    setIsLoading(false);
                }
            }
        } catch (err) {
            setError(err.message || 'Login failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden items-center justify-center p-12 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

                {/* Animated Background Elements */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10 max-w-lg animate-fadeIn">
                    <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg animate-pulse-slow">
                        <LayoutDashboard size={32} className="text-yellow-300" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 font-display leading-tight animate-slideIn">
                        Manage your work with <span className="text-yellow-300">Intelligent AI</span>
                    </h1>
                    <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                        Streamline your workflow, break down complex tasks, and organize your knowledge with our AI-powered assistant.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-indigo-200 hover:text-white transition-colors">
                            <CheckCircle2 className="text-yellow-300" size={20} />
                            <span>Smart Kanban Board</span>
                        </div>
                        <div className="flex items-center space-x-3 text-indigo-200 hover:text-white transition-colors">
                            <CheckCircle2 className="text-yellow-300" size={20} />
                            <span>AI Task Breakdown</span>
                        </div>
                        <div className="flex items-center space-x-3 text-indigo-200 hover:text-white transition-colors">
                            <CheckCircle2 className="text-yellow-300" size={20} />
                            <span>Intelligent Knowledge Base</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl border border-slate-200/50border-slate-700/50 animate-fadeIn">
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/" className="flex items-center text-slate-600text-slate-400 hover:text-indigo-600hover:text-indigo-400 transition-colors">
                            <Home size={18} className="mr-2" />
                            <span className="text-sm">Back to Home</span>
                        </Link>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900text-slate-100 mb-2">Welcome Back</h2>
                        <p className="text-slate-600text-slate-400">Sign in to your account to continue</p>
                    </div>

                    {error && (
                        <div className={`mb-6 p-4 bg-red-50bg-red-900/20 border border-red-200border-red-800 text-red-600text-red-400 rounded-xl text-sm animate-shake`}>
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-slate-700text-slate-300">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-sm text-indigo-600text-indigo-400 hover:text-indigo-700hover:text-indigo-300"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <div className="flex justify-end mt-1">
                                <Link to="#" className="text-sm font-medium text-indigo-600text-indigo-400 hover:text-indigo-700hover:text-indigo-300 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full py-3 text-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>Signing in... <Sparkles className="ml-2 animate-pulse" size={18} /></>
                            ) : (
                                <>Sign In <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-slate-600text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-indigo-600text-indigo-400 hover:text-indigo-700hover:text-indigo-300 hover:underline transition-colors">
                            Create free account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
