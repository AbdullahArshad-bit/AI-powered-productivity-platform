import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DarkModeContext = createContext();

// Public routes where dark mode should not be applied
const PUBLIC_ROUTES = ['/', '/login', '/register', '/verify-email', '/contact', '/about', '/privacy'];

export const DarkModeProvider = ({ children }) => {
    const location = useLocation();
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage first
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            return saved === 'true';
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Check if current route is a public route
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

    useEffect(() => {
        // Only apply dark mode if NOT on a public route
        if (isPublicRoute) {
            // Force light mode on public routes
            document.documentElement.classList.remove('dark');
        } else {
            // Apply dark mode based on state for dashboard routes
            if (darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [darkMode, isPublicRoute, location.pathname]);

    // Save to localStorage when dark mode changes (only for dashboard)
    useEffect(() => {
        if (!isPublicRoute) {
            localStorage.setItem('darkMode', darkMode.toString());
        }
    }, [darkMode, isPublicRoute]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode must be used within DarkModeProvider');
    }
    return context;
};

export default DarkModeContext;
