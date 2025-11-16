import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../pages/CustomerHomePage.css';
import { useAuth } from '../Login/AuthContext'; 

const API_BASE_URL = 'https://pc-parts-marketplace-website.onrender.com/api';
const MAX_BUILDS = 2;

const CustomBuiltPage = () => {
    // State to hold all available parts for building
    const [availableParts, setAvailableParts] = useState({ products: [], refurbished: [] });
    // State to manage the user's current build
    const [currentBuild, setCurrentBuild] = useState([]);
    // State to hold all the user's previously saved builds
    const [userBuilds, setUserBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [setIsBuildSaved] = useState(false);
    const [editBuildId, setEditBuildId] = useState(null);
    
    const [editMode, setEditMode] = useState(false);
    const [editModal, setEditModal] = useState({ 
        isOpen: false, 
        build: null, 
        newName: '', 
        newNotes: '' 
    });

    // Hardcoded user ID for now, this should come from auth
    const { user } = useAuth(); // Get the user object from the auth context
    const userId = user?.id;
    
    useEffect(() => {
        const fetchAllData = async () => {
        try {
            // Debugging line to see the exact URL being requested
            console.log(`Fetching parts from: ${API_BASE_URL}/custom-built/parts`);
            const partsRes = await axios.get(`${API_BASE_URL}/custom-built/parts`);
            setAvailableParts(partsRes.data);
            
            console.log(`Fetching user builds from: ${API_BASE_URL}/custom-built?userId=${userId}`);
const buildsRes = await axios.get(`${API_BASE_URL}/custom-built?userId=${userId}`);
            setUserBuilds(buildsRes.data);
            
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load parts or user builds. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    if (userId) {
        fetchAllData();
        console.log('The userId being used is:', userId);
    } else {
        setLoading(false);
        setError('Please log in to use the custom built feature.');
    }
}, [userId]);

    const handleAddToBuild = (part) => {
        setCurrentBuild([...currentBuild, part]);
    };

    const handleRemoveFromBuild = (partId) => {
        setCurrentBuild(currentBuild.filter(part => part.id !== partId));
    };

    const handleSaveBuild = async () => {
    // Check for build limit
    if (userBuilds.length >= MAX_BUILDS) {
        alert(`You have reached the maximum of ${MAX_BUILDS} custom builds.`);
        return;
    }

    // Get build name from user
    const buildName = prompt("Enter a name for your build:");
    if (!buildName) return;

    // Ensure a user ID exists before proceeding
    if (!userId) {
        setError('User ID is missing. Cannot save build.');
        alert('Please log in to save a build.');
        return;
    }

    const builtData = {
        user_id: userId,
        name: buildName,
        specs: currentBuild,
        total_price: currentBuild.reduce((sum, part) => sum + part.price, 0),
        source: 'user', 
        is_public: false,
        notes: '',
    };
    console.log('Sending data to backend:', builtData);

    try {
        await axios.post(`${API_BASE_URL}/custom-built`, builtData);
        alert('Build saved successfully!');
        setCurrentBuild([]);
        setIsBuildSaved(true);
        // Re-fetch user builds to update the list
        const buildsRes = await axios.get(`${API_BASE_URL}/custom-built?userId=${userId}`);
        setUserBuilds(buildsRes.data);
    } catch (err) {
        console.error('Error saving build:', err);
        alert('Failed to save build.');
    }
};
    const handleDeleteBuild = async (buildId) => {
        if (window.confirm('Are you sure you want to delete this build?')) {
            try {
                await axios.delete(`${API_BASE_URL}/custom-built/${buildId}`);
                alert('Build deleted successfully!');
                setUserBuilds(userBuilds.filter(build => build.id !== buildId));
            } catch (err) {
                console.error('Error deleting build:', err);
                alert('Failed to delete build.');
            }
        }
    };

const handleOpenEditMode = (build) => {
        setEditMode(true);
        setEditBuildId(build.id);
        setCurrentBuild([...build.specs]); // Load the saved specs into the builder
        // The modal is no longer a separate component; the main UI becomes the "modal"
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handler for canceling the edit mode
    const handleCancelEdit = () => {
        setEditMode(false);
        setEditBuildId(null);
        setCurrentBuild([]);
    };

    const handleCloseEditModal = () => {
        setEditModal({ isOpen: false, build: null, newName: '', newNotes: '' });
    };

   const handleUpdateBuild = async () => {
        // Find the build name and notes from the original build object
        const originalBuild = userBuilds.find(build => build.id === editBuildId);

        try {
            const updatedData = {
                name: originalBuild.name, // Keep the original name
                notes: originalBuild.notes, // Keep the original notes
                specs: currentBuild, // Send the new specs from the current builder
                total_price: currentBuild.reduce((sum, part) => sum + part.price, 0),
            };

            await axios.put(`${API_BASE_URL}/custom-built/${editBuildId}`, updatedData);
            alert('Build updated successfully!');
            setEditMode(false); // Exit edit mode
            setEditBuildId(null);
            setCurrentBuild([]); // Clear the current builder

            // Re-fetch builds to show the updated data
            const buildsRes = await axios.get(`${API_BASE_URL}/custom-built?userId=${userId}`);
            setUserBuilds(buildsRes.data);
        } catch (err) {
            console.error('Error updating build:', err);
            alert('Failed to update build.');
        }
    };
    
    if (loading) return <div className="loading">Loading custom builder...</div>;
    if (error) return <div className="error">{error}</div>;

    const totalPrice = currentBuild.reduce((sum, part) => sum + part.price, 0);

    return (
        <div className="custom-built-container">
                    <nav className="navbar">
                <Link to="/" className="logo">PC-Market</Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/profile">My Profile</Link>
                </div>
            </nav>
            <h1 className="main-title">Custom PC Builder</h1>
            
<div className="build-section">
                <h2>Your Saved Builds</h2>
                {userBuilds.length > 0 ? (
                    <div className="saved-builds-list">
                        {userBuilds.map(build => (
                            <div key={build.id} className="saved-build-card">
                                <h3>{build.name}</h3>
                                <p>Total Price: ₹{build.total_price}</p>
                                <h4>Components:</h4>
<ul>
                        {build.specs && Array.isArray(build.specs) ? (
                            build.specs.map((component, index) => (
                                <li key={index}>{component.name} - ₹{component.price}</li>
                            ))
                        ) : (
                            <li>No detailed specs available.</li>
                        )}
                    </ul>
                                <div className="build-actions">
                                    <button onClick={() => handleOpenEditMode(build)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDeleteBuild(build.id)} className="delete-btn">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no saved custom builds yet. Start building one!</p>
                )}
            </div>
<div className="build-section">
                <h2>{editMode ? "Edit Your Build" : "Your Current Build"}</h2>
                <div className="current-built-summary">
                    {currentBuild.length > 0 ? (
                        <ul>
                            {currentBuild.map(part => (
                                <li key={part.id}>
                                    <span>{part.name}</span>
                                    <span>₹{part.price}</span>
                                    <button onClick={() => handleRemoveFromBuild(part.id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No parts added yet.</p>
                    )}
                    <h3>Total Price: ₹{totalPrice}</h3>
                    {editMode ? (
                        <>
                            <button onClick={handleUpdateBuild} className="update-btn">Save Changes</button>
                            <button onClick={handleCancelEdit} className="cancel-btn">Cancel Edit</button>
                        </>
                    ) : (
                        <button onClick={handleSaveBuild} disabled={currentBuild.length === 0} className="save-build-btn">
                            Save Build
                        </button>
                    )}
                </div>
            </div>

            <div className="build-section">
                <h2>Available Parts</h2>
                <div className="available-parts-list">
                    <h3 className="section-title">Products</h3>
                    {availableParts.products.map(part => (
                        <div key={part.id} className="part-card">
                            <span>{part.name}</span>
                            <span>₹{part.price}</span>
                            <button onClick={() => handleAddToBuild(part)}>Add to Built</button>
                        </div>
                    ))}
                    <h3 className="section-title">Refurbished Items</h3>
                    {availableParts.refurbished.map(part => (
                        <div key={part.id} className="part-card">
                            <span>{part.name}</span>
                            <span>₹{part.price}</span>
                            <button onClick={() => handleAddToBuild(part)}>Add to Built</button>
                        </div>
                    ))}
                    
                </div>
            </div>
                {editModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={handleCloseEditModal} className="modal-close-btn">&times;</button>
                        <h3>Edit Build: {editModal.build.name}</h3>
                        
                        {/* Input field for editing name */}
                        <div className="form-group">
                            <label htmlFor="editName">Name:</label>
                            <input
                                id="editName"
                                type="text"
                                value={editModal.newName}
                                onChange={(e) => setEditModal({ ...editModal, newName: e.target.value })}
                            />
                        </div>
                        
                        {/* Textarea for editing notes */}
                        <div className="form-group">
                            <label htmlFor="editNotes">Notes:</label>
                            <textarea
                                id="editNotes"
                                value={editModal.newNotes}
                                onChange={(e) => setEditModal({ ...editModal, newNotes: e.target.value })}
                            />
                        </div>
                        
                        {/* The update button */}
                        <button onClick={handleUpdateBuild} className="update-btn">Update</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomBuiltPage;