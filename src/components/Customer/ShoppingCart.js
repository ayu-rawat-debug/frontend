import React from 'react';
import '../../pages/CustomerHomePage.css'; // Correct path to CSS

const ShoppingCart = ({ cart, setCart, onClose, onCheckout }) => {
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    

    const handleRemoveFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const handleIncrement = (itemId) => {
        setCart(cart.map(item =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const handleDecrement = (itemId) => {
        setCart(cart.map(item =>
            item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Your Shopping Cart</h2>
                {cart.length === 0 ? (
                    <p className="empty-cart">Your cart is empty.</p>
                ) : (
                    <div>
                        {cart.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.photo_url} alt={item.name} />
                                <div className="item-details">
                                    <h4>{item.name}</h4>
                                    <p>₹{item.price} x {item.quantity}</p>
                                </div>
                                <div className="item-controls">
                                    <button onClick={() => handleDecrement(item.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => handleIncrement(item.id)}>+</button>
                                </div>
                                <button onClick={() => handleRemoveFromCart(item.id)} className="remove-btn">Remove</button>
                            </div>
                        ))}
                        <div className="cart-footer">
                            <h3>Total: ₹{totalPrice}</h3>
                            <button onClick={onCheckout} className="checkout-btn">
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;