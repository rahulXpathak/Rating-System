import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/"><h1>Rating Platform</h1></Link>
            <div>
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <>
                                <Link to="/admin">Dashboard</Link>
                                <Link to="/admin/users">Users</Link>
                                <Link to="/admin/stores">Stores</Link>
                            </>
                        )}
                        {user.role === 'user' && (
                            <Link to="/stores">Browse Stores</Link>
                        )}
                        {user.role === 'store_owner' && (
                            <Link to="/owner">My Dashboard</Link>
                        )}
                        <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
