import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ShoppingCart from './ShoppingCart';
import RepairRequestForm from './RepairRequestForm';
import '../../pages/CustomerHomePage.css';
const API_BASE_URL = 'https://pc-parts-marketplace-website.onrender.com/api';

const CustomerHomePage = ({ cart = [], onAddToCart, setCart, onCheckout }) => {
    const [data, setData] = useState({ products: [], refurbished: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [publicBuilds, setPublicBuilds] = useState([]);
    // Add these two lines to fix the "not defined" errors
    const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
    const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);
    const [selectedBuild, setSelectedBuild] = useState(null);

    useEffect(() => {


        const fetchData = async () => {
            try {
                const productsResponse = await axios.get(`${API_BASE_URL}/products`);
                const refurbishedResponse = await axios.get(`${API_BASE_URL}/refurbished`);
                const publicBuildsResponse = await axios.get(`${API_BASE_URL}/public-builds`);
                setData({
                    products: productsResponse.data || [],
                    refurbished: refurbishedResponse.data || [],
                });
                setPublicBuilds(publicBuildsResponse.data || []);
            } catch (err) {
                console.error("API Fetch Error:", err);
                setError("Failed to load products. Check the server connection or API URL.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderItemCard = (item) => (
        <Link to={`/product/${item.id}`} key={item.id} className="item-card-link">
            <div className="item-card">

                <img
                    src={item.photo_url?.[0] || 'https://drive.google.com/file/d/1BWg8EI6vxcpEbUXSK3YvX8nL4KtZ35Iz'}
                    alt={item.name}
                    className="item-photo"
                />
                <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-price">₹{item.price}</p>
                </div>
            </div>
        </Link>
    );
    const handleViewBuild = (build) => {
        setSelectedBuild(build);
        setIsBuildModalOpen(true);
    };

    const handleCloseBuildModal = () => {
        setIsBuildModalOpen(false);
        setSelectedBuild(null);
    };

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="homepage-container">
            <nav className="navbar">
                <Link to="/" className="logo">PC-Market</Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/custom-built">Custom Built</Link>
                    <button onClick={() => setIsRepairModalOpen(true)} className="nav-btn">Repair Area</button>
                    <Link to="/profile">My Profile</Link>
                </div>
            </nav>
            <button className="view-cart-btn" onClick={() => setIsCartOpen(true)}>
                View Cart ({Array.isArray(cart) ? cart.length : 0})
            </button>
            <div className="product-section">
                <h2 className="section-title">New Products</h2>
                <div className="product-gallery">
                    {data.products.length > 0 ? (
                        data.products.map(item => renderItemCard(item))
                    ) : (
                        <p>No new products available.</p>
                    )}
                </div>
            </div>
            <div className="product-section">
                <h2 className="section-title">Refurbished Items</h2>
                <div className="product-gallery">
                    {data.refurbished.length > 0 ? (
                        data.refurbished.map(item => renderItemCard(item))
                    ) : (
                        <p>No refurbished items available.</p>
                    )}
                </div>
                 <h2 className="section-title">Pre Configure Custom Builds</h2>
                <div className="product-gallery">
                    {publicBuilds.length > 0 ? (
                        publicBuilds.map(build => (
                            <div key={build.id} className="item-card">
                                <div className="item-details">
                                    <h3 className="item-name">{build.name}</h3>
                                    <p className="item-price">₹{build.total_price} + Build Charges</p>
                                    <p className="item-specs">{build.notes}</p>
                                    <p  className="">
                                        Contact 8087375266 for More Info
                                    </p>
                                    <button onClick={() => handleViewBuild(build)} className="view-build-btn">
                                    View Details
                                </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No public custom builds available.</p>
                    )}
                </div>
            </div>

            {isCartOpen && (
                <ShoppingCart
                    cart={cart}
                    setCart={setCart} 
                    onCheckout={onCheckout}
                    onClose={() => setIsCartOpen(false)}
                />
            )}

            {isRepairModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={() => setIsRepairModalOpen(false)}>X</button>
                        <RepairRequestForm />
                    </div>
                </div>
            )}
            {isBuildModalOpen && selectedBuild && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={handleCloseBuildModal}>X</button>
                        <h3>{selectedBuild.name}</h3>
                        <p>Total Price: ₹{selectedBuild.total_price}</p>
                        <h4>Components:</h4>
                        <ul className="build-specs-list">
                            {selectedBuild.specs.map((spec, index) => (
                                <li key={index}>{spec.name} - ₹{spec.price}</li>
                            ))}
                        </ul>
                        <button className="add-to-cart-btn">
                            Contact for More Info
                        </button>
                    </div>
                </div>
            )}
        </div>
        
    );
};

export default CustomerHomePage;