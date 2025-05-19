import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminStats.css';

function AdminStats() {
  const [stats, setStats] = useState({
    userCount: 0,
    postCount: 0,
    commentCount: 0,
    communityCount: 0,
    learningPlanCount: 0,
    inventoryCount: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentInventory, setRecentInventory] = useState([]);
  const [inventoryByCategory, setInventoryByCategory] = useState({});
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch all dashboard data in parallel
        const [
          statsResponse,
          recentUsersResponse,
          recentPostsResponse,
          recentInventoryResponse,
          inventoryByCategoryResponse,
          lowStockResponse
        ] = await Promise.all([
          axios.get('http://localhost:8080/api/admin/dashboard/stats'),
          axios.get('http://localhost:8080/api/admin/dashboard/recent-users'),
          axios.get('http://localhost:8080/api/admin/dashboard/recent-posts'),
          axios.get('http://localhost:8080/api/admin/dashboard/recent-inventory'),
          axios.get('http://localhost:8080/api/admin/dashboard/inventory-by-category'),
          axios.get('http://localhost:8080/api/admin/dashboard/low-stock-inventory')
        ]);

        setStats(statsResponse.data);
        setRecentUsers(recentUsersResponse.data);
        setRecentPosts(recentPostsResponse.data);
        setRecentInventory(recentInventoryResponse.data);
        setInventoryByCategory(inventoryByCategoryResponse.data);
        setLowStockItems(lowStockResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="admin-stats">
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
          <button onClick={() => setError('')} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon users-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-details">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.userCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon posts-icon">
                <i className="fas fa-camera"></i>
              </div>
              <div className="stat-details">
                <h3>Total Posts</h3>
                <p className="stat-number">{stats.postCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon comments-icon">
                <i className="fas fa-comment"></i>
              </div>
              <div className="stat-details">
                <h3>Total Comments</h3>
                <p className="stat-number">{stats.commentCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon communities-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-details">
                <h3>Communities</h3>
                <p className="stat-number">{stats.communityCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon learning-icon">
                <i className="fas fa-book"></i>
              </div>
              <div className="stat-details">
                <h3>Learning Plans</h3>
                <p className="stat-number">{stats.learningPlanCount}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon inventory-icon">
                <i className="fas fa-box"></i>
              </div>
              <div className="stat-details">
                <h3>Inventory Items</h3>
                <p className="stat-number">{stats.inventoryCount}</p>
              </div>
            </div>
          </div>

          {/* Recent Data Section */}
          <div className="dashboard-row">
            {/* Recent Users */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent Users</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <table className="admin-table">
                  <thead>
                    <tr>
                     
                      <th>Email</th>
                     
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="no-data">No users found</td>
                      </tr>
                    ) : (
                      recentUsers.map((user, index) => (
                        <tr key={`user-${index}`}>
                          
                          <td>{user.email}</td>
                          <td>
                            <span className={`status-badge ${user.status || 'active'}`}>
                              {user.status || 'active'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Recent Posts</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPosts.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="no-data">No posts found</td>
                      </tr>
                    ) : (
                      recentPosts.map((post, index) => (
                        <tr key={`post-${index}`}>
                          <td>{post.title || post.caption}</td>
                          <td>{post.username || post.userId}</td>
                          <td>{formatDate(post.createdAt || post.date)}</td>
                          <td className="engagement">
                            <span><i className="fas fa-heart"></i> {post.likes || 0}</span>
                            <span><i className="fas fa-comment"></i> {post.commentCount || 0}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="dashboard-row">
            {/* Inventory by Category */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Inventory by Category</h3>
              </div>
              <div className="card-content">
                <div className="category-chart">
                  {Object.keys(inventoryByCategory).length === 0 ? (
                    <div className="no-data">No category data available</div>
                  ) : (
                    <div className="category-bars">
                      {Object.entries(inventoryByCategory).map(([category, count]) => (
                        <div className="category-bar-container" key={category}>
                          <div className="category-label">{category}</div>
                          <div className="category-bar-wrapper">
                            <div 
                              className="category-bar" 
                              style={{ 
                                width: `${Math.min(100, (count / Math.max(...Object.values(inventoryByCategory))) * 100)}%` 
                              }}
                            ></div>
                            <span className="category-count">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Low Stock Items */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3>Low Stock Items</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="no-data">No low stock items</td>
                      </tr>
                    ) : (
                      lowStockItems.map((item, index) => (
                        <tr key={`stock-${index}`}>
                          <td>{item.itemName}</td>
                          <td>
                            <span className="category-badge">{item.itemCategory}</span>
                          </td>
                          <td>
                            <span className="quantity low-stock">{item.itemQty}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Inventory */}
          <div className="dashboard-row">
            <div className="dashboard-card full-width">
              <div className="card-header">
                <h3>Recent Explore Items</h3>
                <button className="view-all-btn">View All</button>
              </div>
              <div className="card-content">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Item ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Media</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInventory.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="no-data">No explore items found</td>
                      </tr>
                    ) : (
                      recentInventory.map((item, index) => (
                        <tr key={`inventory-${index}`}>
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
                          <td>{item.itemId}</td>
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
                              <button className="action-btn view-btn" title="View Details">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="action-btn edit-btn" title="Edit Item">
                                <i className="fas fa-edit"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminStats;
