import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ArrowLeft, Shield, Lock, Eye, FileText, Sparkles } from 'lucide-react';

const PrivacyPolicyPage = () => {
    const sections = [
        {
            title: 'Information We Collect',
            content: 'We collect information that you provide directly to us, including your name, email address, and any content you create within the application (tasks, notes, projects). We also collect usage data to improve our services.'
        },
        {
            title: 'How We Use Your Information',
            content: 'We use your information to provide, maintain, and improve our services. This includes processing your tasks, generating AI-powered insights, and personalizing your experience. We do not sell your personal information to third parties.'
        },
        {
            title: 'Data Security',
            content: 'We implement industry-standard security measures to protect your data. All data is encrypted in transit and at rest. We use secure authentication methods and regularly update our security practices.'
        },
        {
            title: 'Data Storage',
            content: 'Your data is stored securely in MongoDB Atlas cloud database. We retain your data as long as your account is active. You can delete your account and all associated data at any time.'
        },
        {
            title: 'Your Rights',
            content: 'You have the right to access, update, or delete your personal information at any time. You can export your data, modify your account settings, or request account deletion through the application settings.'
        },
        {
            title: 'Cookies and Tracking',
            content: 'We use essential cookies to maintain your session and provide core functionality. We do not use tracking cookies or share your data with advertising networks.'
        },
        {
            title: 'Third-Party Services',
            content: 'We use third-party services (MongoDB Atlas for data storage, AI providers for assistant features) that are necessary for the application to function. These services are bound by their own privacy policies and security standards.'
        },
        {
            title: 'Changes to This Policy',
            content: 'We may update this privacy policy from time to time. We will notify you of any significant changes by email or through the application. Your continued use of the service constitutes acceptance of the updated policy.'
        }
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
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                        Privacy <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Policy</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-4">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Policy Content */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="glass rounded-3xl p-12 border border-slate-200/50 dark:border-slate-700/50">
                        <div className="space-y-8">
                            {sections.map((section, idx) => (
                                <div key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
                                    <div className="flex items-start space-x-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                                            {idx === 0 && <FileText className="w-5 h-5" />}
                                            {idx === 1 && <Eye className="w-5 h-5" />}
                                            {idx === 2 && <Lock className="w-5 h-5" />}
                                            {idx === 3 && <Shield className="w-5 h-5" />}
                                            {idx > 3 && <FileText className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                                                {section.title}
                                            </h2>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {section.content}
                                            </p>
                                        </div>
                                    </div>
                                    {idx < sections.length - 1 && (
                                        <div className="border-b border-slate-200 dark:border-slate-700 mt-8"></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Contact Section */}
                        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                                Questions About Privacy?
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/contact">
                                    <Button variant="primary">
                                        Contact Us
                                    </Button>
                                </Link>
                                <a href="mailto:privacy@aitaskassistant.com">
                                    <Button variant="secondary">
                                        privacy@aitaskassistant.com
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicyPage;
