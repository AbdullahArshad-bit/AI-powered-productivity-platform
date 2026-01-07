const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">{label}</label>}
            <input
                className={`w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 ${error ? 'border-red-500 dark:border-red-600 focus:border-red-500 dark:focus:border-red-600 focus:ring-red-500/20 dark:focus:ring-red-600/20' : ''} ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400 ml-1">{error}</p>}
        </div>
    );
};

export default Input;
