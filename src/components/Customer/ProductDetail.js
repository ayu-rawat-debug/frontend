import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../pages/CustomerHomePage.css';

const API_BASE_URL = 'https://pc-parts-marketplace-website.onrender.com/api';

const ProductDetail = ({ onAddToCart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                // CORRECTED: Use the unified API endpoint for all items
                const response = await axios.get(`${API_BASE_URL}/items/${id}`);
                setItem(response.data);
            } catch (err) {
                console.error("Failed to fetch item details:", err);
                setError("Item not found or an error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetails();
    }, [id]);

    const handleAddToCart = () => {
        if (item) {
            onAddToCart(item, item.type);
            alert(`${item.name} added to cart!`);
        }
    };

    if (loading) {
        return <div className="loading">Loading item details...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!item) {
        return <div className="error">Item data is missing.</div>;
    }

    const renderSpecs = (specs) => {
        if (typeof specs === 'object' && specs !== null) {
            return Object.entries(specs).map(([key, value]) => (
                <div key={key} className="spec-item">
                    <strong>{key.replace(/_/g, ' ')}:</strong> {value}
                </div>
            ));
        }
        return <p>{specs}</p>;
    };

    return (
        <div className="product-detail-container">
            <div className="detail-content">
                <img
                    src={item.photo_url || 'https://via.placeholder.com/600'}
                    alt={item.name}
                    className="product-image"
                />
                <div className="product-info">
                    <h2 className="product-name">{item.name}</h2>
                    <p className="product-price">₹{item.price}</p>
                    
                    {/* Conditionally render description if it exists */}
                    {item.description && <p className="product-desc">Description: {item.description}</p>}
                    
                    {/* Display warranty based on the item type */}
                    <p className="product-warranty">Warranty: {item.warranty} {item.type === 'product' ? 'months' : 'days'}</p>

                    <div className="product-specs-container">
                        <h3>Specifications:</h3>
                        {renderSpecs(item.specs)}
                    </div>
                    
                    {/* Conditionally render grade if it exists */}
                    {item.grade && <p className="product-grade">Grade: {item.grade}</p>}

                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                    <button className="back-link" onClick={() => navigate(-1)}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;