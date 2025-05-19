import React, { useState } from "react";    
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AddItem.css";

function AddItem() {
    const navigate = useNavigate();
    const [inventory, setInventory] = useState({
        itemId: "",
        itemName: "",
        itemCategory: "",
        itemQty: "",
        itemDetails: "",
        itemImage: null,
    });

    // Add validation states
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const { itemId, itemName, itemCategory, itemQty, itemDetails, itemImage } = inventory;

    const oninputChange = (e) => {
        if (e.target.name === "itemImage") {
            setInventory({ ...inventory, [e.target.name]: e.target.files[0] });
            // Validate image
            validateField("itemImage", e.target.files[0]);
        } else {
            const { name, value } = e.target;
            setInventory({ ...inventory, [name]: value });
            // Mark field as touched
            setTouched({...touched, [name]: true});
            // Validate on change
            validateField(name, value);
        }
    };
    
    // Handle blur event for validation
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({...touched, [name]: true});
        validateField(name, value);
    };
    
    // Validate a single field
    const validateField = (name, value) => {
        let newErrors = {...errors};
        
        switch(name) {
            case 'itemId':
                if (!value.trim()) {
                    newErrors.itemId = 'Item ID is required';
                } else if (!/^[a-zA-Z0-9]{3,}$/.test(value)) {
                    newErrors.itemId = 'Item ID must be at least 3 alphanumeric characters';
                } else {
                    delete newErrors.itemId;
                }
                break;
                
            case 'itemName':
                if (!value.trim()) {
                    newErrors.itemName = 'Item name is required';
                } else if (value.length < 3) {
                    newErrors.itemName = 'Item name must be at least 3 characters';
                } else {
                    delete newErrors.itemName;
                }
                break;
                
            case 'itemCategory':
                if (!value) {
                    newErrors.itemCategory = 'Please select a category';
                } else {
                    delete newErrors.itemCategory;
                }
                break;
                
            case 'itemQty':
                if (!value) {
                    newErrors.itemQty = 'Quantity is required';
                } else if (isNaN(value) || parseInt(value) <= 0) {
                    newErrors.itemQty = 'Quantity must be a positive number';
                } else {
                    delete newErrors.itemQty;
                }
                break;
                
            case 'itemDetails':
                if (!value.trim()) {
                    newErrors.itemDetails = 'Item details are required';
                } else if (value.length < 10) {
                    newErrors.itemDetails = 'Please provide more detailed description (at least 10 characters)';
                } else {
                    delete newErrors.itemDetails;
                }
                break;
                
            case 'itemImage':
                if (value) {
                    // Check file type
                    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
                    if (!acceptedTypes.includes(value.type)) {
                        newErrors.itemImage = 'Only JPG, PNG, and GIF images are allowed';
                    } else if (value.size > 5 * 1024 * 1024) { // 5MB limit
                        newErrors.itemImage = 'Image size should be less than 5MB';
                    } else {
                        delete newErrors.itemImage;
                    }
                }
                break;
                
            default:
                break;
        }
        
        setErrors(newErrors);
    };
    
    // Validate all fields
    const validateForm = () => {
        // Validate all fields
        validateField('itemId', inventory.itemId);
        validateField('itemName', inventory.itemName);
        validateField('itemCategory', inventory.itemCategory);
        validateField('itemQty', inventory.itemQty);
        validateField('itemDetails', inventory.itemDetails);
        if (inventory.itemImage) {
            validateField('itemImage', inventory.itemImage);
        }
        
        // Mark all fields as touched
        setTouched({
            itemId: true,
            itemName: true,
            itemCategory: true,
            itemQty: true,
            itemDetails: true,
            itemImage: true
        });
        
        // Return true if no errors
        return Object.keys(errors).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields before submission
        if (!validateForm()) {
            alert("Please fix the errors in the form before submitting.");
            return; // Stop submission if validation fails
        }

        // Check if image is provided
        if (!inventory.itemImage) {
            alert("Please select an image for the item.");
            setTouched({...touched, itemImage: true});
            setErrors({...errors, itemImage: "Image is required"});
            return;
        }

        try {
            // First upload the image
            const formData = new FormData();
            formData.append("file", inventory.itemImage);
            let imageName = "";

            try {
                const response = await axios.post(
                    "http://localhost:8080/inventory/itemImg",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                imageName = response.data;
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Error uploading image. Please try again.");
                return;
            }

            // Then save the inventory item with the image name
            const updateInventory = { ...inventory, itemImage: imageName };
            await axios.post("http://localhost:8080/inventory", updateInventory);
            alert("Item added successfully");
            navigate("/allitems"); // Use navigate instead of window.location.reload
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Error adding item. Please try again.");
        }
    };

    return (
        <div className="add-item-container">
            <div className="add-item-card">
                <h1>Add New Item</h1>

                <form onSubmit={(e) => onSubmit(e)} className="add-item-form">
                    <div className="form-group">
                        <label htmlFor="itemId">Item ID:</label>
                        <input 
                            type="text" 
                            id="itemId" 
                            name="itemId" 
                            onChange={oninputChange} 
                            onBlur={handleBlur}
                            value={itemId} 
                            className={touched.itemId && errors.itemId ? 'input-error' : ''}
                        />
                        {touched.itemId && errors.itemId && <span className="error-message">{errors.itemId}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="itemName">Item Name:</label>
                        <input 
                            type="text" 
                            id="itemName" 
                            name="itemName" 
                            onChange={oninputChange} 
                            onBlur={handleBlur}
                            value={itemName} 
                            className={touched.itemName && errors.itemName ? 'input-error' : ''}
                        />
                        {touched.itemName && errors.itemName && <span className="error-message">{errors.itemName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="itemCategory">Item Category:</label>
                        <select 
                            id="itemCategory" 
                            name="itemCategory" 
                            onChange={oninputChange} 
                            onBlur={handleBlur}
                            value={itemCategory} 
                            className={touched.itemCategory && errors.itemCategory ? 'input-error' : ''}
                        >
                            <option value="">Select Item Category</option>
                            <option value="Apparel & Fashion">Apparel & Fashion</option>
                            <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                            <option value="Health & Beauty">Health & Beauty</option>
                            <option value="Food & Dining">Food & Dining</option>
                            <option value="Home & Furniture">Home & Furniture</option>
                        </select>
                        {touched.itemCategory && errors.itemCategory && <span className="error-message">{errors.itemCategory}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="itemQty">Item Quantity:</label>
                        <input 
                            type="number" 
                            id="itemQty" 
                            name="itemQty" 
                            onChange={oninputChange} 
                            onBlur={handleBlur}
                            value={itemQty} 
                            className={touched.itemQty && errors.itemQty ? 'input-error' : ''}
                        />
                        {touched.itemQty && errors.itemQty && <span className="error-message">{errors.itemQty}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="itemDetails">Item Details:</label>
                        <textarea 
                            id="itemDetails" 
                            name="itemDetails" 
                            onChange={oninputChange} 
                            onBlur={handleBlur}
                            value={itemDetails} 
                            className={touched.itemDetails && errors.itemDetails ? 'input-error' : ''}
                        ></textarea>
                        {touched.itemDetails && errors.itemDetails && <span className="error-message">{errors.itemDetails}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="itemImage">Item Image:</label>
                        <input
                            type="file"
                            id="itemImage"
                            name="itemImage"
                            accept="image/*"
                            onChange={oninputChange}
                            className={touched.itemImage && errors.itemImage ? 'input-error' : ''} 
                        />
                        {touched.itemImage && errors.itemImage && <span className="error-message">{errors.itemImage}</span>}
                    </div>

                    <button type="submit" className="form_btn">Add Item</button>
                </form>
                
                <div className="navigation-buttons">
                    <button onClick={() => navigate("/allitems")}>View Inventory</button>
                    <button onClick={() => navigate("/")}>Back to Home</button>
                </div>
            </div>
        </div>
    );
}

export default AddItem;
