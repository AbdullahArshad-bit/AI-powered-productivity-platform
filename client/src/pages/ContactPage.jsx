import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ArrowLeft, Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            setSubmitted(true);
            setIsSubmitting(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1000);
    };

    const contactInfo = [
        {
            icon: <Mail className="w-6 h-6" />,
            title: 'Email',
            content: 'aipoweredassistant49@gmail.com',
            link: 'mailto:aipoweredassistant49@gmail.com'
        },
        {
            icon: <Phone className="w-6 h-6" />,
            title: 'Phone',
            content: '+92(332)6665102',
            link: 'tel:+92(332)6665102'
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: 'Address',
            content: 'Plot 135, Township Block 5 Twp Sector C2 Lahore',
            link: '#'
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
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                        Get in <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="lg:col-span-1">
                            <div className="glass rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 h-full">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                                    Contact Information
                                </h2>
                                <div className="space-y-6">
                                    {contactInfo.map((info, idx) => (
                                        <div key={idx} className="flex items-start space-x-4 animate-fadeIn" style={{ animationDelay: `${idx * 0.1}s` }}>
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                                                {info.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                                    {info.title}
                                                </h3>
                                                {info.link !== '#' ? (
                                                    <a href={info.link} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                                        {info.content}
                                                    </a>
                                                ) : (
                                                    <p className="text-slate-600 dark:text-slate-400">
                                                        {info.content}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="glass rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                                    Send us a Message
                                </h2>
                                
                                {submitted ? (
                                    <div className="text-center py-12 animate-fadeIn">
                                        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                            <Send className="w-10 h-10 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                            Message Sent!
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                                            Thank you for contacting us. We'll get back to you soon.
                                        </p>
                                        <Button onClick={() => setSubmitted(false)} variant="primary">
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input
                                                label="Your Name"
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                required
                                            />
                                            <Input
                                                label="Your Email"
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                        <Input
                                            label="Subject"
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="How can we help?"
                                            required
                                        />
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={6}
                                                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                                                placeholder="Tell us what's on your mind..."
                                                required
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="w-full py-3 text-lg"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>Sending... <Send className="ml-2 animate-pulse" size={20} /></>
                                            ) : (
                                                <>Send Message <Send size={20} className="ml-2" /></>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
