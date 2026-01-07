import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import { 
    ArrowRight, 
    Sparkles, 
    CheckCircle2, 
    Zap, 
    Shield, 
    Calendar,
    FolderKanban,
    MessageSquare,
    BarChart3,
    Users,
    Star,
    TrendingUp,
    Clock,
    Target,
    Brain,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';

const HomePage = () => {
    const [scrollY, setScrollY] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle hash navigation on mount and when hash changes
    useEffect(() => {
        const scrollToHash = () => {
            const hash = location.hash || window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    // Account for fixed navbar
                    const navHeight = 64;
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - navHeight;
                    
                    setTimeout(() => {
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }
        };

        // Scroll on mount if hash exists
        scrollToHash();

        // Also listen for hash changes
        window.addEventListener('hashchange', scrollToHash);
        return () => window.removeEventListener('hashchange', scrollToHash);
    }, [location]);

    const handleNavClick = (e, hash) => {
        e.preventDefault();
        if (location.pathname !== '/') {
            // If not on home page, navigate to home with hash
            navigate(`/${hash}`);
        } else {
            // If already on home page, just scroll
            const element = document.querySelector(hash);
            if (element) {
                // Account for fixed navbar
                const navHeight = 64; // h-16 = 64px
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };

    const features = [
        {
            icon: <Brain className="w-8 h-8" />,
            title: 'AI-Powered Assistant',
            description: 'Get intelligent task breakdowns and productivity insights powered by advanced AI',
            color: 'from-purple-500 to-pink-600'
        },
        {
            icon: <FolderKanban className="w-8 h-8" />,
            title: 'Smart Kanban Board',
            description: 'Organize tasks with drag-and-drop interface. Visualize your workflow effortlessly',
            color: 'from-blue-500 to-cyan-600'
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: 'Calendar Integration',
            description: 'View all your tasks on a beautiful calendar. Never miss a deadline again',
            color: 'from-green-500 to-emerald-600'
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: 'Project Management',
            description: 'Organize tasks into projects. Track progress and collaborate effectively',
            color: 'from-orange-500 to-red-600'
        },
        {
            icon: <MessageSquare className="w-8 h-8" />,
            title: 'Knowledge Base',
            description: 'Store and organize your notes. AI helps you find information quickly',
            color: 'from-indigo-500 to-purple-600'
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: 'Analytics & Insights',
            description: 'Track your productivity with detailed analytics and progress reports',
            color: 'from-pink-500 to-rose-600'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Active Users' },
        { number: '50K+', label: 'Tasks Completed' },
        { number: '99%', label: 'Satisfaction Rate' },
        { number: '24/7', label: 'AI Support' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">AI Task Assistant</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a 
                                href="#features" 
                                onClick={(e) => handleNavClick(e, '#features')}
                                className="text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                            >
                                Features
                            </a>
                            <a 
                                href="#about" 
                                onClick={(e) => handleNavClick(e, '#about')}
                                className="text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
                            >
                                About
                            </a>
                            <Link to="/contact" className="text-slate-700 hover:text-indigo-600 transition-colors">Contact</Link>
                            <Link to="/login" className="text-slate-700 hover:text-indigo-600 transition-colors">Login</Link>
                            <Link to="/register">
                                <Button variant="primary" className="shadow-lg shadow-indigo-500/20">
                                    Get Started <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto text-center">
                    <div className="animate-fadeIn">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 mb-6 animate-pulse-slow">
                            <Sparkles className="w-4 h-4 mr-2" />
                            <span className="text-sm font-semibold">AI-Powered Productivity Platform</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                            Manage Your Work with
                            <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Intelligent AI
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Streamline your workflow, break down complex tasks, and organize your knowledge with our AI-powered assistant. 
                            Everything you need to stay productive in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <Link to="/register">
                                <Button variant="primary" className="text-lg px-8 py-4 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all">
                                    Start Free Trial <ArrowRight size={20} className="ml-2" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="secondary" className="text-lg px-8 py-4">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image/Demo */}
                    <div className="mt-16 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <div className="glass rounded-3xl p-8 shadow-2xl border border-slate-200/50 max-w-5xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                                    <Brain className="w-12 h-12 mb-4" />
                                    <h3 className="font-bold text-lg mb-2">AI Assistant</h3>
                                    <p className="text-indigo-100 text-sm">Get intelligent help with your tasks</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
                                    <FolderKanban className="w-12 h-12 mb-4" />
                                    <h3 className="font-bold text-lg mb-2">Kanban Board</h3>
                                    <p className="text-blue-100 text-sm">Visual task management</p>
                                </div>
                                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                                    <Calendar className="w-12 h-12 mb-4" />
                                    <h3 className="font-bold text-lg mb-2">Calendar View</h3>
                                    <p className="text-green-100 text-sm">Never miss deadlines</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-slate-600text-slate-400 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-fadeIn">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900text-slate-100 mb-4">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-slate-600text-slate-400 max-w-2xl mx-auto">
                            Everything you need to manage your tasks, projects, and knowledge in one place
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="glass rounded-2xl p-8 border border-slate-200/50 hover:shadow-2xl transition-all card-hover animate-fadeIn"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-white shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900text-slate-100 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="animate-fadeIn">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900text-slate-100 mb-6">
                                Why Choose <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI Task Assistant?</span>
                            </h2>
                            <p className="text-lg text-slate-600text-slate-400 mb-6 leading-relaxed">
                                We combine cutting-edge AI technology with intuitive design to create the most powerful 
                                productivity platform available. Whether you're managing personal tasks or team projects, 
                                we've got you covered.
                            </p>
                            <div className="space-y-4">
                                {[
                                    'AI-powered task breakdown and suggestions',
                                    'Beautiful, intuitive interface',
                                    'Secure cloud storage',
                                    'Real-time collaboration ready',
                                    'Works on all devices'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                            <div className="glass rounded-3xl p-8 border border-slate-200/50border-slate-700/50">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl">
                                        <div className="text-4xl font-bold text-indigo-600text-indigo-400 mb-2">10K+</div>
                                        <div className="text-slate-600text-slate-400">Happy Users</div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl">
                                        <div className="text-4xl font-bold text-blue-600text-blue-400 mb-2">50K+</div>
                                        <div className="text-slate-600text-slate-400">Tasks Done</div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl">
                                        <div className="text-4xl font-bold text-green-600text-green-400 mb-2">99%</div>
                                        <div className="text-slate-600text-slate-400">Satisfaction</div>
                                    </div>
                                    <div className="text-center p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-2xl">
                                        <div className="text-4xl font-bold text-pink-600text-pink-400 mb-2">24/7</div>
                                        <div className="text-slate-600text-slate-400">AI Support</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900text-slate-100 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-slate-600text-slate-400">
                            Get started in minutes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Sign Up Free', desc: 'Create your account in seconds. No credit card required.' },
                            { step: '2', title: 'Add Your Tasks', desc: 'Start adding tasks. Use AI to break down complex work.' },
                            { step: '3', title: 'Stay Productive', desc: 'Track progress, meet deadlines, and achieve your goals.' }
                        ].map((item, idx) => (
                            <div key={idx} className="text-center animate-fadeIn" style={{ animationDelay: `${idx * 0.2}s` }}>
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                                    {item.step}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900text-slate-100 mb-3">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600text-slate-400">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="glass rounded-3xl p-12 border border-slate-200/50border-slate-700/50 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Boost Your Productivity?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-8">
                            Join thousands of users who are already managing their work smarter with AI
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button variant="secondary" className="text-lg px-8 py-4 bg-white text-indigo-600 hover:bg-indigo-50">
                                    Get Started Free <ArrowRight size={20} className="ml-2" />
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="ghost" className="text-lg px-8 py-4 text-white border-2 border-white/30 hover:bg-white/10">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-white">AI Task Assistant</span>
                            </div>
                            <p className="text-slate-400 text-sm">
                                Your intelligent productivity companion powered by AI
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a 
                                        href="#features" 
                                        onClick={(e) => handleNavClick(e, '#features')}
                                        className="hover:text-indigo-400 transition-colors cursor-pointer"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="#about" 
                                        onClick={(e) => handleNavClick(e, '#about')}
                                        className="hover:text-indigo-400 transition-colors cursor-pointer"
                                    >
                                        About
                                    </a>
                                </li>
                                <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                                <li><Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Get Started</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Sign Up</Link></li>
                                <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Login</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
                        <p>&copy; {new Date().getFullYear()} AI Task Assistant. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
