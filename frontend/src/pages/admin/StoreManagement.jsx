import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './StoreManagement.css';

const StoreManagement = () => {
    const [stores, setStores] = useState([]);
    const [filteredStores, setFilteredStores] = useState([]);
    const [users, setUsers] = useState([]); // For owner dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [ownerId, setOwnerId] = useState('');

    // Filter state
    const [filter, setFilter] = useState('');
    const [ownerFilter, setOwnerFilter] = useState('all');

    useEffect(() => {
        fetchStores();
        fetchStoreOwners();
    }, []);

    useEffect(() => {
        let filtered = stores.filter(store =>
            store.name.toLowerCase().includes(filter.toLowerCase()) ||
            store.email.toLowerCase().includes(filter.toLowerCase())
        );

        if (ownerFilter === 'assigned') {
            filtered = filtered.filter(store => store.owner_name);
        } else if (ownerFilter === 'unassigned') {
            filtered = filtered.filter(store => !store.owner_name);
        }

        setFilteredStores(filtered);
    }, [filter, ownerFilter, stores]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/stores');
            setStores(data);
        } catch (err) {
            setError('Failed to fetch stores.');
        } finally {
            setLoading(false);
        }
    };

    const fetchStoreOwners = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data.filter(u => u.role === 'store_owner'));
        } catch (err) {
            console.error("Failed to fetch store owners for dropdown.");
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        if (!name || !email) {
            setError('Please fill name and email.');
            return;
        }
        try {
            await api.post('/admin/stores', { name, email, address, owner_id: ownerId || null });
            fetchStores();
            setName('');
            setEmail('');
            setAddress('');
            setOwnerId('');
            setShowForm(false);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add store.');
        }
    };

    const getStoreStats = () => {
        const stats = {
            total: stores.length,
            assigned: stores.filter(s => s.owner_name).length,
            unassigned: stores.filter(s => !s.owner_name).length,
            avgRating: stores.reduce((acc, s) => acc + parseFloat(s.average_rating || 0), 0) / (stores.length || 1)
        };
        return stats;
    };

    const stats = getStoreStats();

    if (loading) {
        return (
            <div className="management-loading">
                <div className="spinner-large"></div>
                <p>Loading stores...</p>
            </div>
        );
    }

    return (
        <div className="store-management">
            {/* Header */}
            <div className="management-header">
                <div>
                    <h1 className="management-title">Store Management</h1>
                    <p className="management-subtitle">Manage all stores and their owners</p>
                </div>
                <button className="btn-add" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cancel' : '➕ Add New Store'}
                </button>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-mini">
                    <span className="stat-mini-icon">🏪</span>
                    <div>
                        <span className="stat-mini-value">{stats.total}</span>
                        <span className="stat-mini-label">Total Stores</span>
                    </div>
                </div>
                <div className="stat-mini">
                    <span className="stat-mini-icon">✓</span>
                    <div>
                        <span className="stat-mini-value">{stats.assigned}</span>
                        <span className="stat-mini-label">Assigned</span>
                    </div>
                </div>
                <div className="stat-mini">
                    <span className="stat-mini-icon">○</span>
                    <div>
                        <span className="stat-mini-value">{stats.unassigned}</span>
                        <span className="stat-mini-label">Unassigned</span>
                    </div>
                </div>
                <div className="stat-mini">
                    <span className="stat-mini-icon">⭐</span>
                    <div>
                        <span className="stat-mini-value">{stats.avgRating.toFixed(1)}</span>
                        <span className="stat-mini-label">Avg Rating</span>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button onClick={() => setError('')}>✕</button>
                </div>
            )}

            {/* Add Store Form */}
            {showForm && (
                <div className="form-card">
                    <h3 className="form-title">Add New Store</h3>
                    <form onSubmit={handleAddStore} className="add-store-form">
                        <div className="form-group">
                            <label>Store Name (20-60 characters)</label>
                            <input
                                type="text"
                                placeholder="Enter store name..."
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="form-input"
                                required
                                minLength={20}
                                maxLength={60}
                            />
                        </div>

                        <div className="form-group">
                            <label>Store Email</label>
                            <input
                                type="email"
                                placeholder="store@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Address (optional)</label>
                            <textarea
                                placeholder="Enter store address..."
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                className="form-textarea"
                                maxLength={400}
                            />
                        </div>

                        <div className="form-group">
                            <label>Store Owner</label>
                            <select
                                value={ownerId}
                                onChange={e => setOwnerId(e.target.value)}
                                className="form-select"
                            >
                                <option value="">🏪 No Owner (Unassigned)</option>
                                {users.map(owner => (
                                    <option key={owner.id} value={owner.id}>
                                        👤 {owner.name} (ID: {owner.id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn-submit">
                            ✓ Create Store
                        </button>
                    </form>
                </div>
            )}

            {/* Filters */}
            <div className="filters-section">
                <div className="search-box">
                    <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by store name or email..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="search-input"
                    />
                </div>

                <select
                    value={ownerFilter}
                    onChange={e => setOwnerFilter(e.target.value)}
                    className="role-filter"
                >
                    <option value="all">All Stores</option>
                    <option value="assigned">✓ Assigned</option>
                    <option value="unassigned">○ Unassigned</option>
                </select>
            </div>

            {/* Stores Table */}
            <div className="stores-table-container">
                <table className="stores-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Store</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Owner</th>
                            <th>Rating</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStores.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-row">
                                    <div className="empty-state">
                                        <span className="empty-icon">🔍</span>
                                        <p>No stores found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredStores.map(store => (
                                <tr key={store.id} className="store-row">
                                    <td className="store-id">#{store.id}</td>
                                    <td className="store-info">
                                        <div className="store-avatar">
                                            <span>{store.name.charAt(0)}</span>
                                        </div>
                                        <span className="store-name">{store.name}</span>
                                    </td>
                                    <td className="store-email">{store.email}</td>
                                    <td className="store-address">{store.address || '-'}</td>
                                    <td>
                                        {store.owner_name ? (
                                            <span className="owner-badge assigned">
                                                👤 {store.owner_name}
                                            </span>
                                        ) : (
                                            <span className="owner-badge unassigned">
                                                ○ Unassigned
                                            </span>
                                        )}
                                    </td>
                                    <td className="store-rating">
                                        {store.average_rating ? (
                                            <span className="rating-display">
                                                ⭐ {parseFloat(store.average_rating).toFixed(1)}
                                            </span>
                                        ) : (
                                            <span className="no-rating">No ratings</span>
                                        )}
                                    </td>
                                    <td className="store-date">
                                        {new Date(store.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreManagement;
