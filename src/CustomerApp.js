// In CustomerApp.js

import React, { useState } from 'react';
import {Routes, Route } from 'react-router-dom';
import CustomerHomePage from './components/Customer/CustomerHomePage';
import ProductDetail from './components/Customer/ProductDetail'; 
import ShoppingCart from './components/Customer/ShoppingCart';
import UserProfile from './components/Customer/UserProfile';
import CustomBuiltPage from './components/Customer/CustomBuiltPage';
import { useAuth } from './components/Login/AuthContext';
import axios from 'axios';
// import Header from './components/Header';   

const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

const CustomerApp = () => {
    const { user } = useAuth();
    const userId = user?.id;
    const [cart, setCart] = useState([]);

    const handleAddToCart = (item, type) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === type);
        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem.id === item.id && cartItem.type === type
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            ));
        } else {
            setCart([...cart, { ...item, type, quantity: 1 }]);
        }
    };

    const handleCheckout = async () => {
        try {
            const userResponse = await axios.get(`${API_BASE_URL}/users/${userId}`);
            const userAddress = userResponse.data.address;

            const orderData = {
                userId: userId,
                delivery_address: userAddress,
                total_amount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
                order_details: cart.map(item => ({
                    item_id: item.id,
                    quantity: item.quantity,
                    price_at_order: item.price,
                    item_type: item.type,
                })),
            };
            console.log('Placing order with data:', orderData);
            await axios.post('http://pc-parts-marketplace-website.onrender.com/api/orders', orderData);
            
            setCart([]);
            alert('Checkout successful! Your order has been placed.');
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    return (
    <Routes>
        
        {/* 1. Root/Home Page */}
        <Route 
            path="/" 
            element={<CustomerHomePage 
                onAddToCart={handleAddToCart} 
                cart={cart} 
                setCart={setCart} 
                onCheckout={handleCheckout} 
            />} 
        />
        
        {/* 2. Detail Page (Must be defined before other paths to catch dynamic segments) */}
        <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
        
        {/* 3. Static Paths */}
        <Route path="/cart" element={<ShoppingCart 
            cart={cart} 
            setCart={setCart} 
            onCheckout={handleCheckout} 
        />} />
        
        <Route path="/profile" element={<UserProfile />} /> 
        <Route path="/custom-built" element={<CustomBuiltPage />} />

    </Routes>
);
};

export default CustomerApp;