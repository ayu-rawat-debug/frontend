// File: src/components/Login/SignUpPage.js
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../pages/Login.css';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);

    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError(null);

        const userData = {
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            address
        };

        try {
            const res = await signUp(userData);

            if (res.error) {
                setError(res.error);
            } else {
                alert('Sign up successful! You can now log in.');
                navigate('/login');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <h1 className="main-title">Sign Up</h1>
            <form onSubmit={handleSignUp}>
                <div className="form-group">
                    <label>First Name:</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="signup-btn">Sign Up</button>
            </form>
            <div className="login-link-container">
                <p>Already have an account? <Link to="/login" className="login-link">Log In</Link></p>
            </div>
        </div>
    );
};

export default SignUpPage;