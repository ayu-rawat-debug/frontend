import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import '../../pages/ManageSupplier.css'; // Your shared admin CSS

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <header className="main-header">
                <div className="header-info">
                    <h1 className="header-title">Admin Dashboard</h1>
                    <p>PC Build, Parts Marketplace & Repair Solution</p>
                </div>
            </header>
            <div className="admin-content">
                <AdminNavbar />
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;