// File: src/components/Admin/ManageRepairRequests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../pages/shared-admin.css';

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api';

const ManageRepairRequests = () => {
    const [requests, setRequests] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRequestId, setCurrentRequestId] = useState(null);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [price, setPrice] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [requestsRes, techniciansRes] = await Promise.all([
                axios.get(`${API_URL}/admin/repair-requests/pending`),
                axios.get(`${API_URL}/technicians`)
            ]);
            setRequests(requestsRes.data);
            setTechnicians(techniciansRes.data);
            setStatusMessage('');
        } catch (error) {
            setStatusMessage('Failed to fetch data. ❌');
            setIsSuccess(false);
            console.error('Error fetching data:', error);
        }
    };

    const handleOpenManageModal = (request) => {
        setCurrentRequestId(request.id);
        setSelectedTechnicianId('');
        setPrice(request.price || '');
        setDeliveryDate(request.delivery_date || '');
        setIsModalOpen(true);
    };

    const handleUpdateRepair = async () => {
        if (!selectedTechnicianId) {
            setStatusMessage('Please select a technician. ⚠️');
            setIsSuccess(false);
            return;
        }

        try {
            // Update the repair request itself
            await axios.put(`${API_URL}/admin/repair-requests/${currentRequestId}`, {
                price: price,
                delivery_date: deliveryDate,
                technician_id: selectedTechnicianId
            });
            setStatusMessage('Repair updated and assigned successfully. ✅');
            setIsSuccess(true);
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            setStatusMessage('Failed to update repair. ❌');
            setIsSuccess(false);
            console.error('Failed to update repair:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentRequestId(null);
        setSelectedTechnicianId('');
        setPrice('');
        setDeliveryDate('');
    };

    return (
        <div className="admin-container">
            <h2 className="admin-heading">Manage Repair Requests</h2>
            {statusMessage && <div className={`status-message ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>{statusMessage}</div>}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Issue</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.user_name}</td>
                            <td>{request.issue_description}</td>
                            <td>{request.status}</td>
                            <td>
                                <button onClick={() => handleOpenManageModal(request)} className="btn-manage">Manage</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <span className="close-btn" onClick={handleCloseModal}>&times;</span>
                        <h3>Manage Repair Request</h3>
                        <div className="form-field">
                            <label>Select Technician</label>
                            <select value={selectedTechnicianId} onChange={(e) => setSelectedTechnicianId(e.target.value)} required>
                                <option value="">-- Select a Technician --</option>
                                {technicians.map((tech) => (
                                    <option key={tech.id} value={tech.id}>{tech.first_name} {tech.last_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Price</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>
                        <div className="form-field">
                            <label>Expected Delivery Date</label>
                            <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} required />
                        </div>
                        <div className="button-group modal-buttons">
                            <button onClick={handleUpdateRepair} className="btn-update">Update & Assign</button>
                            <button onClick={handleCloseModal} className="btn-cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRepairRequests;