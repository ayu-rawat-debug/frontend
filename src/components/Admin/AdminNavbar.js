import React from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <div className="admin-nav-left">
        <Link to="/admin" className="admin-nav-btn">Home</Link>
      </div>
      
      <div className="admin-nav-center">
        {/* Product Management */}
        <div className="dropdown">
          <span className="admin-nav-btn">Products</span>
          <div className="dropdown-content">
            <Link to="/admin/products/add" className="dropdown-link">Add Product</Link>
            <Link to="/admin/products/manage" className="dropdown-link">Manage Products</Link>
          </div>
        </div>

        {/* Refurbished Items Management */}
        <div className="dropdown">
          <span className="admin-nav-btn">Refurbished</span>
          <div className="dropdown-content">
            <Link to="/admin/refurbished/add" className="dropdown-link">Add Item</Link>
            <Link to="/admin/refurbished/manage" className="dropdown-link">Manage Items</Link>
          </div>
        </div>
        
        {/* Custom Built Management */}
        <div className="dropdown">
          <span className="admin-nav-btn">Builds</span>
          <div className="dropdown-content">
            <Link to="/admin/custom-builds/add" className="dropdown-link">CustomBuilt</Link>
          </div>
        </div>

      <div className="dropdown">
  <span className="admin-nav-btn">Technicians</span>
  <div className="dropdown-content">
    <Link to="/admin/technicians/add" className="dropdown-link">Add Technician</Link>
    <Link to="/admin/technicians/manage" className="dropdown-link">Manage Technicians</Link>
  <Link to="/admin/repair-requests/manage" className="dropdown-link">Manage Repair Requests</Link>
  </div>
</div>

<div className="dropdown">
  <span className="admin-nav-btn">Suppliers</span>
  <div className="dropdown-content">
    <Link to="/admin/suppliers/add" className="dropdown-link">Add Supplier</Link>
    <Link to="/admin/suppliers/manage" className="dropdown-link">Manage Suppliers</Link>
  </div>
</div>
        {/* Analytics */}
        <Link to="/admin/analytics" className="admin-nav-btn">Analytics</Link>
      </div>


    </nav>
  );
};

export default AdminNavbar;