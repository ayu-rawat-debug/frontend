import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import TechnicianHomePage from './components/Technician/TechnicianHomePage';
import TechnicianProfilePage from './components/Technician/TechnicianProfilePage';
import './App.css'; 
import { useAuth } from './components/Login/AuthContext';
const Technician = () => {
    const { user } = useAuth();
    const technicianId = user?.id;
    return (
        <div className="technician-home-container">
            <nav className="navbar">
                <Link to="/" className="logo">PC-Market</Link>
                <div className="nav-links">
                    <Link to="./">Home</Link>
                    <Link to="./profile">My Profile</Link>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<TechnicianHomePage technicianId={technicianId} />} />
                <Route path="/profile" element={<TechnicianProfilePage technicianId={technicianId} />} />
            </Routes>
        </div>
    );
};

export default Technician;