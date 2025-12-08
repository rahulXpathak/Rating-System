import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OwnerLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            // Verify this is a store owner user
            if (user.role !== 'store_owner') {
                setError('Access denied. This portal is for store owners only.');
                return;
            }
            navigate('/owner');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="role-badge owner-badge">🏪 Store Owner</div>
                        <h1 className="auth-title">Owner Portal</h1>
                        <p className="auth-subtitle">Login to manage your store</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Owner Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter owner email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="auth-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="auth-input"
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                <span>⚠️ {error}</span>
                            </div>
                        )}

                        <button type="submit" className="auth-button">
                            Login as Store Owner
                        </button>
                    </form>

                    <div className="auth-footer">
                        <Link to="/" className="auth-link-secondary">← Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerLoginPage;
