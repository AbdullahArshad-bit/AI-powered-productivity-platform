import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Mail, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCodeChange = (index, value) => {
        if (value.length > 1) return; // Only allow single digit
        
        const newCode = [...code];
        newCode[index] = value.replace(/\D/g, ''); // Only numbers
        
        setCode(newCode);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCode = [...code];
        pastedData.split('').forEach((digit, index) => {
            if (index < 6) newCode[index] = digit;
        });
        setCode(newCode);
        if (pastedData.length === 6) {
            document.getElementById('code-5')?.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        
        if (verificationCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        if (!email) {
            setError('Email not found. Please register again.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/verify-email', {
                email,
                code: verificationCode,
            });

            // Save token and user info
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            setSuccess('Email verified successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || 'Invalid verification code. Please try again.');
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            setError('Email not found');
            return;
        }

        setIsResending(true);
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:5000/api/auth/resend-verification', { email });
            setSuccess('Verification code sent! Please check your email.');
            setCode(['', '', '', '', '', '']);
            document.getElementById('code-0')?.focus();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to resend code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 p-4">
            <div className="w-full max-w-md glass p-8 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 animate-fadeIn">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg animate-bounce">
                        <Mail className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Verify Your Email
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        We've sent a 6-digit code to
                    </p>
                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                        {email || 'your email'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm animate-shake">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-xl text-sm flex items-center">
                        <CheckCircle2 className="mr-2" size={20} />
                        {success}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">
                            Enter Verification Code
                        </label>
                        <div className="flex justify-center gap-3">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`code-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-14 h-16 text-center text-2xl font-bold border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                                    disabled={isLoading}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-3 text-lg"
                        disabled={isLoading || code.join('').length !== 6}
                    >
                        {isLoading ? (
                            <>Verifying... <RefreshCw className="ml-2 animate-spin" size={18} /></>
                        ) : (
                            <>Verify Email <ArrowRight size={18} className="ml-2" /></>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    >
                        {isResending ? (
                            <>Sending... <RefreshCw className="ml-2 animate-spin" size={14} /></>
                        ) : (
                            <>Didn't receive code? Resend</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
