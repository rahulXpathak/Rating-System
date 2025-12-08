import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Redirect authenticated users to dashboard
    React.useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Rate & Discover<br />
                        <span className="gradient-text">Amazing Stores</span>
                    </h1>
                    <p className="hero-subtitle">
                        Share your experiences, discover the best stores, and help others make informed decisions
                    </p>
                    <div className="hero-buttons">
                        <Link to="/signup" className="cta-button primary">Get Started</Link>
                        <Link to="/login" className="cta-button secondary">Sign In</Link>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="floating-card card-1">⭐ 4.8 Rating</div>
                    <div className="floating-card card-2">🏪 1000+ Stores</div>
                    <div className="floating-card card-3">👥 5000+ Users</div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-container">
                    <div className="step">
                        <div className="step-icon">📝</div>
                        <h3>1. Sign Up</h3>
                        <p>Create your free account in seconds and join our community</p>
                    </div>
                    <div className="step">
                        <div className="step-icon">🔍</div>
                        <h3>2. Discover</h3>
                        <p>Browse and search through hundreds of stores in your area</p>
                    </div>
                    <div className="step">
                        <div className="step-icon">⭐</div>
                        <h3>3. Rate</h3>
                        <p>Share your honest ratings and help others make better choices</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Why Choose Us</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Authentic Reviews</h3>
                        <p>Real ratings from verified users ensure genuine feedback</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚀</div>
                        <h3>Easy to Use</h3>
                        <p>Simple, intuitive interface designed for everyone</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>Secure Platform</h3>
                        <p>Your data is protected with enterprise-grade security</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Detailed Analytics</h3>
                        <p>Store owners get comprehensive insights and analytics</p>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Get Started?</h2>
                    <p>Join thousands of users who trust our platform for honest store ratings</p>
                    <Link to="/signup" className="cta-button primary large">Create Free Account</Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Rating Platform</h3>
                        <p>Your trusted source for store ratings and reviews</p>
                    </div>
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <Link to="/login">User Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </div>
                    <div className="footer-section">
                        <h4>For Business</h4>
                        <Link to="/owner/login">Store Owner Login</Link>
                        <Link to="/admin/login">Admin Login</Link>
                    </div>
                    <div className="footer-section">
                        <h4>Contact</h4>
                        <p>Email: info@ratingplatform.com</p>
                        <p>Phone: (555) 123-4567</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 Rating Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
