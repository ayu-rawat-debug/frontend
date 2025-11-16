// File: components/Admin/ManageOrders.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderUpdateModal from './OrderUpdateModal';
import '../../pages/shared-admin.css';

const API_URL = 'https://pc-parts-marketplace-website.onrender.com/api/orders/uncompleted';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [statusMessage, setStatusMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(API_URL);
            setOrders(response.data);
            setStatusMessage('');
        } catch (error) {
            setStatusMessage('Failed to fetch orders. ❌');
            setIsSuccess(false);
            console.error('Failed to fetch orders:', error);
        }
    };

    const handleEditClick = (order) => {
        setCurrentOrder(order);
        setIsModalOpen(true);
    };

    const handleUpdateOrder = async (orderId, updates) => {
        try {
            await axios.put(`https://pc-parts-marketplace-website.onrender.com/api/orders/${orderId}`, updates);
            setStatusMessage('Order updated successfully. ✅');
            setIsSuccess(true);
            setIsModalOpen(false);
            fetchOrders();
        } catch (error) {
            setStatusMessage('Failed to update order. ❌');
            setIsSuccess(false);
            console.error('Failed to update order:', error);
        }
    };

    const handleCancelUpdate = () => {
        setIsModalOpen(false);
        setCurrentOrder(null);
    };

    return (
        <div className="admin-container">
            <h2 className="admin-heading">Manage Uncompleted Orders</h2>
            {statusMessage && (
                <div className={`status-message ${isSuccess ? 'success' : 'error'}`}>
                    {statusMessage}
                </div>
            )}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Total Amount</th>
                            <th>Items</th>
                            <th>Delivery Address</th>
                            <th>Status</th>
                            <th>Expected Delivery</th>
                            <th>Delivered At</th>
                            <th>Cash Collected</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.users?.first_name} {order.users?.last_name}</td>
                                    <td>₹{order.total_amount}</td>
                                    <td>
                                        <ul>
                                            {order.order_details && order.order_details.map((detail, index) => (
                                                <li key={index}>
                                                    {detail.quantity}x {detail.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{order.delivery_address}</td>
                                    <td>{order.delivery_status}</td>
                                    <td>{order.expected_delivery_date}</td>
                                    <td>{order.delivered_at || 'N/A'}</td>
                                    <td>{order.cash_collected ? 'Yes' : 'No'}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(order)} className="btn-edit">
                                            Manage Order
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', color: '#888' }}>
                                    No uncompleted orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && currentOrder && (
                <OrderUpdateModal
                    order={currentOrder}
                    onUpdate={handleUpdateOrder}
                    onClose={handleCancelUpdate}
                />
            )}
        </div>
    );
};

export default ManageOrders;