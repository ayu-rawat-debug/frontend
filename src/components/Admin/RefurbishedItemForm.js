import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../pages/shared-admin.css'; 

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api/products';

const RefurbishedItemForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        category_id: '',
        supplier_id: '',
        name: '',
        condition: '',
        grade: '',
        specs: '{}',
        warranty_days: 0,
        price: 0,
        stock_qty: 0,
        refurbished_at: '',
        origin: '',
        photo:null
    });
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [setValidationErrors] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, suppliersRes] = await Promise.all([
                    axios.get(`${API_URL}/categories`),
                    axios.get(`${API_URL}/suppliers`)
                ]);
                setCategories(categoriesRes.data);
                setSuppliers(suppliersRes.data);
            } catch (error) {
                console.error('Failed to fetch categories or suppliers:', error);
            }
        };
        fetchData();
       const formatDateForInput = (isoString) => {
  if (!isoString) return ''; // ✅ fallback for empty/null
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16); // ✅ fallback for invalid date
}; 
      if (initialData) {
  setFormData({
    ...initialData,
    refurbished_at: formatDateForInput(initialData.refurbished_at),
    specs: JSON.stringify(initialData.specs || {}, null, 2)
  });
}

   }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };
const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Basic validations for required fields
    if (!formData.name) {
        errors.name = 'Item name is required.';
        isValid = false;
    } else if (formData.name.length > 100) {
        errors.name = 'Item name cannot exceed 100 characters.';
        isValid = false;
    }

    if (!formData.category_id) {
        errors.category_id = 'Category is required.';
        isValid = false;
    }

    if (!formData.supplier_id) {
        errors.supplier_id = 'Supplier is required.';
        isValid = false;
    }

    if (!formData.condition) {
        errors.condition = 'Condition is required.';
        isValid = false;
    }

    if (!formData.grade) {
        errors.grade = 'Grade is required.';
        isValid = false;
    }

    // Numeric validations
    if (parseFloat(formData.price) <= 0) {
        errors.price = 'Price must be greater than 0.';
        isValid = false;
    }

    if (parseInt(formData.stock_qty, 10) < 0) { // Stock can be 0
        errors.stock_qty = 'Stock quantity cannot be negative.';
        isValid = false;
    }
    
    // Warranty days validation (check if it's greater than 0)
    if (parseInt(formData.warranty_days, 10) <= 0) {
        errors.warranty_days = 'Warranty must be greater than 0 days.';
        isValid = false;
    }
    
    // Date validations
    const refurbishedDate = new Date(formData.refurbished_at);
    if (isNaN(refurbishedDate.getTime())) {
        errors.refurbished_at = 'Refurbished date is required and must be valid.';
        isValid = false;
    }

    // Check if 'origin' is provided if it's required
    if (!formData.origin) {
        errors.origin = 'Origin is required.';
        isValid = false;
    }

    // You might want to add validation for specs, e.g., check if it's a valid JSON
    try {
        JSON.parse(formData.specs);
    } catch (e) {
        errors.specs = 'Invalid JSON format for specifications.';
        isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
};
const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    const formPayload = new FormData();

    // Append all fields
    Object.keys(formData).forEach(key => {
      if (key === 'photo' && formData.photo) {
        formPayload.append('photo', formData.photo);
      } else {
        formPayload.append(key, formData[key]);
      }
    });

    if (initialData?.id) {
      formPayload.append('id', initialData.id);
    }

    onSubmit(formPayload);
  }
};



    return (
        <form onSubmit={handleSubmit} className="admin-form">
            <h2 className="text-2xl font-bold text-center text-white mb-6">
                {initialData ? 'Edit Refurbished Item' : 'Add New Refurbished Item'}
            </h2>
            {/* Form fields for each column */}
            <div className="form-field">
                <label htmlFor="category_id">Category</label>
                <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
            </div>
            <div className="form-field">
                <label htmlFor="supplier_id">Supplier</label>
                <select name="supplier_id" id="supplier_id" value={formData.supplier_id} onChange={handleChange} required>
                    <option value="">Select Supplier</option>
                    {suppliers.map(sup => <option key={sup.supplier_id} value={sup.supplier_id}>{sup.supplier_name}</option>)}
                </select>
            </div>
            <div className="form-field">
                <label htmlFor="name">Item Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-field">
                <label htmlFor="condition">Condition</label>
                <input type="text" name="condition" id="condition" value={formData.condition} onChange={handleChange} required />
            </div>
            <div className="form-field">
                <label htmlFor="grade">Grade</label>
                <input type="text" name="grade" id="grade" value={formData.grade} onChange={handleChange} required />
            </div>
            <div className="form-field">
                <label htmlFor="warranty_days">Warranty (Days)</label>
                <input type="number" name="warranty_days" id="warranty_days" value={formData.warranty_days} onChange={handleChange} required />
            </div>
            <div className="form-field">
                <label htmlFor="price">Price</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-field">
                <label htmlFor="stock_qty">Stock</label>
                <input type="number" name="stock_qty" id="stock_qty" value={formData.stock_qty} onChange={handleChange} required />
            </div>
            <div className="form-field">
                <label htmlFor="refurbished_at">Refurbished Date</label>
<input
  type="datetime-local"
  name="refurbished_at"
  id="refurbished_at"
  value={formData.refurbished_at} 
  onChange={handleChange}
  required
/>

            </div>
            <div className="form-field">
                <label htmlFor="origin">Origin</label>
                <input type="text" name="origin" id="origin" value={formData.origin} onChange={handleChange} required />
            </div>
            <div className="form-field">
  <label htmlFor="photo">Upload Photo</label>
  <input
    type="file"
    name="photo"
    id="photo"
    accept="image/*"
    onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.files[0] }))}
  />
</div>

                        <div className="form-field">
                <label htmlFor="specs">Specifications (JSON Format)</label>
                <textarea id="specs" name="specs" value={formData.specs} onChange={handleChange} rows="4" placeholder='e.g., {"CPU": "Ryzen 5", "RAM": "16GB"}' required></textarea>
            </div>
            
            <button type="submit" className="btn-rgb">
                {initialData ? 'Update Item' : 'Add Item'}
            </button>
            {initialData && (
                <button type="button" className="btn-cancel" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
};

export default RefurbishedItemForm;