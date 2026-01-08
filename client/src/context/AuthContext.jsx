import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// YAHAN APNA VERCEL BACKEND LINK LIKHO (Bina '/' ke end mein)
// Example: 'https://ai-task-assistant.vercel.app'
const API_URL = 'https://ai-powered-productivity-platform-wvsoq4l7h.vercel.app';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            // Yahan humne API_URL variable use kiya hai
            const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password }, config);
            
            // Check if email verification is required
            if (data.requiresVerification) {
                return { 
                    success: false, 
                    error: data.message || 'Please verify your email before logging in',
                    requiresVerification: true,
                    email: data.email
                };
            }
            
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            // Yahan bhi API_URL use kiya
            const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, password }, config);
            
            // If registration requires email verification
            if (data.requiresVerification) {
                return { 
                    success: true, 
                    requiresVerification: true,
                    email: data.email,
                    userId: data.userId
                };
            }
            
            // If user is directly logged in
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || error.message,
                errors: error.response?.data?.errors || []
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    const updateUser = (updatedUserData) => {
        const updatedUser = { ...user, ...updatedUserData };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;