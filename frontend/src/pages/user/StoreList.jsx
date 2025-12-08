import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StarRating from '../../components/StarRating';
import './StoreList.css';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState('ASC');
    const [viewMode, setViewMode] = useState('grid'); // grid or list

    useEffect(() => {
        fetchStores();
    }, [search, sort, order]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const params = { search, sort, order };
            const { data } = await api.get('/stores', { params });
            setStores(data);
            setError('');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch stores.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleRating = async (storeId, rating) => {
        try {
            await api.post(`/stores/${storeId}/rate`, { rating });
            setStores(stores.map(s => s.id === storeId ? { ...s, my_rating: rating } : s));
            // Success toast would go here
        } catch (err) {
            setError('Failed to submit rating. Please try again.');
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return '#10b981';
        if (rating >= 3.5) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="store-list-container">
            {/* Header Section */}
            <div className="store-list-header">
                <div>
                    <h1 className="page-title">Discover Amazing Stores</h1>
                    <p className="page-subtitle">Find and rate your favorite local businesses</p>
                </div>
                <div className="header-stats">
                    <div className="stat-card">
                        <span className="stat-number">{stores.length}</span>
                        <span className="stat-label">Stores</span>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="search-filter-bar">
                <div className="search-container">
                    <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search stores by name or address..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button className="clear-search" onClick={() => setSearch('')}>✕</button>
                    )}
                </div>

                <div className="filter-controls">
                    <select
                        className="sort-select"
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                    >
                        <option value="name">Sort by Name</option>
                        <option value="overall_rating">Sort by Rating</option>
                        <option value="address">Sort by Location</option>
                    </select>

                    <button
                        className="order-toggle"
                        onClick={() => setOrder(order === 'ASC' ? 'DESC' : 'ASC')}
                    >
                        {order === 'ASC' ? '↑' : '↓'}
                    </button>

                    <div className="view-toggle">
                        <button
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading stores...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                </div>
            )}

            {/* Stores Grid/List */}
            {!loading && !error && (
                <div className={`stores-${viewMode}`}>
                    {stores.length === 0 ? (
                        <div className="empty-state">
                            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3>No stores found</h3>
                            <p>Try adjusting your search criteria</p>
                        </div>
                    ) : (
                        stores.map((store, index) => (
                            <div
                                key={store.id}
                                className={`store-card ${viewMode}`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="store-header">
                                    <div className="store-icon">
                                        <span>{store.name.charAt(0)}</span>
                                    </div>
                                    <div className="store-info">
                                        <h3 className="store-name">{store.name}</h3>
                                        <p className="store-address">📍 {store.address}</p>
                                        <p className="store-email">✉️ {store.email}</p>
                                    </div>
                                </div>

                                <div className="store-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Average Rating</span>
                                        <div className="rating-badge" style={{
                                            backgroundColor: getRatingColor(parseFloat(store.overall_rating)) + '20',
                                            color: getRatingColor(parseFloat(store.overall_rating))
                                        }}>
                                            <span className="rating-value">
                                                ⭐ {parseFloat(store.overall_rating || 0).toFixed(1)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="stat-item">
                                        <span className="stat-label">Your Rating</span>
                                        <span className="your-rating">
                                            {store.my_rating ? `⭐ ${store.my_rating}/5` : 'Not rated'}
                                        </span>
                                    </div>
                                </div>

                                <div className="store-actions">
                                    <div className="rating-section">
                                        <label>Rate this store:</label>
                                        <StarRating
                                            rating={store.my_rating || 0}
                                            onRate={(rating) => handleRating(store.id, rating)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StoreList;
