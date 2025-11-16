import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../pages/shared-admin.css'; // Corrected import path
import SupplierForm from './SupplierForm';
import Modal from '../Modal';

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api/suppliers';

const ManageSupplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(API_URL);
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleUpdate = async (updatedData) => {
        try {
            const response = await axios.put(`${API_URL}/${editingSupplier.supplier_id}`, updatedData);
            if (response.status === 200) {
                alert('Supplier updated successfully!');
                setIsModalOpen(false);
                setEditingSupplier(null);
                fetchSuppliers();
            }
        } catch (error) {
            console.error('Error updating supplier:', error);
            alert('Failed to update supplier.');
        }
    };

    const handleDelete = async (supplierId) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                const response = await axios.delete(`${API_URL}/${supplierId}`);
                if (response.status === 200) {
                    alert('Supplier deleted successfully!');
                    fetchSuppliers();
                }
            } catch (error) {
                console.error('Error deleting supplier:', error);
                alert('Failed to delete supplier.');
            }
        }
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-container">
            <h2 className="text-2xl font-bold text-center text-white mb-6">Manage Suppliers</h2>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by supplier name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Supplier Name</th>
                            <th>Contact Person</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.map(supplier => (
                            <tr key={supplier.supplier_id}>
                                <td>{supplier.supplier_name}</td>
                                <td>{supplier.contact_person}</td>
                                <td>{supplier.phone_number}</td>
                                <td>{supplier.email}</td>
                                <td>{supplier.address}</td>
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(supplier)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(supplier.supplier_id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {editingSupplier && (
                    <SupplierForm
                        initialData={editingSupplier}
                        onSubmit={handleUpdate}
                        onCancel={() => setIsModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ManageSupplier;