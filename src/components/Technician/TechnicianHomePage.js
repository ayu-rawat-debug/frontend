import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../Login/AuthContext';
import '../../pages/Technician.css';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

const TechnicianHomePage = () => {
    const { user } = useAuth();
    const technicianId = user?.id;
    const [assignedRepairs, setAssignedRepairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: null,
        status: '',
        notes: ''
    });

    useEffect(() => {
        const fetchAssignedRepairs = async () => {
            if (!technicianId) {
                setError('Technician ID is not available. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const repairsRes = await axios.get(`${API_BASE_URL}/technicians/${technicianId}/repairs`);
                let data = repairsRes.data;
                if (data && typeof data === 'object' && data.repairs) { 
                    data = data.repairs; 
                }
                if (Array.isArray(data)) {
                    setAssignedRepairs(data);
                } else {
                    setAssignedRepairs([]); 
                }
            } catch (err) {
                console.error('Error fetching assigned repairs:', err);
                setError('Failed to load assigned repairs.');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedRepairs();
    }, [technicianId]);

    const handleOpenEditModal = (repair) => {
        setEditFormData({
            id: repair.id,
            status: repair.status,
            notes: repair.notes || ''
        });
        setEditModalOpen(true);
    };

    const handleModalChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/technicians/repair-assignments/${editFormData.id}`, editFormData);
            alert('Repair status updated successfully!');
            setEditModalOpen(false);
            setAssignedRepairs(assignedRepairs.map(repair =>
                repair.id === editFormData.id ? { ...repair, status: editFormData.status, notes: editFormData.notes } : repair
            ));
        } catch (err) {
            console.error('Error updating repair status:', err);
            alert('Failed to update repair status.');
        }
    };
    
    if (loading) return <div className="loading">Loading assigned repairs...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="technician-home-page-content">
            <h1 className="main-title">Assigned Repairs</h1>

            <div className="repairs-list">
                {assignedRepairs.length > 0 ? (
                    assignedRepairs.map(repair => (
                        <div key={repair.id} className="repair-card">
                            <h3>Repair Request #{repair.repair_request_id.substring(0, 8)}</h3>
                            <p><strong>Issue:</strong> {repair.repair_request ? repair.repair_request.issue_description : 'N/A'}</p>
                            <p><strong>Status:</strong> {repair.status}</p>
                            <p><strong>Notes:</strong> {repair.notes || 'No notes'}</p>
                      {repair.repair_request && repair.repair_request.photo_path && (
        <div className="repair-photo-container">
            {console.log('Image URL from database:', repair.repair_request.photo_path)}
            <img src={repair.repair_request.photo_path} alt="Repair item" className="repair-photo" />
        </div>
    )}
                            <div className="card-actions">
                                <button onClick={() => handleOpenEditModal(repair)} className="edit-btn">Update Status</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No new repair requests assigned.</p>
                )}
            </div>

            {/* Status Update Modal */}
            {editModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={() => setEditModalOpen(false)} className="modal-close-btn">&times;</button>
                        <h3>Update Repair Status</h3>
                        <form onSubmit={handleUpdateStatus}>
                            <div className="form-group">
                                <label>Status:</label>
                                <select name="status" value={editFormData.status} onChange={handleModalChange}>
                                    <option value="assigned">Assigned</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Notes:</label>
                                <textarea name="notes" value={editFormData.notes} onChange={handleModalChange}></textarea>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-btn">Save</button>
                                <button type="button" onClick={() => setEditModalOpen(false)} className="cancel-btn">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TechnicianHomePage;