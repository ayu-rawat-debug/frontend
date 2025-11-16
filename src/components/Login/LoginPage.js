// File: src/components/Login/LoginPage.js
import React, { useState,useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../pages/Login.css';
import ForgotPasswordModal from './ForgotPasswordModal';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login,user } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (user) {
            // Redirect to the appropriate page if the user is already logged in
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'technician') {
                navigate('/technician');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);
   const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await login({ email, password });

            if (res.error) {
                setError(res.error);
            } else {
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h1 className="main-title">Login</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-btn">Log In</button>
            </form>
            <div className="signup-link-container">
                <p>Don't have an account? <Link to="/signup" className="signup-link">Sign Up</Link></p>
            </div>
            <div className="extra-links">
  <p><span className="forgot-link" onClick={() => setShowModal(true)}>Forgot Password?</span></p>
{showModal && <ForgotPasswordModal onClose={() => setShowModal(false)} />}
</div>
        </div>
    );
};

export default LoginPage;