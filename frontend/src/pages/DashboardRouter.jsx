import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardRouter = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    switch (user.role) {
        case 'admin':
            return <Navigate to="/admin" />;
        case 'user':
            return <Navigate to="/stores" />;
        case 'store_owner':
            return <Navigate to="/owner" />;
        default:
            // Fallback for unknown roles or if user object is malformed
            return <Navigate to="/login" />;
    }
};

export default DashboardRouter;
