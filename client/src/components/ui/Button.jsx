const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg border border-transparent focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700",
        secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow-sm focus:ring-slate-400",
        danger: "bg-red-500 hover:bg-red-600 text-white border border-transparent focus:ring-red-500 shadow-md hover:shadow-lg dark:bg-red-600 dark:hover:bg-red-700",
        ghost: "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
        outline: "bg-transparent border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 focus:ring-blue-500"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
