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
                // Fetch the single item by its ID. We use 'products' as a general endpoint.
                const response = await axios.get(`${API_BASE_URL}/products/${id}`);
                setItem(response.data);
            } catch (err) {
                console.error("Failed to fetch product details:", err);
                setError("Product not found or an error occurred.");
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
        return <div className="loading">Loading product details...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!item) {
        return <div className="error">Product data is missing.</div>;
    }

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
                    <p className="product-desc">{item.description}</p>
                    <p className="product-specs">{item.specs}</p>
                    <p className="product-grade">Grade: {item.grade}</p>
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