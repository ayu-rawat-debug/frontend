// File: components/Admin/OrderUpdateModal.js

import React, { useState } from 'react';
import '../../pages/shared-admin.css';

const OrderUpdateModal = ({ order, onUpdate, onClose }) => {
    const [updates, setUpdates] = useState({
        delivery_status: order.delivery_status,
        expected_delivery_date: order.expected_delivery_date,
        delivered_at: order.delivered_at,
        cash_collected: order.cash_collected || false,
        notes: order.notes || '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUpdates({
            ...updates,
            [name]: type === 'checkbox' ? checked : value,

        });
    };

const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...updates,
    delivered_at: updates.delivered_at ? new Date(updates.delivered_at).toISOString() : null,
        };
        onUpdate(order.id, payload);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Update Order #{order.id.substring(0, 8)}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Status:</label>
                        <select name="delivery_status" value={updates.delivery_status} onChange={handleChange}>
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Expected Delivery Date:</label>
                        <input type="date" name="expected_delivery_date" value={updates.expected_delivery_date || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Delivered At:</label>
                        <input type="datetime-local" name="delivered_at" value={updates.delivered_at || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group checkbox-group">
                        <label>Cash Collected:</label>
                        <input type="checkbox" name="cash_collected" checked={updates.cash_collected} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Notes:</label>
                        <textarea name="notes" value={updates.notes} onChange={handleChange}></textarea>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="btn-primary">Update</button>
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrderUpdateModal;