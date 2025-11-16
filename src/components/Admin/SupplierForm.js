import React, { useState, useEffect } from 'react';
import '../../pages/shared-admin.css'; 

const SupplierForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        supplier_name: '',
        contact_person: '',
        phone_number: '',
        email: '',
        address: ''
    });

    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (formData.supplier_name.length > 25) {
            errors.supplier_name = 'Supplier name must not exceed 25 characters.';
            isValid = false;
        }

        if (formData.contact_person.length > 20) {
            errors.contact_person = 'Contact person name must not exceed 20 characters.';
            isValid = false;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.phone_number)) {
            errors.phone_number = 'Invalid phone number format. Must be a 10-digit Indian number.';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            errors.email = 'Invalid email format.';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData); // This is the crucial line
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <h2 className="text-2xl font-bold text-center text-white mb-6">
                {initialData ? 'Edit Supplier' : 'Add New Supplier'}
            </h2>
            
            <div className="form-field">
                <label htmlFor="supplier_name">Supplier Name</label>
                <input type="text" id="supplier_name" name="supplier_name" value={formData.supplier_name} onChange={handleChange} required />
                {validationErrors.supplier_name && <p className="error-message">{validationErrors.supplier_name}</p>}
            </div>
            
            <div className="form-field">
                <label htmlFor="contact_person">Contact Person</label>
                <input type="text" id="contact_person" name="contact_person" value={formData.contact_person} onChange={handleChange} required />
                {validationErrors.contact_person && <p className="error-message">{validationErrors.contact_person}</p>}
            </div>

            <div className="form-field">
                <label htmlFor="phone_number">Phone Number</label>
                <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                {validationErrors.phone_number && <p className="error-message">{validationErrors.phone_number}</p>}
            </div>

            <div className="form-field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}
            </div>

            <div className="form-field">
                <label htmlFor="address">Address</label>
                <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows="3" required></textarea>
            </div>
            
            <button type="submit" className="btn-rgb">{initialData ? 'Update Supplier' : 'Add Supplier'}</button>
            {initialData && (
                <button type="button" className="btn-cancel" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
};

export default SupplierForm;