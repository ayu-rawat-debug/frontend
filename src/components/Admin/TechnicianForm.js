import React, { useState } from 'react';
import '../../pages/shared-admin.css'; 

const TechnicianForm = ({ onSubmit, onCancel, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        first_name: '',
        last_name: '',
        email: '',
        password: '', // Add the password field here
        phone_number: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <h2 className="admin-heading">{initialData ? 'Edit Technician' : 'Add Technician'}</h2>
            <div className="form-field">
                <label>First Name</label>
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div className="form-field">
                <label>Last Name</label>
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
            <div className="form-field">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            
            {/* Add this new password field */}
            {!initialData && (
                <div className="form-field">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
            )}

            <div className="form-field">
                <label>Phone Number</label>
                <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
            </div>
            <div className="form-field">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn-rgb">
                {initialData ? 'Update Technician' : 'Add Technician'}
            </button>
            {initialData && (
                <button type="button" className="btn-cancel" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
};

export default TechnicianForm;