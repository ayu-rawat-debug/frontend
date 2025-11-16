import React from 'react';
import {Routes, Route, Navigate } from 'react-router-dom';

// Admin Components
import AdminLayout from './components/Admin/AdminLayout';

// Supplier Components
import AddSupplier from './components/Admin/AddSupplier'; // Corrected path
import ManageSupplier from './components/Admin/ManageSupplier';

import ManageProducts from './components/Admin/ManageProducts';
import AddProduct from './components/Admin/AddProduct';

import AddRefurbished from './components/Admin/AddRefurbishedItem';
import ManageRefurbished from './components/Admin/ManageRefurbishedItem';

import AddCustomBuilt from './components/Admin/CustomBuilt';
import ManageCustomBuilt from './components/Admin/ManageCustomBuilt';

import AddTechnician from './components/Admin/AddTechnician';
import ManageTechnicians from './components/Admin/ManageTechnicians';
import ManageRepairRequests from './components/Admin/ManageRepairRequests';

import Analytics from './components/Admin/Analytics';
import ManageOrders from './components/Admin/Home';
// import Header from './components/Header';
import './App.css';

function App() {
    return (
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/admin" />} />
                    
                    <Route path="/admin" element={<AdminLayout />}>
                        {/* Default route for the admin section */}
                        <Route index element={<ManageOrders />} />
                        
                        {/* Supplier Routes */}
                        <Route path="suppliers/add" element={<AddSupplier />} />
                        <Route path="suppliers/manage" element={<ManageSupplier />} />

                        {/* Product Routes */}
                        <Route path="products/add" element={<AddProduct />} />
                        <Route path="products/manage" element={<ManageProducts />} />
                        
                        {/* Refurbished Routes */}
                        <Route path="refurbished/add" element={<AddRefurbished />} />
                        <Route path="refurbished/manage" element={<ManageRefurbished />} />

                        {/* Custom Builds Routes */}
                        <Route path="custom-builds/add" element={<AddCustomBuilt />} />
                        <Route path="custom-builds/manage" element={<ManageCustomBuilt />} />

                        <Route path="repair-requests/manage" element={<ManageRepairRequests />} />
                        <Route path="technicians/add" element={<AddTechnician />} />
                        <Route path="technicians/manage" element={<ManageTechnicians />} />

                        {/* Analytics Route */}
                        <Route path="analytics" element={<Analytics />} />
                        
                    </Route>
                </Routes>
            </div>
    );
}

export default App;