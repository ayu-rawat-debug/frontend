// File: src/components/Admin/AddProduct.js
import React, { useState } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import '../../pages/shared-admin.css';

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api/products';

const AddProduct = () => {
    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (formData) => {
        setStatusMessage('Adding product...');
        console.log('Submitting form data:', formData);
        try {
            await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setStatusMessage('Product added successfully! ✅');
            setIsSuccess(true);
        } catch (error) {
            console.error('Failed to add product:', error.response ? error.response.data : error.message);
            if (error.response && error.response.data && error.response.data.message) {
                setStatusMessage(error.response.data.message);
            } else {
                setStatusMessage('Failed to add product. Please try again. ❌');
            }
            setIsSuccess(false);
        }
    };

    return (
            <div className="admin-container">
                <h2 className="admin-heading">Add New Product</h2>
                {statusMessage && (
                    <div className={`status-message ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                        {statusMessage}
                    </div>
                )}
                <ProductForm onSubmit={handleSubmit} />
            </div>
    );
};

export default AddProduct;