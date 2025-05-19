import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function UpdateItem() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        itemId: "",
        itemName: "",
        itemCategory: "",
        itemQty: "",
        itemDetails: "",
        itemImage: null,
    });

    useEffect(() => {
        const fetchItemData = async () => {
            try {
                console.log(`Fetching data for item ID: ${id}`);
                // Use the new endpoint that gets item by itemId
                const response = await axios.get(`http://localhost:8080/inventory/item/${id}`);
                const itemData = response.data;
                console.log('Fetched item data:', itemData);
                
                setFormData({
                    itemId: itemData.itemId || '',
                    itemName: itemData.itemName || '',
                    itemCategory: itemData.itemCategory || '',
                    itemQty: itemData.itemQty || '',
                    itemDetails: itemData.itemDetails || '',
                    itemImage: null, // Keep image null for update
                });
                console.log('Form data set successfully');
            } catch (error) {
                console.error("Error fetching item data:", error);
                if (error.response) {
                    console.error("Response status:", error.response.status);
                    console.error("Response data:", error.response.data);
                }
                alert(`Error loading item data: ${error.message}`);
            }
        };
        fetchItemData();
    }, [id]);

    const oninputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        // Create an object with all the item details
        const itemDetailsObj = {
            itemId: formData.itemId,
            itemName: formData.itemName,
            itemCategory: formData.itemCategory,
            itemQty: formData.itemQty,
            itemDetails: formData.itemDetails
            // Don't include itemImage here as it's handled separately
        };

        console.log('Sending update for item:', itemDetailsObj);
        
        // Convert the object to a JSON string and append to FormData
        data.append("itemDetails", JSON.stringify(itemDetailsObj));

        // Append image if selected
        if (formData.itemImage) {
            console.log('Including new image in update');
            data.append("file", formData.itemImage);
        }

        try {
            // Let Axios set the correct content type automatically
            // Don't manually set 'Content-Type' for multipart/form-data
            
            console.log(`Sending update request to: http://localhost:8080/inventory/${formData.itemId}`);
            
            // Use the itemId from the form data instead of the URL parameter
            const response = await axios.put(`http://localhost:8080/inventory/${formData.itemId}`, data);
            
            console.log('Update successful for item ID:', formData.itemId, 'Response:', response.data);
            alert("Item updated successfully");
            window.location.href = "/allitems"; // This is correct - assigning to the href property
        } catch (error) {
            console.error("Error updating item:", error);
            if (error.response) {
                console.error("Response status:", error.response.status);
                console.error("Response data:", error.response.data);
            }
            alert("Error updating item: " + (error.response?.data || error.message));
        }
    };

    return (
        <div className="form_container">
            <div className="form_sub_cont">
                <form id="itemForm" onSubmit={onSubmit}>
                    <label htmlFor="itemId">Item ID:</label><br />
                    <input type="text" id="itemId" name="itemId" onChange={oninputChange} value={formData.itemId} required /><br />

                    <label htmlFor="itemName">Item Name:</label><br />
                    <input type="text" id="itemName" name="itemName" onChange={oninputChange} value={formData.itemName} required /><br />

                    <label htmlFor="itemCategory">Item Category:</label><br />
                    <select id="itemCategory" name="itemCategory" onChange={oninputChange} value={formData.itemCategory} required>
                        <option value="">Select Item Category</option>
                        <option value="Apparel & Fashion">Apparel & Fashion</option>
                        <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                        <option value="Health & Beauty">Health & Beauty</option>
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Home & Furniture">Home & Furniture</option>
                    </select><br />

                    <label htmlFor="itemQty">Item Quantity:</label><br />
                    <input type="number" id="itemQty" name="itemQty" onChange={oninputChange} value={formData.itemQty} required /><br />

                    <label htmlFor="itemDetails">Item Details:</label><br />
                    <textarea id="itemDetails" name="itemDetails" onChange={oninputChange} value={formData.itemDetails} required></textarea><br />

                    <label htmlFor="itemImage">Item Image:</label><br />
                    <input
                        type="file"
                        id="itemImage"
                        name="itemImage"
                        accept="image/*"
                        onChange={oninputChange}
                    /><br />

                    <button type="submit" className="form_btn">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateItem;
