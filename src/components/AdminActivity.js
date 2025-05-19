import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminActivity.css';

function AdminActivity() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilters] = useState({
    actionType: 'all',
    adminId: 'all',
    dateRange: 'all',
    search: ''
  });

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      // In a production environment, this would be a real API call
      // const response = await axios.get('http://localhost:8080/admin/activity-logs');
      // setActivityLogs(response.data);
      
      // For now, generate mock data
      generateMockActivityLogs();
      setLoading(false);
    } catch (err) {
      setError('Error fetching activity logs');
      setLoading(false);
      console.error(err);
    }
  };

  // Generate mock activity logs
  const generateMockActivityLogs = () => {
    const adminNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'];
    const adminIds = ['admin1', 'admin2', 'admin3', 'admin4'];
    const actionTypes = ['login', 'logout', 'create', 'update', 'delete', 'view', 'export'];
    const entityTypes = ['user', 'post', 'comment', 'community', 'learning-plan', 'report'];
    
    const logs = [];
    
    // Generate 50 random logs
    for (let i = 0; i < 50; i++) {
      const adminIndex = Math.floor(Math.random() * adminNames.length);
      const actionTypeIndex = Math.floor(Math.random() * actionTypes.length);
      const entityTypeIndex = Math.floor(Math.random() * entityTypes.length);
      
      // Generate a random date within the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      // Generate a random entity ID
      const entityId = Math.floor(Math.random() * 10000);
      
      // Generate a random IP address
      const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      
      // Create the log entry
      logs.push({
        id: `log-${i + 1}`,
        timestamp: date.toISOString(),
        adminId: adminIds[adminIndex],
        adminName: adminNames[adminIndex],
        actionType: actionTypes[actionTypeIndex],
        entityType: entityTypes[entityTypeIndex],
        entityId: `${entityTypes[entityTypeIndex]}-${entityId}`,
        details: generateActionDetails(actionTypes[actionTypeIndex], entityTypes[entityTypeIndex], entityId),
        ipAddress: ip,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
    }
    
    // Sort logs by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setActivityLogs(logs);
    setFilteredLogs(logs);
  };

  // Generate action details based on action type and entity type
  const generateActionDetails = (actionType, entityType, entityId) => {
    switch (actionType) {
      case 'login':
        return 'Admin logged in successfully';
      case 'logout':
        return 'Admin logged out';
      case 'create':
        return `Created new ${entityType} with ID ${entityType}-${entityId}`;
      case 'update':
        return `Updated ${entityType} with ID ${entityType}-${entityId}`;
      case 'delete':
        return `Deleted ${entityType} with ID ${entityType}-${entityId}`;
      case 'view':
        return `Viewed ${entityType} with ID ${entityType}-${entityId}`;
      case 'export':
        return `Exported ${entityType} data`;
      default:
        return 'Action performed';
    }
  };

  // Initial data load
  useEffect(() => {
    fetchActivityLogs();
  }, []);

  // Apply filters when filters change
  useEffect(() => {
    applyFilters();
  }, [filters, activityLogs]);

  // Apply filters to activity logs
  const applyFilters = () => {
    let filtered = [...activityLogs];
    
    // Filter by action type
    if (filters.actionType !== 'all') {
      filtered = filtered.filter(log => log.actionType === filters.actionType);
    }
    
    // Filter by admin ID
    if (filters.adminId !== 'all') {
      filtered = filtered.filter(log => log.adminId === filters.adminId);
    }
    
    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'yesterday':
          startDate = new Date(now.setDate(now.getDate() - 1));
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = new Date(0);
      }
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.adminName.toLowerCase().includes(searchTerm) ||
        log.actionType.toLowerCase().includes(searchTerm) ||
        log.entityType.toLowerCase().includes(searchTerm) ||
        log.entityId.toLowerCase().includes(searchTerm) ||
        log.details.toLowerCase().includes(searchTerm) ||
        log.ipAddress.includes(searchTerm)
      );
    }
    
    setFilteredLogs(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get unique admin IDs for filter
  const getUniqueAdminIds = () => {
    const adminIds = activityLogs.map(log => ({
      id: log.adminId,
      name: log.adminName
    }));
    
    // Remove duplicates
    return Array.from(new Map(adminIds.map(admin => [admin.id, admin])).values());
  };

  // Get action type class for styling
  const getActionTypeClass = (actionType) => {
    switch (actionType) {
      case 'login':
      case 'logout':
        return 'action-auth';
      case 'create':
        return 'action-create';
      case 'update':
        return 'action-update';
      case 'delete':
        return 'action-delete';
      case 'view':
        return 'action-view';
      case 'export':
        return 'action-export';
      default:
        return 'action-other';
    }
  };

  // Get action type icon
  const getActionTypeIcon = (actionType) => {
    switch (actionType) {
      case 'login':
        return 'fa-sign-in-alt';
      case 'logout':
        return 'fa-sign-out-alt';
      case 'create':
        return 'fa-plus-circle';
      case 'update':
        return 'fa-edit';
      case 'delete':
        return 'fa-trash-alt';
      case 'view':
        return 'fa-eye';
      case 'export':
        return 'fa-file-export';
      default:
        return 'fa-cog';
    }
  };

  return (
    <div className="admin-activity">
      <div className="activity-header">
        <h2>Activity Logs</h2>
        <button className="refresh-button" onClick={fetchActivityLogs}>
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      
      {/* Filters */}
      <div className="activity-filters">
        <div className="filter-group">
          <label htmlFor="actionType">Action Type:</label>
          <select 
            id="actionType" 
            name="actionType" 
            value={filters.actionType} 
            onChange={handleFilterChange}
          >
            <option value="all">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="view">View</option>
            <option value="export">Export</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="adminId">Admin:</label>
          <select 
            id="adminId" 
            name="adminId" 
            value={filters.adminId} 
            onChange={handleFilterChange}
          >
            <option value="all">All Admins</option>
            {getUniqueAdminIds().map(admin => (
              <option key={admin.id} value={admin.id}>{admin.name}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="dateRange">Date Range:</label>
          <select 
            id="dateRange" 
            name="dateRange" 
            value={filters.dateRange} 
            onChange={handleFilterChange}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
        
        <div className="filter-group search-group">
          <label htmlFor="search">Search:</label>
          <div className="search-input-container">
            <input 
              type="text" 
              id="search" 
              name="search" 
              value={filters.search} 
              onChange={handleFilterChange}
              placeholder="Search logs..."
            />
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {loading ? (
        <div className="loading-indicator">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading activity logs...</span>
        </div>
      ) : (
        <>
          {/* Activity logs table */}
          <div className="activity-table-container">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td className="timestamp-cell">{formatDate(log.timestamp)}</td>
                      <td className="admin-cell">{log.adminName}</td>
                      <td className="action-cell">
                        <span className={`action-badge ${getActionTypeClass(log.actionType)}`}>
                          <i className={`fas ${getActionTypeIcon(log.actionType)}`}></i>
                          {log.actionType}
                        </span>
                      </td>
                      <td className="details-cell">
                        <div className="details-content">
                          <span className="entity-type">{log.entityType}</span>
                          <span className="details-text">{log.details}</span>
                        </div>
                      </td>
                      <td className="ip-cell">{log.ipAddress}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-results">
                      <i className="fas fa-search"></i>
                      <span>No activity logs found matching the current filters</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Activity summary */}
          <div className="activity-summary">
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="summary-content">
                <h4>Total Activities</h4>
                <p className="summary-value">{filteredLogs.length}</p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="summary-content">
                <h4>Active Admins</h4>
                <p className="summary-value">{getUniqueAdminIds().length}</p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="summary-content">
                <h4>Time Period</h4>
                <p className="summary-value">
                  {filters.dateRange === 'all' ? 'All Time' : 
                   filters.dateRange === 'today' ? 'Today' :
                   filters.dateRange === 'yesterday' ? 'Yesterday' :
                   filters.dateRange === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
                </p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <i className="fas fa-filter"></i>
              </div>
              <div className="summary-content">
                <h4>Active Filters</h4>
                <p className="summary-value">
                  {Object.values(filters).filter(value => value !== 'all' && value !== '').length}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminActivity;
