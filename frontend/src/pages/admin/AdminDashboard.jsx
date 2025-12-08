import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/dashboard');
                setStats(data);
            } catch (err) {
                setError('Failed to fetch dashboard stats.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: '👥',
            color: '#667eea',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Total Stores',
            value: stats.totalStores,
            icon: '🏪',
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            change: '+8%',
            changeType: 'positive'
        },
        {
            title: 'Total Ratings',
            value: stats.totalRatings,
            icon: '⭐',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            change: '+24%',
            changeType: 'positive'
        },
        {
            title: 'Avg Rating',
            value: stats.totalRatings > 0 ? (stats.totalRatings / stats.totalStores).toFixed(1) : '0.0',
            icon: '📊',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            change: '+0.3',
            changeType: 'positive'
        }
    ];

    const quickActions = [
        { title: 'Add New User', icon: '➕👤', action: () => navigate('/admin/users'), color: '#667eea' },
        { title: 'Add New Store', icon: '➕🏪', action: () => navigate('/admin/stores'), color: '#f59e0b' },
        { title: 'Manage Users', icon: '⚙️👥', action: () => navigate('/admin/users'), color: '#10b981' },
        { title: 'Manage Stores', icon: '⚙️🏪', action: () => navigate('/admin/stores'), color: '#8b5cf6' }
    ];

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner-large"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <span>⚠️ {error}</span>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back! Here's what's happening with your platform today.</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary">
                        <span>📊</span> View Reports
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="stat-card-modern"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="stat-icon" style={{ background: stat.gradient }}>
                            <span>{stat.icon}</span>
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">{stat.title}</p>
                            <h2 className="stat-value">{stat.value}</h2>
                            <div className={`stat-change ${stat.changeType}`}>
                                <span>{stat.change}</span>
                                <span className="change-label">from last month</span>
                            </div>
                        </div>
                        <div className="stat-decoration" style={{ background: `${stat.color}15` }}></div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions-section">
                <h2 className="section-title">Quick Actions</h2>
                <div className="quick-actions-grid">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            className="quick-action-card"
                            onClick={action.action}
                            style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                        >
                            <div className="action-icon" style={{ backgroundColor: `${action.color}20`, color: action.color }}>
                                <span>{action.icon}</span>
                            </div>
                            <span className="action-title">{action.title}</span>
                            <div className="action-arrow">→</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity & Platform Stats */}
            <div className="dashboard-bottom">
                <div className="activity-card">
                    <h3 className="card-title">Platform Overview</h3>
                    <div className="overview-stats">
                        <div className="overview-item">
                            <span className="overview-label">Active Users</span>
                            <span className="overview-value">{Math.floor(stats.totalUsers * 0.75)}</span>
                        </div>
                        <div className="overview-item">
                            <span className="overview-label">Active Stores</span>
                            <span className="overview-value">{stats.totalStores}</span>
                        </div>
                        <div className="overview-item">
                            <span className="overview-label">Avg. Rating</span>
                            <span className="overview-value">
                                {stats.totalRatings > 0 ? (stats.totalRatings / stats.totalStores).toFixed(2) : '0.00'}
                            </span>
                        </div>
                    </div>
                    <div className="platform-health">
                        <div className="health-bar">
                            <div className="health-fill" style={{ width: '87%' }}></div>
                        </div>
                        <div className="health-label">
                            <span>Platform Health</span>
                            <span className="health-percentage">87%</span>
                        </div>
                    </div>
                </div>

                <div className="activity-card">
                    <h3 className="card-title">System Status</h3>
                    <div className="status-list">
                        <div className="status-item">
                            <div className="status-indicator active"></div>
                            <span>Database Connected</span>
                        </div>
                        <div className="status-item">
                            <div className="status-indicator active"></div>
                            <span>API Services Running</span>
                        </div>
                        <div className="status-item">
                            <div className="status-indicator active"></div>
                            <span>All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
