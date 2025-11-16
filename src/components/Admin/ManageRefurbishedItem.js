import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../pages/shared-admin.css';
import RefurbishedItemForm from './RefurbishedItemForm';

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api/refurbished';

const ManageRefurbishedItems = () => {
    // State to hold all items and a filtered list for the search bar
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    
    // State for the search term
    const [searchTerm, setSearchTerm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Initial data fetch on component load
    useEffect(() => {
        fetchRefurbishedItems();
    }, []);

    // Filter items whenever the search term or the items list changes
    useEffect(() => {
        const results = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.condition.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredItems(results);
    }, [searchTerm, items]);

    const fetchRefurbishedItems = async () => {
        try {
            const response = await axios.get(API_URL);
            setItems(response.data);
            setFilteredItems(response.data); // Initialize filtered list with all items
            setStatusMessage('');
        } catch (error) {
            setStatusMessage('Failed to fetch refurbished items. ❌');
            setIsSuccess(false);
            console.error('Failed to fetch refurbished items:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this refurbished item?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setStatusMessage('Refurbished item deleted successfully. ✅');
                setIsSuccess(true);
                fetchRefurbishedItems();
            } catch (error) {
                setStatusMessage('Failed to delete refurbished item. ❌');
                setIsSuccess(false);
                console.error('Failed to delete refurbished item:', error);
            }
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleUpdate = async (updatedData) => {
        try {
            console.log('Sending update request for ID:', updatedData.id, 'with data:', updatedData);
            await axios.put(`${API_URL}/${updatedData.id}`, updatedData);
            setStatusMessage('Refurbished item updated successfully. ✅');
            setIsSuccess(true);
            setIsModalOpen(false);
            fetchRefurbishedItems();
        } catch (error) {
            setStatusMessage('Failed to update refurbished item. ❌');
            setIsSuccess(false);
            console.error('Failed to update refurbished item:', error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    // New handler for search input changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="admin-container">
            <h2 className="admin-heading">Manage Refurbished Items</h2>
            {statusMessage && (
                <div className={`status-message ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                    {statusMessage}
                </div>
            )}
            
            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search refurbished items..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Supplier</th>
                            <th>Condition</th>
                            <th>Grade</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Warranty</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.category.name}</td>
                                    <td>{item.supplier.supplier_name}</td>
                                    <td>{item.condition}</td>
                                    <td>{item.grade}</td>
                                    <td>₹{item.price}</td>
                                    <td>{item.stock_qty}</td>
                                    <td>{item.warranty_days} days</td>
                                    <td>
                                        <div className="button-group">
                                            <button onClick={() => handleEdit(item)} className="btn-edit">Edit</button>
                                            <button onClick={() => handleDelete(item.id)} className="btn-delete">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', color: '#888' }}>
                                    No items found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={handleCancel}>&times;</span>
                        <RefurbishedItemForm
                            initialData={currentItem}
                            onSubmit={handleUpdate}
                            onCancel={handleCancel}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRefurbishedItems;