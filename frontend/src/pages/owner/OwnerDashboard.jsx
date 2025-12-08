import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await api.get('/owner/dashboard');
                setDashboardData(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="owner-loading">
                <div className="spinner-large"></div>
                <p>Loading your store dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="owner-error">
                <span>⚠️ {error}</span>
            </div>
        );
    }

    const avgRating = dashboardData?.averageRating ? Number(dashboardData.averageRating).toFixed(2) : '0.00';
    const totalRatings = dashboardData?.ratings?.length || 0;
    const recentRatings = dashboardData?.ratings?.slice(0, 5) || [];

    // Calculate rating distribution
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    dashboardData?.ratings?.forEach(rating => {
        if (rating.rating >= 1 && rating.rating <= 5) {
            ratingCounts[rating.rating]++;
        }
    });

    const statCards = [
        {
            title: 'Average Rating',
            value: avgRating,
            icon: '⭐',
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            subtitle: 'Overall customer satisfaction'
        },
        {
            title: 'Total Ratings',
            value: totalRatings,
            icon: '📊',
            color: '#667eea',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            subtitle: 'Ratings received'
        },
        {
            title: '5-Star Ratings',
            value: ratingCounts[5],
            icon: '🌟',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            subtitle: `${totalRatings > 0 ? ((ratingCounts[5] / totalRatings) * 100).toFixed(0) : 0}% of total`
        },
        {
            title: 'Satisfaction Rate',
            value: totalRatings > 0 ? `${(((ratingCounts[5] + ratingCounts[4]) / totalRatings) * 100).toFixed(0)}%` : '0%',
            icon: '😊',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            subtitle: '4+ star ratings'
        }
    ];

    return (
        <div className="owner-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Store Owner Dashboard</h1>
                    <p className="dashboard-subtitle">
                        Track your store's performance and customer feedback
                    </p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary">
                        <span>📈</span> View Analytics
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
                            <div className="stat-subtitle">
                                <span>{stat.subtitle}</span>
                            </div>
                        </div>
                        <div className="stat-decoration" style={{ background: `${stat.color}15` }}></div>
                    </div>
                ))}
            </div>

            {/* Rating Distribution */}
            <div className="rating-distribution-card">
                <h3 className="card-title">Rating Distribution</h3>
                <div className="rating-bars">
                    {[5, 4, 3, 2, 1].map(star => {
                        const count = ratingCounts[star];
                        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                        return (
                            <div key={star} className="rating-bar-row">
                                <span className="rating-stars">
                                    {'⭐'.repeat(star)}
                                </span>
                                <div className="rating-bar-container">
                                    <div
                                        className="rating-bar-fill"
                                        style={{
                                            width: `${percentage}%`,
                                            background: star >= 4 ? '#10b981' : star >= 3 ? '#f59e0b' : '#ef4444'
                                        }}
                                    ></div>
                                </div>
                                <span className="rating-count">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent Ratings Table */}
            <div className="ratings-table-card">
                <h3 className="card-title">Recent Customer Ratings</h3>
                {dashboardData.ratings && dashboardData.ratings.length > 0 ? (
                    <div className="table-wrapper">
                        <table className="ratings-table">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Rating</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentRatings.map(rating => (
                                    <tr key={rating.id}>
                                        <td>
                                            <div className="customer-info">
                                                <div className="customer-avatar">
                                                    {rating.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="customer-name">{rating.name}</div>
                                                    <div className="customer-email">{rating.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="rating-display">
                                                <span className="rating-stars-inline">
                                                    {'⭐'.repeat(rating.rating)}
                                                </span>
                                                <span className="rating-number">{rating.rating}/5</span>
                                            </div>
                                        </td>
                                        <td className="date-cell">
                                            {new Date(rating.updated_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {dashboardData.ratings.length > 5 && (
                            <div className="view-all-link">
                                <button className="btn-secondary">
                                    View All {dashboardData.ratings.length} Ratings →
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">📭</span>
                        <p>No ratings received yet</p>
                        <span className="empty-subtitle">
                            Customers will leave ratings after visiting your store
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;
