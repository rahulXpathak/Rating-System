import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { validatePassword, getPasswordStrength } from '../../utils/validation';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const passwordStrength = getPasswordStrength(formData.newPassword);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');

        // Validate
        const newErrors = {};

        if (!formData.oldPassword) {
            newErrors.oldPassword = 'Old password is required';
        }

        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
            newErrors.newPassword = passwordError;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await api.put('/auth/change-password', {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword
            });
            setSuccess('Password changed successfully!');
            setTimeout(() => {
                // Navigate based on role
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'store_owner') navigate('/owner');
                else navigate('/stores');
            }, 2000);
        } catch (err) {
            setErrors({ submit: err.response?.data?.message || 'Failed to change password' });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Change Password</h1>
                        <p className="auth-subtitle">Update your account password</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="oldPassword">Current Password</label>
                            <input
                                id="oldPassword"
                                name="oldPassword"
                                type="password"
                                placeholder="Enter your current password"
                                value={formData.oldPassword}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                            {errors.oldPassword && <small style={{ color: '#fca5a5' }}>{errors.oldPassword}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                placeholder="Enter your new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                            <small className="input-hint">8-16 characters, 1 uppercase, 1 number, 1 special character (!@#$&*)</small>
                            {formData.newPassword && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.85rem', color: passwordStrength.color }}>
                                        Strength: {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                            {errors.newPassword && <small style={{ color: '#fca5a5' }}>{errors.newPassword}</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="auth-input"
                            />
                            {errors.confirmPassword && <small style={{ color: '#fca5a5' }}>{errors.confirmPassword}</small>}
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
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
