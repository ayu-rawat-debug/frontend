import React, { useState } from 'react';
import axios from 'axios';
import TechnicianForm from './TechnicianForm';
import '../../pages/shared-admin.css';

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api/technicians';

const AddTechnician = () => {
    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (formData) => {
        try {
            // Send the form data to the backend, including the role
            await axios.post(API_URL, { ...formData, role: 'technician' });
            setStatusMessage('Technician added successfully! ✅');
            setIsSuccess(true);
        } catch (error) {
            setStatusMessage('Failed to add technician. ❌');
            setIsSuccess(false);
            console.error('There was an error adding the technician:', error);
        }
    };

    return (
        <div className="admin-container">
            <h2 className="admin-heading">Add Technician</h2>
            {statusMessage && (
                <div className={`status-message ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                    {statusMessage}
                </div>
            )}
            <TechnicianForm onSubmit={handleSubmit} />
        </div>
    );
};

export default AddTechnician;