import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AddItem from "../AddItem/AddItem";

function DisplayItem() {
  const [inventory, setInventory] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const result = await axios.get("http://localhost:8080/inventory");
    setInventory(result.data);
  };

  const UpdateNavigate = (itemId) => {
    window.location.href = `/updateitem/${itemId}`;
  }

  // Delete item
  const deleteItem = async (id) => {
    //display confirmation message
    const confirmDelete = window.confirm("Are you sure you want to delete this item?")
    if (confirmDelete) { // Fixed variable name from confirmationMessage to confirmDelete
      try {
        //send delete request to server
        await axios.delete(`http://localhost:8080/inventory/${id}`)
        //after deleting item, reload the inventory
        loadInventory();
        //display success message
        alert("Item deleted successfully")
      } catch (error) {
        //display error message
        alert("Error deleting item")
      }
    }
  };
  // Search function
  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = inventory.filter(
    (item) =>
      (item.itemId && item.itemId.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (item.itemName && item.itemName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.itemCategory && item.itemCategory.toLowerCase().includes(searchQuery.toLowerCase()))
  );


  return (
    <div>
      <h1>Inventory table</h1>
      <input
        type="text"
        placeholder="Search by id, name or category"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item </th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Details</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.itemId}</td>
              <td>
                  {item.itemImage && (
                    <img 
                      src={`http://localhost:8080/uploads/${item.itemImage}`} 
                      alt={item.itemName}  
                      width="50" height="50" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                      }}
                    />
                  )}
              </td>
              <td>{item.itemName}</td>
              <td>{item.itemCategory}</td>
              <td>{item.itemQty}</td>
              <td>{item.itemDetails}</td>
              <td> 
                 <button onClick={() => UpdateNavigate(item.itemId)}>Update</button>
                 <button onClick={() => deleteItem(item.itemId)}>Delete</button>
              </td>
            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayItem;
