// File: src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const API_BASE_URL = 'https://pc-parts-marketplace-website.onrender.com/api/auth';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate();

    // Use this useEffect to check for an existing session on page load
    useEffect(() => {
        // Here, you would check for a stored token or session
        // For now, we'll assume the user is not authenticated initially
        setLoading(false);
    }, []);

    const login = async ({ email, password }) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
            const loggedInUser = res.data;
            setUser(loggedInUser);
            // This is where you would store the token/session for persistence
            return { data: loggedInUser, error: null };
        } catch (err) {
            console.error('Login error:', err);
            return { data: null, error: err.response?.data?.message || 'Failed to log in.' };
        }
    };

    const signUp = async (userData) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/signup`, userData);
            // After successful signup, you might automatically log the user in
            const newUser = res.data;
            return { data: newUser, error: null };
        } catch (err) {
            console.error('Signup error:', err);
            return { data: null, error: err.response?.data?.message || 'Failed to sign up.' };
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);