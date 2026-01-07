import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Sparkles, ArrowRight, ShieldCheck, Zap, CheckCircle2, XCircle, Eye, EyeOff, Home } from 'lucide-react';
import { validatePassword, getPasswordStrength } from '../../utils/passwordValidator';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [errors, setErrors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '', color: '', percentage: 0 });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError('');
        setErrors([]);

        // Update password strength in real-time
        if (name === 'password') {
            setPasswordStrength(getPasswordStrength(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrors([]);

        // Client-side password validation
        const validation = validatePassword(formData.password);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        setIsLoading(true);
        try {
            const result = await register(formData.name, formData.email, formData.password);
            
            if (result.success) {
                if (result.requiresVerification) {
                    // Navigate to email verification page
                    navigate('/verify-email', { 
                        state: { email: result.email } 
                    });
                } else {
            navigate('/dashboard');
                }
            } else {
                setError(result.error || 'Registration failed');
                if (result.errors) {
                    setErrors(result.errors);
                }
                setIsLoading(false);
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
            setIsLoading(false);
        }
    };

    const passwordRequirements = [
        { check: formData.password.length >= 8, text: 'At least 8 characters' },
        { check: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
        { check: /[a-z]/.test(formData.password), text: 'One lowercase letter' },
        { check: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password), text: 'One special character' },
    ];

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden items-center justify-center p-12 text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

                {/* Animated Background Elements */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10 max-w-lg animate-fadeIn">
                    <div className="mb-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl w-16 h-16 flex items-center justify-center shadow-lg animate-pulse-slow">
                        <Sparkles size={32} className="text-yellow-300" />
                    </div>
                    <h1 className="text-5xl font-bold mb-6 font-display leading-tight animate-slideIn">
                        Join the future of <span className="text-yellow-300">Productivity</span>
                    </h1>
                    <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                        Create an account today and start managing your tasks with the power of Artificial Intelligence.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all card-hover">
                            <Zap className="text-yellow-400 mb-2" size={24} />
                            <h3 className="font-semibold mb-1">Fast & Efficient</h3>
                            <p className="text-sm text-indigo-200">AI-driven workflows speed up your day.</p>
                        </div>
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all card-hover">
                            <ShieldCheck className="text-green-400 mb-2" size={24} />
                            <h3 className="font-semibold mb-1">Secure & Private</h3>
                            <p className="text-sm text-indigo-200">Your data is yours. Always.</p>
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
                        <h2 className="text-3xl font-bold text-slate-900text-slate-100 mb-2">Create Account</h2>
                        <p className="text-slate-600text-slate-400">Get started for free in seconds</p>
                    </div>

                    {error && (
                        <div className={`mb-6 p-4 bg-red-50bg-red-900/20 border border-red-200border-red-800 text-red-600text-red-400 rounded-xl text-sm animate-shake`}>
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    {errors.length > 0 && (
                        <div className="mb-6 p-4 bg-red-50bg-red-900/20 border border-red-200border-red-800 rounded-xl text-sm">
                            <p className="font-semibold text-red-600text-red-400 mb-2">Password Requirements:</p>
                            <ul className="space-y-1">
                                {errors.map((err, idx) => (
                                    <li key={idx} className="text-red-600text-red-400 flex items-center">
                                        <XCircle size={14} className="mr-2" /> {err}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
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
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-slate-600text-slate-400">Password Strength:</span>
                                        <span className={`text-xs font-semibold text-${passwordStrength.color}-600`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200bg-slate-700 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                                            style={{ width: `${passwordStrength.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password Requirements */}
                            {formData.password && (
                                <div className="mt-3 space-y-2">
                                    {passwordRequirements.map((req, idx) => (
                                        <div key={idx} className="flex items-center text-xs">
                                            {req.check ? (
                                                <CheckCircle2 size={14} className="text-green-500 mr-2" />
                                            ) : (
                                                <XCircle size={14} className="text-slate-400 mr-2" />
                                            )}
                                            <span className={req.check ? 'text-green-600text-green-400' : 'text-slate-500text-slate-400'}>
                                                {req.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full py-3 text-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all" 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>Creating Account... <Sparkles className="ml-2 animate-pulse" size={18} /></>
                            ) : (
                                <>Get Started <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-slate-600text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-indigo-600text-indigo-400 hover:text-indigo-700hover:text-indigo-300 hover:underline transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
