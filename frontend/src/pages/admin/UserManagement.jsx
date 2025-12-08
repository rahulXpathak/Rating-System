import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('user');

    // Filter state
    const [filter, setFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = users.filter(user =>
            user.name.toLowerCase().includes(filter.toLowerCase()) ||
            user.email.toLowerCase().includes(filter.toLowerCase())
        );

        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    }, [filter, roleFilter, users]);

    const fetchUsers = async () => {
        console.log("Fetching users...");
        try {
            setLoading(true);
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !role) {
            setError('Please fill all required fields.');
            return;
        }
        try {
            await api.post('/admin/users', { name, email, password, address, role });
            fetchUsers();
            setName('');
            setEmail('');
            setPassword('');
            setAddress('');
            setRole('user');
            setShowForm(false);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add user.');
        }
    };

    const getRoleBadge = (role) => {
        const badges = {
            admin: { color: '#667eea', icon: '👑', label: 'Admin' },
            store_owner: { color: '#f59e0b', icon: '🏪', label: 'Store Owner' },
            user: { color: '#10b981', icon: '👤', label: 'User' }
        };
        return badges[role] || badges.user;
    };

    const getRoleStats = () => {
        const stats = {
            total: users.length,
            admins: users.filter(u => u.role === 'admin').length,
            owners: users.filter(u => u.role === 'store_owner').length,
            users: users.filter(u => u.role === 'user').length
        };
        return stats;
    };

    const handleBlockUser = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/block`);
            setSuccess('User blocked successfully.');
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to block user.');
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/unblock`);
            setSuccess('User unblocked successfully.');
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to unblock user.');
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await api.delete(`/admin/users/${userToDelete.id}`);
            setSuccess(`User ${userToDelete.name} deleted successfully.`);
            fetchUsers();
            setShowDeleteConfirm(false);
            setUserToDelete(null);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user.');
            setShowDeleteConfirm(false);
            setUserToDelete(null);
        }
    };

    const confirmDelete = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const getStatusBadge = (status) => {
        return status === 'blocked'
            ? { color: '#ef4444', label: 'Blocked', icon: '🚫' }
            : { color: '#10b981', label: 'Active', icon: '✓' };
    };

    const stats = getRoleStats();

    if (loading) {
        return (
            <div className="management-loading">
                <div className="spinner-large"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="user-management">
            {/* Header with Stats */}
            <div className="management-header">
                <div>
                    <h1 className="management-title">User Management</h1>
                    <p className="management-subtitle">Manage all users and their roles</p>
                </div>
                <button className="btn-add" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cancel' : '➕ Add New User'}
                </button>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-mini">
                    <span className="stat-mini-icon">👥</span>
                    <div>
                        <span className="stat-mini-value">{stats.total}</span>
                        <span className="stat-mini-label">Total Users</span>
                    </div>
                </div>
                <div className="stat-mini">
                    <span className="stat-mini-icon">👑</span>
                    <div>
                        <span className="stat-mini-value">{stats.admins}</span>
                        <span className="stat-mini-label">Admins</span>
                    </div>
                </div>
                <div className="stat-mini">
                    <span className="stat-mini-icon">🏪</span>
                    <div>
                        <span className="stat-mini-value">{stats.owners}</span>
                        <span className="stat-mini-label">Store Owners</span>
                    </div>
                </div>
                <div className="stat-mini">
                    <span className="stat-mini-icon">👤</span>
                    <div>
                        <span className="stat-mini-value">{stats.users}</span>
                        <span className="stat-mini-label">Regular Users</span>
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

            {/* Success Message */}
            {success && (
                <div className="success-banner">
                    <span>✓ {success}</span>
                    <button onClick={() => setSuccess('')}>✕</button>
                </div>
            )}

            {/* Add User Form */}
            {showForm && (
                <div className="form-card">
                    <h3 className="form-title">Add New User</h3>
                    <form onSubmit={handleAddUser} className="add-user-form">
                        <div className="form-group">
                            <label>Name (20-60 characters)</label>
                            <input
                                type="text"
                                placeholder="Enter full name..."
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="form-input"
                                required
                                minLength={20}
                                maxLength={60}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter password..."
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Address (optional)</label>
                            <textarea
                                placeholder="Enter address..."
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                className="form-textarea"
                                maxLength={400}
                            />
                        </div>

                        <div className="form-group">
                            <label>Role</label>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className="form-select"
                            >
                                <option value="user">👤 Normal User</option>
                                <option value="store_owner">🏪 Store Owner</option>
                                <option value="admin">👑 Admin</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-submit">
                            ✓ Create User
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
                        placeholder="Search by name or email..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="search-input"
                    />
                </div>

                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="role-filter"
                >
                    <option value="all">All Roles</option>
                    <option value="admin">👑 Admins</option>
                    <option value="store_owner">🏪 Store Owners</option>
                    <option value="user">👤 Users</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-row">
                                    <div className="empty-state">
                                        <span className="empty-icon">🔍</span>
                                        <p>No users found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => {
                                const badge = getRoleBadge(user.role);
                                return (
                                    <tr key={user.id} className="user-row">
                                        <td className="user-id">#{user.id}</td>
                                        <td className="user-info">
                                            <div className="user-avatar" style={{ backgroundColor: `${badge.color}30` }}>
                                                <span>{user.name.charAt(0)}</span>
                                            </div>
                                            <span className="user-name">{user.name}</span>
                                        </td>
                                        <td className="user-email">{user.email}</td>
                                        <td>
                                            <span className="role-badge" style={{ backgroundColor: `${badge.color}20`, color: badge.color }}>
                                                {badge.icon} {badge.label}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className="status-badge"
                                                style={{
                                                    backgroundColor: `${getStatusBadge(user.status).color}20`,
                                                    color: getStatusBadge(user.status).color
                                                }}
                                            >
                                                {getStatusBadge(user.status).icon} {getStatusBadge(user.status).label}
                                            </span>
                                        </td>
                                        <td className="user-date">
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="user-actions">
                                            {user.role !== 'admin' && (
                                                <>
                                                    {user.status === 'active' ? (
                                                        <button
                                                            className="btn-action btn-block"
                                                            onClick={() => handleBlockUser(user.id)}
                                                            title="Block user"
                                                        >
                                                            🚫 Block
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn-action btn-unblock"
                                                            onClick={() => handleUnblockUser(user.id)}
                                                            title="Unblock user"
                                                        >
                                                            ✓ Unblock
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn-action btn-delete"
                                                        onClick={() => confirmDelete(user)}
                                                        title="Delete user"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Confirm Deletion</h3>
                            <button onClick={() => setShowDeleteConfirm(false)} className="modal-close">✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="warning-icon">⚠️</div>
                            <p>Are you sure you want to delete user:</p>
                            <strong>{userToDelete?.name}</strong>
                            <p className="warning-text">
                                This action cannot be undone. The user will be permanently removed from the system.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="btn-confirm-delete"
                            >
                                🗑️ Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
