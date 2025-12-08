// Form validation utilities

export const validateName = (name) => {
    if (!name || name.trim().length < 20 || name.trim().length > 60) {
        return 'Name must be between 20 and 60 characters.';
    }
    return null;
};

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !regex.test(email)) {
        return 'Please enter a valid email address.';
    }
    return null;
};

export const validatePassword = (password) => {
    if (!password || password.length < 8 || password.length > 16) {
        return 'Password must be 8-16 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter.';
    }
    if (!/[!@#$&*]/.test(password)) {
        return 'Password must contain at least one special character (!@#$&*).';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number.';
    }
    return null;
};

export const validateAddress = (address) => {
    if (address && address.length > 400) {
        return 'Address must not exceed 400 characters.';
    }
    return null;
};

export const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[!@#$&*]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: '#ef4444' };
    if (strength <= 3) return { strength, label: 'Medium', color: '#f59e0b' };
    return { strength, label: 'Strong', color: '#10b981' };
};
