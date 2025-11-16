import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import { useAuth } from '../Login/AuthContext'; 
import '../../pages/Technician.css';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

const TechnicianProfilePage = () => {
    const [technicianProfile, setTechnicianProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        address: ''
    });

    const { user } = useAuth(); // Get the user object from the auth context
    const technicianId = user?.id; 
    useEffect(() => {
        const fetchTechnicianProfile = async () => {
            if (!technicianId) {
                setError('Technician ID is not available. Please log in.');
                setLoading(false);
                return;
            }

            try {
                // Fetch technician profile details
                const profileRes = await axios.get(`${API_BASE_URL}/technicians/${technicianId}/profile`);
                const { password, ...userData } = profileRes.data;
                setTechnicianProfile(userData);
                setEditFormData(userData);
            } catch (err) {
                console.error('Error fetching technician data:', err);
                setError('Failed to load technician profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchTechnicianProfile();
    }, [technicianId]);

    const handleEditProfile = () => {
        setEditModalOpen(true);
    };

    const handleModalChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatePayload = {
                first_name: editFormData.first_name,
                last_name: editFormData.last_name,
                email: editFormData.email,
                phone_number: editFormData.phone_number,
                address: editFormData.address,
            };

            const res = await axios.put(`${API_BASE_URL}/technicians/${technicianId}/profile`, updatePayload);
            const { password, ...userData } = res.data;
            setTechnicianProfile(userData);
            setEditModalOpen(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile.');
        }
    };

    if (loading) return <div className="loading">Loading profile...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!technicianProfile) return <div className="no-profile">No technician profile found.</div>;

    return (
        <div className="technician-profile-container">
            {/* <nav className="navbar">
                <Link to="/technician" className="logo">PC-Market</Link>
                <div className="nav-links">
                    <Link to="/technician">Home</Link>
                    <Link to="/technician/profile">My Profile</Link>
                </div>
            </nav> */}
            <h1 className="main-title">My Profile</h1>
            <div className="profile-details">
                <p><strong>Name:</strong> {technicianProfile.first_name} {technicianProfile.last_name}</p>
                <p><strong>Email:</strong> {technicianProfile.email}</p>
                <p><strong>Phone:</strong> {technicianProfile.phone_number}</p>
                <p><strong>Address:</strong> {technicianProfile.address}</p>
                <button onClick={handleEditProfile} className="edit-profile-btn">Edit Profile</button>
            </div>

            {editModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={() => setEditModalOpen(false)} className="modal-close-btn">&times;</button>
                        <h3>Edit Profile</h3>
                        <form onSubmit={handleModalSubmit}>
                            <div className="form-group">
                                <label>First Name:</label>
                                <input type="text" name="first_name" value={editFormData.first_name} onChange={handleModalChange} />
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input type="text" name="last_name" value={editFormData.last_name} onChange={handleModalChange} />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input type="email" name="email" value={editFormData.email} onChange={handleModalChange} />
                            </div>
                            <div className="form-group">
                                <label>Phone Number:</label>
                                <input type="text" name="phone_number" value={editFormData.phone_number} onChange={handleModalChange} />
                            </div>
                            <div className="form-group">
                                <label>Address:</label>
                                <textarea name="address" value={editFormData.address} onChange={handleModalChange}></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Save Changes</button>
                                <button type="button" onClick={() => setEditModalOpen(false)} className="cancel-btn">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechnicianProfilePage;