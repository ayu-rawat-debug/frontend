import React, { useState } from 'react';
import axios from 'axios';
import '../../pages/CustomerHomePage.css';
import { useAuth } from '../Login/AuthContext'; 
const RepairRequestForm = () => {
    const { user } = useAuth(); // Get the user object from the auth context
    const userId = user?.id; 
    const [issueDescription, setIssueDescription] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('userId', userId); 
        formData.append('issueDescription', issueDescription);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('https://pc-parts-marketplace-website.onrender.com/api/repair-requests', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Repair request submitted successfully!');
            setIssueDescription('');
            setImage(null);

        } catch (err) {
            console.error('Form submission error:', err);
            setMessage('Failed to submit repair request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="repair-request-container">
            <form onSubmit={handleSubmit} className="repair-form">
                <h2>Submit a Repair Request</h2>
                <div className="form-group">
                    <label htmlFor="issueDescription">Issue Description:</label>
                    <textarea
                        id="issueDescription"
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUpload">Upload Photo :</label>
                    <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                </button>
                {message && <p className="form-message">{message}</p>}
            </form>
        </div>
    );
};

export default RepairRequestForm;