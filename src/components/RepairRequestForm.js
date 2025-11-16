import React, { useState } from 'react';
import axios from 'axios';
import '../../pages/RepairRequest.css'; // You'll need to create this CSS file

const RepairRequestForm = () => {
    const [issueDescription, setIssueDescription] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('userId', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'); 
        formData.append('issueDescription', issueDescription);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/repair-requests`, formData, {
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
                    <label>Issue Description:</label>
                    <textarea
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Upload Photo (optional):</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                </button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default RepairRequestForm;