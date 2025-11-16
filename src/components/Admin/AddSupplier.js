import React, { useState } from 'react';
import axios from 'axios';
import '../../pages/shared-admin.css';
import SupplierForm from './SupplierForm';

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api/suppliers';

const AddSupplier = () => {
    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (formData) => {
        setStatusMessage('Adding supplier...');
        try {
            const response = await axios.post(API_URL, formData);
            if (response.status === 201) {
                setStatusMessage('Supplier added successfully! ✅');
                setIsSuccess(true);
            }
        } catch (error) {
            console.error('Failed to add supplier:', error.response ? error.response.data : error.message);
            
            // --- C H A N G E S   H E R E ---
            if (error.response && error.response.data && error.response.data.message) {
                // Display the specific message from the database/backend
                setStatusMessage(error.response.data.message);
            } else {
                // Fallback to a generic error message
                setStatusMessage('Failed to add supplier. Please try again. ❌');
            }
            // -----------------------------
            
            setIsSuccess(false);
        }
    };

    return (
        <div className="admin-container">
            <SupplierForm onSubmit={handleSubmit} />
            {statusMessage && (
                <div className={`status-message ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                    {statusMessage}
                </div>
            )}
        </div>
    );
};

export default AddSupplier;