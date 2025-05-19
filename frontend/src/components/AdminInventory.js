import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminInventory.css';

function AdminInventory() {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    itemId: '',
    itemName: '',
    itemCategory: '',
    itemQty: '',
    itemDetails: '',
    itemImage: null
  });

  // Fetch inventory data
  const fetchInventory = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8080/api/admin/inventory?page=${currentPage}`;
      
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      
      const response = await axios.get(url);
      setInventory(response.data.items);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Error fetching inventory data');
      setLoading(false);
      console.error(err);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/inventory/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, [currentPage, selectedCategory, searchTerm]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page on new search
    fetchInventory();
  };

  // Handle item selection
  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === inventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(inventory.map(item => item.itemId));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      return;
    }
    
    try {
      await axios.delete('http://localhost:8080/api/admin/inventory/bulk', {
        data: selectedItems
      });
      fetchInventory();
      setSelectedItems([]);
    } catch (err) {
      setError('Error deleting items');
      console.error(err);
    }
  };

  // Handle bulk category update
  const handleBulkCategoryUpdate = async (newCategory) => {
    try {
      await axios.put('http://localhost:8080/api/admin/inventory/bulk', {
        itemIds: selectedItems,
        field: 'itemCategory',
        value: newCategory
      });
      fetchInventory();
      setSelectedItems([]);
    } catch (err) {
      setError('Error updating items');
      console.error(err);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      itemImage: e.target.files[0]
    });
  };

  // Open add modal
  const openAddModal = () => {
    setFormData({
      itemId: '',
      itemName: '',
      itemCategory: '',
      itemQty: '',
      itemDetails: '',
      itemImage: null
    });
    setShowAddModal(true);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      itemId: item.itemId,
      itemName: item.itemName,
      itemCategory: item.itemCategory,
      itemQty: item.itemQty,
      itemDetails: item.itemDetails,
      itemImage: null
    });
    setShowEditModal(true);
  };

  // Handle add item
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    try {
      // First, create the item
      const itemResponse = await axios.post('http://localhost:8080/api/admin/inventory', {
        itemId: formData.itemId,
        itemName: formData.itemName,
        itemCategory: formData.itemCategory,
        itemQty: formData.itemQty,
        itemDetails: formData.itemDetails
      });
      
      // If there's an image, upload it
      if (formData.itemImage) {
        const imageData = new FormData();
        imageData.append('file', formData.itemImage);
        
        const imageResponse = await axios.post('http://localhost:8080/api/admin/inventory/upload-image', imageData);
        
        // Update the item with the image path
        await axios.put(`http://localhost:8080/api/admin/inventory/${formData.itemId}`, {
          ...itemResponse.data,
          itemImage: imageResponse.data.filename
        });
      }
      
      fetchInventory();
      setShowAddModal(false);
    } catch (err) {
      setError('Error adding item');
      console.error(err);
    }
  };

  // Handle edit item
  const handleEditItem = async (e) => {
    e.preventDefault();
    
    try {
      if (formData.itemImage) {
        // If there's a new image, use the multipart endpoint
        const formDataObj = new FormData();
        formDataObj.append('file', formData.itemImage);
        formDataObj.append('itemDetails', JSON.stringify({
          itemId: formData.itemId,
          itemName: formData.itemName,
          itemCategory: formData.itemCategory,
          itemQty: formData.itemQty,
          itemDetails: formData.itemDetails
        }));
        
        await axios.put(
          `http://localhost:8080/api/admin/inventory/${formData.itemId}/with-image`,
          formDataObj,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Otherwise use the regular update endpoint
        await axios.put(`http://localhost:8080/api/admin/inventory/${formData.itemId}`, {
          itemName: formData.itemName,
          itemCategory: formData.itemCategory,
          itemQty: formData.itemQty,
          itemDetails: formData.itemDetails
        });
      }
      
      fetchInventory();
      setShowEditModal(false);
    } catch (err) {
      setError('Error updating item');
      console.error(err);
    }
  };

  // Handle delete item
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:8080/api/admin/inventory/${itemId}`);
      fetchInventory();
    } catch (err) {
      setError('Error deleting item');
      console.error(err);
    }
  };

  // Render pagination
  const renderPagination = () => {
    const pages = [];
    
    // Previous button
    pages.push(
      <button 
        key="prev" 
        className="pagination-btn" 
        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
    );
    
    // Page numbers
    for (let i = 0; i < totalPages; i++) {
      if (
        i === 0 || 
        i === totalPages - 1 || 
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(
          <button 
            key={i} 
            className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
            onClick={() => setCurrentPage(i)}
          >
            {i + 1}
          </button>
        );
      } else if (
        i === currentPage - 2 || 
        i === currentPage + 2
      ) {
        pages.push(<span key={`ellipsis-${i}`} className="pagination-ellipsis">...</span>);
      }
    }
    
    // Next button
    pages.push(
      <button 
        key="next" 
        className="pagination-btn" 
        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    );
    
    return pages;
  };

  return (
    <div className="admin-inventory">
      {/* Header with actions */}
      <div className="inventory-header">
        <h2>Explore Management</h2>
        <div className="inventory-actions">
          <button className="add-btn" onClick={openAddModal}>
            <i className="fas fa-plus"></i>   Add New Item
          </button>
          
          {selectedItems.length > 0 && (
            <>
              <button className="delete-btn" onClick={handleBulkDelete}>
                <i className="fas fa-trash-alt"></i> Delete Selected
              </button>
              
              <div className="dropdown">
                <button className="dropdown-btn">
                  <i className="fas fa-tag"></i> Change Category <i className="fas fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                  {categories.map(category => (
                    <button 
                      key={category} 
                      onClick={() => handleBulkCategoryUpdate(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="inventory-filters">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search explore..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>
        
        <div className="filter-container">
          <select 
            className="filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
          <button onClick={() => setError('')} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {/* Inventory table */}
      <div className="inventory-table-container">
        {loading ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading explore...</p>
          </div>
        ) : (
          <>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      checked={selectedItems.length === inventory.length && inventory.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Media</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-items">
                      No explore items found
                    </td>
                  </tr>
                ) : (
                  inventory.map(item => (
                    <tr key={item.itemId}>
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(item.itemId)}
                          onChange={() => handleSelectItem(item.itemId)}
                        />
                      </td>
                      <td>{item.itemId}</td>
                      <td>
                        {item.itemImage ? (
                          <img 
                            src={`http://localhost:8080/uploads/${item.itemImage}`} 
                            alt={item.itemName}
                            className="item-thumbnail"
                          />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </td>
                      <td>{item.itemName}</td>
                      <td>
                        <span className="category-badge">{item.itemCategory}</span>
                      </td>
                      <td>
                        <span className={`quantity ${parseInt(item.itemQty) < 10 ? 'low-stock' : ''}`}>
                          {item.itemQty}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="action-btn view-btn" 
                            title="View Details"
                            onClick={() => alert(`Details: ${item.itemDetails}`)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="action-btn edit-btn" 
                            title="Edit Item"
                            onClick={() => openEditModal(item)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="action-btn delete-btn" 
                            title="Delete Item"
                            onClick={() => handleDeleteItem(item.itemId)}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            <div className="pagination">
              {renderPagination()}
            </div>
          </>
        )}
      </div>
      
      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Inventory Item</h3>
              <button className="close-modal" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddItem} className="inventory-form">
              <div className="form-group">
                <label htmlFor="itemId">Item ID</label>
                <input 
                  type="text" 
                  id="itemId" 
                  name="itemId"
                  value={formData.itemId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="itemName"> Name</label>
                <input 
                  type="text" 
                  id="itemName" 
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="itemCategory">Category</label>
                <input 
                  type="text" 
                  id="itemCategory" 
                  name="itemCategory"
                  value={formData.itemCategory}
                  onChange={handleInputChange}
                  required
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
              
              <div className="form-group">
                <label htmlFor="itemQty">Media</label>
                <input 
                  type="number" 
                  id="itemQty" 
                  name="itemQty"
                  value={formData.itemQty}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="itemDetails">Details</label>
                <textarea 
                  id="itemDetails" 
                  name="itemDetails"
                  value={formData.itemDetails}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="itemImage">Image</label>
                <input 
                  type="file" 
                  id="itemImage" 
                  name="itemImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Explore</h3>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleEditItem} className="inventory-form">
              <div className="form-group">
                <label htmlFor="edit-itemId">Item ID</label>
                <input 
                  type="text" 
                  id="edit-itemId" 
                  name="itemId"
                  value={formData.itemId}
                  readOnly
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-itemName">Item Name</label>
                <input 
                  type="text" 
                  id="edit-itemName" 
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-itemCategory">Category</label>
                <input 
                  type="text" 
                  id="edit-itemCategory" 
                  name="itemCategory"
                  value={formData.itemCategory}
                  onChange={handleInputChange}
                  required
                  list="edit-categories"
                />
                <datalist id="edit-categories">
                  {categories.map(category => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-itemQty">Media</label>
                <input 
                  type="number" 
                  id="edit-itemQty" 
                  name="itemQty"
                  value={formData.itemQty}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-itemDetails">Details</label>
                <textarea 
                  id="edit-itemDetails" 
                  name="itemDetails"
                  value={formData.itemDetails}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-itemImage">Image</label>
                {currentItem.itemImage && (
                  <div className="current-image">
                    <img 
                      src={`http://localhost:8080/uploads/${currentItem.itemImage}`} 
                      alt={currentItem.itemName}
                    />
                    <p>Current image</p>
                  </div>
                )}
                <input 
                  type="file" 
                  id="edit-itemImage" 
                  name="itemImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminInventory;
