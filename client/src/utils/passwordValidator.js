// Client-side password validation
export const validatePassword = (password) => {
    const errors = [];

    // Minimum 8 characters
    if (password.length < 8) {
        errors.push('At least 8 characters');
    }

    // At least one uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push('One uppercase letter');
    }

    // At least one lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push('One lowercase letter');
    }

    // At least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('One special character');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green'];
    
    return {
        strength,
        label: labels[strength - 1] || '',
        color: colors[strength - 1] || 'gray',
        percentage: (strength / 5) * 100,
    };
};
