// File: src/components/Customer/UserProfile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../pages/CustomerHomePage.css';
import { useAuth } from '../Login/AuthContext'; 

const API_BASE_URL = 'https://pc-parts-marketplace-website.onrender.com/api';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);
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
    const [repairRequests, setRepairRequests] = useState([]);
    const { user } = useAuth(); // Get the user object from the auth context
    const userId = user?.id; 

    useEffect(() => {
        const fetchUserProfileAndOrders = async () => {
            if (!userId) {
                setError('User ID is not available. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const profileRes = await axios.get(`${API_BASE_URL}/users/${userId}`);
                const { password, ...userData } = profileRes.data;
                setUserProfile(userData);
                setEditFormData(userData);


                const ordersRes = await axios.get(`${API_BASE_URL}/orders?userId=${userId}&select=*,order_details(*)`);
                setOrderHistory(ordersRes.data);
                const repairRes = await axios.get(`${API_BASE_URL}/repair-requests?userId=${userId}`);
                setRepairRequests(repairRes.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user profile or order history.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfileAndOrders();
    }, [userId]);

    // New function to handle order cancellation
    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await axios.put(`${API_BASE_URL}/orders/${orderId}/cancel`);
                alert('Order cancelled successfully!');
                // Update the state to reflect the change without re-fetching all data
                setOrderHistory(orderHistory.map(order => 
                    order.id === orderId ? { ...order, delivery_status: 'cancelled' } : order
                ));
            } catch (err) {
                console.error('Error cancelling order:', err);
                alert('Failed to cancel order.');
            }
        }
    };
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
        // Explicitly create a new payload with only the fields to be updated
        // const updatePayload = {
        //     first_name: editFormData.first_name,
        //     last_name: editFormData.last_name,
        //     email: editFormData.email,
        //     phone_number: editFormData.phone_number,
        //     address: editFormData.address,
        // };

        // const res = await axios.put(`${API_BASE_URL}/users/${userId}`, updatePayload);

        // Re-fetch the user profile data to ensure all changes are reflected
        const profileRes = await axios.get(`${API_BASE_URL}/users/${userId}`);
        const { password, ...userData } = profileRes.data;
        setUserProfile(userData);

        setEditModalOpen(false);
        alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile.');
        }
    };

    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!userProfile) {
        return <div className="no-profile">No user profile found.</div>;
    }

    return (
        <div className="user-profile-container">
        <nav className="navbar">
                        <Link to="/" className="logo">PC-Market</Link>
                        <div className="nav-links">
                            <Link to="/">Home</Link>
                            <Link to="/custom-built">Custom Built</Link>
                            <Link to="/profile">My Profile</Link>
                        </div>
                    </nav>
            <h1>My Profile</h1>
            <div className="profile-details">
                <p><strong>Name:</strong> {userProfile.first_name} {userProfile.last_name}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
                <p><strong>Phone:</strong> {userProfile.phone_number}</p>
                <p><strong>Address:</strong> {userProfile.address}</p>
                <button onClick={handleEditProfile} className="edit-profile-btn">Edit Profile</button>
            </div>

            <h2>Order History</h2>
            <div className="order-history">
                {orderHistory.length > 0 ? (
                    orderHistory.map(order => (
                        <div key={order.id} className="order-card">
                            <h3>Order #{order.id.substring(0, 8)}</h3>
                            <p><strong>Total:</strong> ₹{order.total_amount}</p>
                            <p><strong>Status:</strong> {order.delivery_status}</p>
                            <h4>Order Details:</h4>
                            <ul className="order-details-list">
                                {order.order_details && Array.isArray(order.order_details) ? (
                                    order.order_details.map(detail => (
                                        <li key={detail.id}>
                                            <p>Item Type: {detail.item_type}</p>
                                            <p>Quantity: {detail.quantity}</p>
                                            <p>Unit Price: ₹{detail.unit_price}</p>
                                        </li>
                                    ))
                                ) : (
                                    <li>No details available.</li>
                                )}
                            </ul>

                            {order.delivery_status === 'pending' && (
                                <button 
                                    onClick={() => handleCancelOrder(order.id)} 
                                    className="cancel-order-btn"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No orders found.</p>
                )}
                <h2>My Repair Requests</h2>
            <div className="repair-requests-list">
                {repairRequests.length > 0 ? (
                    repairRequests.map(req => (
                        <div key={req.id} className="repair-card">
                            <p><strong>Issue:</strong> {req.issue_description}</p>
                            <p><strong>Status:</strong> {req.status}</p>
<p><strong>Price:</strong> {req.price != null ? `₹${req.price}` : 'Not priced yet'}</p>
<p><strong>Expected Date :</strong> {req.delivery_date || 'Not yet Examined'}</p>

                        </div>
                    ))
                ) : (
                    <p>No repair requests submitted.</p>
                )}
            </div>
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

export default UserProfile;