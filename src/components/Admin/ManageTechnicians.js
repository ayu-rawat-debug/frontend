import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../pages/shared-admin.css';

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api/technicians';

const ManageTechnicians = () => {
    const [technicians, setTechnicians] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        fetchTechnicians();
    }, []);

    const fetchTechnicians = async () => {
        try {
            const response = await axios.get(API_URL);
            setTechnicians(response.data);
            setStatusMessage('');
        } catch (error) {
            setStatusMessage('Failed to fetch technicians. ❌');
            setIsSuccess(false);
            console.error('Failed to fetch technicians:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this technician?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setStatusMessage('Technician deleted successfully. ✅');
                setIsSuccess(true);
                fetchTechnicians();
            } catch (error) {
                setStatusMessage('Failed to delete technician. ❌');
                setIsSuccess(false);
                console.error('Failed to delete technician:', error);
            }
        }
    };

    return (
        <div className="admin-container">
            <h2 className="admin-heading">Manage Technicians</h2>
            {statusMessage && (
                <div className={`status-message ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                    {statusMessage}
                </div>
            )}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {technicians.map((technician) => (
                        <tr key={technician.id}>
                            <td>{technician.first_name}</td>
                            <td>{technician.last_name}</td>
                            <td>{technician.email}</td>
                            <td>{technician.phone_number}</td>
                            <td>{technician.address}</td>
                            <td>
                                <div className="button-group">
                                    <button onClick={() => handleDelete(technician.id)} className="btn-delete">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageTechnicians;