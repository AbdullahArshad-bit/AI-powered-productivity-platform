import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ArrowLeft, Users, Target, Heart, Zap, Shield, Sparkles } from 'lucide-react';

const AboutPage = () => {
    const values = [
        {
            icon: <Zap className="w-8 h-8" />,
            title: 'Innovation',
            description: 'We constantly innovate to bring you the latest AI-powered productivity tools'
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: 'Security',
            description: 'Your data is encrypted and secure. Privacy is our top priority'
        },
        {
            icon: <Heart className="w-8 h-8" />,
            title: 'User-First',
            description: 'Everything we build is designed with our users in mind'
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: 'Excellence',
            description: 'We strive for excellence in every feature and interaction'
        }
    ];

    const team = [
        { name: 'AI Technology', role: 'Powered by advanced AI models' },
        { name: 'Product Team', role: 'Dedicated to your productivity' },
        { name: 'Support Team', role: 'Always here to help' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800">
            {/* Navigation */}
            <nav className="glass border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">AI Task Assistant</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Link to="/">
                                <Button variant="ghost">
                                    <ArrowLeft size={16} className="mr-2" />
                                    Back to Home
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="primary">Login</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center animate-fadeIn">
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                        About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Us</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        We're on a mission to revolutionize productivity with the power of Artificial Intelligence
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="glass rounded-3xl p-12 border border-slate-200/50 dark:border-slate-700/50 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                                    Our Mission
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                    At AI Task Assistant, we believe that everyone deserves to work smarter, not harder. 
                                    Our platform combines the power of artificial intelligence with intuitive design to 
                                    help you manage your tasks, projects, and knowledge effortlessly.
                                </p>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    We're committed to making productivity accessible to everyone, whether you're a student, 
                                    professional, or entrepreneur. With AI-powered insights and smart automation, we help you 
                                    focus on what matters most.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                                    <Users className="w-12 h-12 mb-4" />
                                    <div className="text-3xl font-bold mb-2">10K+</div>
                                    <div className="text-indigo-100">Active Users</div>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
                                    <Target className="w-12 h-12 mb-4" />
                                    <div className="text-3xl font-bold mb-2">50K+</div>
                                    <div className="text-blue-100">Tasks Managed</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                                    <Zap className="w-12 h-12 mb-4" />
                                    <div className="text-3xl font-bold mb-2">99%</div>
                                    <div className="text-green-100">Satisfaction</div>
                                </div>
                                <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white">
                                    <Sparkles className="w-12 h-12 mb-4" />
                                    <div className="text-3xl font-bold mb-2">24/7</div>
                                    <div className="text-pink-100">AI Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                            Our Values
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            What drives us every day
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, idx) => (
                            <div
                                key={idx}
                                className="glass rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 text-center card-hover animate-fadeIn"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 text-white">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                            Built With Care
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Our dedicated team works tirelessly to bring you the best experience
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, idx) => (
                            <div
                                key={idx}
                                className="glass rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 text-center card-hover animate-fadeIn"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                                    {member.name.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {member.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="glass rounded-3xl p-12 border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        <h2 className="text-4xl font-bold mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-indigo-100 mb-8">
                            Join thousands of users boosting their productivity
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register">
                                <Button variant="secondary" className="text-lg px-8 py-4 bg-white text-indigo-600 hover:bg-indigo-50">
                                    Sign Up Free
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="ghost" className="text-lg px-8 py-4 text-white border-2 border-white/30 hover:bg-white/10">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
