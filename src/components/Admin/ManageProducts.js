// File: src/components/Admin/ManageProducts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../pages/shared-admin.css';
import ProductForm from './ProductForm';

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api/products';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const productResults = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(productResults);
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL);
            setProducts(response.data);
            setFilteredProducts(response.data);
            setStatusMessage('');
        } catch (error) {
            setStatusMessage('Failed to fetch products. ❌');
            setIsSuccess(false);
            console.error('Failed to fetch products:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setStatusMessage('Product deleted successfully. ✅');
                setIsSuccess(true);
                fetchProducts();
            } catch (error) {
                setStatusMessage('Failed to delete product. ❌');
                setIsSuccess(false);
                console.error('Failed to delete product:', error);
            }
        }
    };

    const handleEdit = (item) => {
        setCurrentProduct(item);
        setIsModalOpen(true);
    };

    
    const handleUpdate = async (updatedData) => {
        try {
            for (let pair of updatedData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
}

            const productId = updatedData.get('id');
            console.log('Updating product with ID:', productId);
if (!productId) {
    console.error('Missing product ID for update');
    setStatusMessage('Product ID missing. ❌');
    setIsSuccess(false);
    return;
}

            await axios.put(`${API_URL}/${updatedData.get('id')}`, updatedData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

            setStatusMessage('Item updated successfully. ✅');
            setIsSuccess(true);
            setIsModalOpen(false);
            fetchProducts();
        } catch (error) {
            setStatusMessage('Failed to update item. ❌');
            setIsSuccess(false);
            console.error('Failed to update item:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="admin-container">
            <h1 className="admin-heading">Manage Products</h1>
            {statusMessage && (
                <div className={`status-message ${isSuccess ? 'success' : 'error'}`}>
                    {statusMessage}
                </div>
            )}
            
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <h2>Products</h2>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Supplier</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Manufacture Date</th>
                            <th>Buy Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.category.name}</td>
                                <td>{product.supplier.supplier_name}</td>
                                <td>₹{product.price}</td>
                                <td>{product.stock_qty}</td>
                                <td>{new Date(product.manufacture_date).toLocaleDateString()}</td>
                                <td>{new Date(product.buyed_at).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEdit(product)} className="btn-edit">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="btn-delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={handleCancel}>&times;</span>
                        <ProductForm
                            initialData={currentProduct}
                            onSubmit={handleUpdate}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProducts;