import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { validateName, validateEmail, validatePassword, validateAddress, getPasswordStrength } from '../utils/validation';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const passwordStrength = getPasswordStrength(formData.password);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');

        // Validate all fields
        const newErrors = {};
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        const addressError = validateAddress(formData.address);

        if (nameError) newErrors.name = nameError;
        if (emailError) newErrors.email = emailError;
        if (passwordError) newErrors.password = passwordError;
        if (addressError) newErrors.address = addressError;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await api.post('/auth/register', formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setErrors({ submit: err.response?.data?.message || 'Failed to register.' });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Join us to start rating stores</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name (20-60 characters)"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                            {errors.name && <small style={{ color: '#fca5a5' }}>{errors.name}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                            {errors.email && <small style={{ color: '#fca5a5' }}>{errors.email}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                            <small className="input-hint">8-16 characters, 1 uppercase, 1 number, 1 special character (!@#$&*)</small>
                            {formData.password && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: passwordStrength.color }}>
                                        Strength: {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                            {errors.password && <small style={{ color: '#fca5a5' }}>{errors.password}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Address (Optional)</label>
                            <textarea
                                id="address"
                                name="address"
                                placeholder="Enter your address (max 400 characters)"
                                value={formData.address}
                                onChange={handleChange}
                                rows="3"
                                className="auth-input"
                            ></textarea>
                            {errors.address && <small style={{ color: '#fca5a5' }}>{errors.address}</small>}
                        </div>

                        {errors.submit && (
                            <div className="error-message">
                                <span>⚠️ {errors.submit}</span>
                            </div>
                        )}

                        {success && (
                            <div className="success-message">
                                <span>✅ {success}</span>
                            </div>
                        )}

                        <button type="submit" className="auth-button">
                            Create Account
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
                        <Link to="/" className="auth-link-secondary">← Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
