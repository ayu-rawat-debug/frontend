import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../pages/shared-admin.css';

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api';

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        supplier_id: '',
        price: '',
        specs: '',
        stock_qty: '',
        warranty: '',
        photo: null, // This is now a file object
        company_name: '',
        origin: '',
        manufacture_date: '',
        buyed_at: ''
    });
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, suppliersRes] = await Promise.all([
                    axios.get(`${API_URL}/products/categories`),
                    axios.get(`${API_URL}/products/suppliers`)
                ]);
                setCategories(categoriesRes.data);
                setSuppliers(suppliersRes.data);
            } catch (error) {
                console.error('Failed to fetch categories or suppliers:', error);
            }
        };
        fetchData();
        
if (initialData) {
  setFormData({
    ...initialData,
    manufacture_date: initialData.manufacture_date
      ? new Date(initialData.manufacture_date).toISOString().substring(0, 16)
      : '',
    buyed_at: initialData.buyed_at
      ? new Date(initialData.buyed_at).toISOString().substring(0, 16)
      : '',
    specs: typeof initialData.specs === 'object'
      ? JSON.stringify(initialData.specs, null, 2)
      : initialData.specs || '',
  });
}

    }, [initialData]);
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prevData => ({ 
            ...prevData, 
            [name]: files ? files[0] : value
        }));
        if (validationErrors[name]) {
            setValidationErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (formData.name.length > 100) {
            errors.name = 'Product name cannot exceed 100 characters.';
            isValid = false;
        }

        if (parseFloat(formData.price) <= 0) {
            errors.price = 'Price must be greater than 0.';
            isValid = false;
        }

        if (parseInt(formData.stock_qty, 10) <= 0) {
            errors.stock_qty = 'Stock quantity must be greater than 0.';
            isValid = false;
        }

        if (parseInt(formData.warranty, 10) <= 0) {
            errors.warranty = 'Warranty must be greater than 0 months.';
            isValid = false;
        }

        const manufactureDate = new Date(formData.manufacture_date);
        const buyedAtDate = new Date(formData.buyed_at);
        if (buyedAtDate <= manufactureDate) {
            errors.buyed_at = 'Buy date must be after manufacture date.';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formPayload = new FormData();
if (formData.id) {
    formPayload.append('id', formData.id);
}

            console.log('Form Data before submission:', formData);
            Object.keys(formData).forEach(key => {
                if (key === 'photo' && formData[key]) {
                    formPayload.append(key, formData[key]);
                } else if (key !== 'photo') {
                    formPayload.append(key, formData[key]);
                }
            });
            onSubmit(formPayload);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="admin-form" encType="multipart/form-data">
            <h2 className="text-2xl font-bold text-center text-white mb-6">
                {initialData ? 'Edit Product' : 'Add New Product'}
            </h2>

            <div className="form-field">
                <label htmlFor="name">Product Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required maxLength="100" />
                {validationErrors.name && <p className="error-message">{validationErrors.name}</p>}
            </div>

            <div className="form-field">
                <label htmlFor="category_id">Category</label>
                <select id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} required>
                    <option value="">Select a Category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-field">
                <label htmlFor="supplier_id">Supplier</label>
                <select id="supplier_id" name="supplier_id" value={formData.supplier_id} onChange={handleChange} required>
                    <option value="">Select a Supplier</option>
                    {suppliers.map(sup => (
                        <option key={sup.supplier_id} value={sup.supplier_id}>{sup.supplier_name}</option>
                    ))}
                </select>
            </div>

            <div className="form-field">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required min="0.01" step="0.01" />
                {validationErrors.price && <p className="error-message">{validationErrors.price}</p>}
            </div>

            <div className="form-field">
                <label htmlFor="specs">Specifications (JSON Format)</label>
                <textarea id="specs" name="specs" value={formData.specs} onChange={handleChange} rows="4" placeholder='e.g., {"CPU": "Ryzen 5", "RAM": "16GB"}' required></textarea>
            </div>

            <div className="form-field">
                <label htmlFor="stock_qty">Stock Quantity</label>
                <input type="number" id="stock_qty" name="stock_qty" value={formData.stock_qty} onChange={handleChange} required min="1" />
                {validationErrors.stock_qty && <p className="error-message">{validationErrors.stock_qty}</p>}
            </div>

            <div className="form-field">
                <label htmlFor="warranty">Warranty (in months)</label>
                <input type="number" id="warranty" name="warranty" value={formData.warranty} onChange={handleChange} required min="1" />
                {validationErrors.warranty && <p className="error-message">{validationErrors.warranty}</p>}
            </div>

            <div className="form-field">
                <label htmlFor="photo">Product Photo</label>
                <input type="file" id="photo" name="photo" onChange={handleChange} accept="image/*" />
            </div>
            
            <div className="form-field">
                <label htmlFor="company_name">Company Name</label>
                <input type="text" id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} required />
            </div>

            <div className="form-field">
                <label htmlFor="origin">Origin</label>
                <input type="text" id="origin" name="origin" value={formData.origin} onChange={handleChange} required />
            </div>

<div className="form-field">
                <label htmlFor="manufacture_date">Manufacture Date</label>
                <input type="datetime-local" id="manufacture_date" name="manufacture_date" value={formData.manufacture_date} onChange={handleChange} required />
            </div>

<div className="form-field">
                <label htmlFor="buyed_at">Buy Date</label>
                <input type="datetime-local" id="buyed_at" name="buyed_at" value={formData.buyed_at} onChange={handleChange} required />
                {validationErrors.buyed_at && <p className="error-message">{validationErrors.buyed_at}</p>}
            </div>
            
            <button type="submit" className="btn-rgb">{initialData ? 'Update Product' : 'Add Product'}</button>
            {initialData && (
                <button type="button" className="btn-cancel" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
};

export default ProductForm;