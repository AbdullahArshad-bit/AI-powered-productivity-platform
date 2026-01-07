import { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatPage = () => {
    const [messages, setMessages] = useState([
        { 
            role: 'assistant', 
            content: "Hello! I'm your AI assistant. I can help you with:\n\n- Organizing and managing your tasks\n- Answering questions about your notes\n- Providing insights and suggestions\n- Breaking down complex tasks\n\nHow can I help you today?" 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
            };

            console.log('Sending chat request with', messages.length + 1, 'messages');
            const { data } = await axios.post('http://localhost:5000/api/ai/chat', {
                messages: [...messages, userMsg],
                contextRefs: {}
            }, config);

            console.log('Received AI response:', data);
            
            // Ensure response has correct format
            if (data && data.role && data.content) {
                setMessages(prev => [...prev, data]);
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (error) {
            console.error("Chat Error", error);
            console.error("Error Response:", error.response?.data);
            const errorMessage = error.response?.data?.message || error.message || "Sorry, I encountered an error. Please try again.";
            
            // Check if it's a quota/billing issue
            const isQuotaError = errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('billing');
            
            let helpfulMessage = '';
            if (isQuotaError) {
                helpfulMessage = `I see there's a billing/quota issue with your OpenAI account. The API key is valid, but you need to:\n\n1. Go to https://platform.openai.com/account/billing\n2. Add a payment method (card)\n3. Add credits or set up pay-as-you-go\n\n**In the meantime**, I'm using enhanced responses to help you! Ask me about tasks, notes, or productivity tips.`;
            } else {
                helpfulMessage = `I apologize, but I'm having trouble right now: ${errorMessage}\n\n**Note**: Your API key is configured. If you're seeing quota errors, please check your OpenAI billing settings.\n\nI can still help you with questions about tasks, notes, and productivity!`;
            }
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: helpfulMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-8rem)] glass rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center">
                                AI Assistant
                                <Sparkles className="w-4 h-4 ml-2 text-purple-500" />
                            </h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Powered by advanced AI to help you manage tasks and knowledge
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30 dark:bg-slate-900/30">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                        >
                            <div className={`flex items-start space-x-3 max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                {/* Avatar */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                            : 'bg-gradient-to-br from-purple-500 to-pink-600'
                                    }`}
                                >
                                    {msg.role === 'user' ? (
                                        <User className="w-4 h-4 text-white" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-white" />
                                    )}
                                </div>

                                {/* Message Content */}
                                <div
                                    className={`rounded-2xl px-4 py-3 ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none'
                                            : 'glass border border-slate-200/50 dark:border-slate-700/50 text-slate-900 dark:text-slate-100 rounded-bl-none'
                                    }`}
                                >
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-slate dark:prose-invert max-w-none text-sm">
                                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && (
                        <div className="flex justify-start animate-fadeIn">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="glass rounded-2xl rounded-bl-none px-4 py-3 border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        <span className="text-sm italic">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-800">
                    <form onSubmit={handleSend} className="flex space-x-3">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your tasks, notes, or get AI suggestions..."
                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isLoading || !input.trim()}
                            className="px-6 shadow-lg shadow-indigo-500/20"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <Send size={20} />
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ChatPage;
