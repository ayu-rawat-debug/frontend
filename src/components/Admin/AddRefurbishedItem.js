import React, { useState } from 'react';
import axios from 'axios';
import RefurbishedItemForm from './RefurbishedItemForm'; // Correct path
import '../../pages/shared-admin.css';

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api/refurbished';

const AddRefurbishedItem = () => {
    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (formData) => {
        try {
            await axios.post(API_URL, formData);
            setStatusMessage('Refurbished item added successfully! ✅');
            setIsSuccess(true);
        } catch (error) {
            setStatusMessage('Failed to add refurbished item. ❌');
            setIsSuccess(false);
            console.error('There was an error adding the refurbished item:', error);
        }
    };

    return (
 <div className="admin-container">
            <h2 className="admin-heading">Add Refurbished Item</h2>

            <RefurbishedItemForm onSubmit={handleSubmit} />

            {statusMessage && (
                <div className={`status-message ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                    {statusMessage}
                </div>
            )}
        </div>
    );
};

export default AddRefurbishedItem;