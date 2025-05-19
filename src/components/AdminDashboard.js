import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AdminDashboard.css';
// Import components using dynamic imports to avoid circular dependencies
const AdminStats = React.lazy(() => import('./AdminStats'));
const AdminInventory = React.lazy(() => import('./AdminInventory'));
const AdminCommunities = React.lazy(() => import('./AdminCommunities'));
const AdminLearningPlans = React.lazy(() => import('./AdminLearningPlans'));
const AdminPosts = React.lazy(() => import('./AdminPosts'));
const AdminAnalytics = React.lazy(() => import('./AdminAnalytics'));
const AdminActivity = React.lazy(() => import('./AdminActivity'));
const AdminFeedback = React.lazy(() => import('./AdminFeedback'));

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalCommunities: 0,
    totalLearningPlans: 0,
    newUsersToday: 0,
    newPostsToday: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [reportedContent, setReportedContent] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  const loadMockData = () => {
    // Mock statistics
    setStats({
      totalUsers: 1245,
      totalPosts: 3782,
      totalCommunities: 87,
      totalLearningPlans: 156,
      newUsersToday: 23,
      newPostsToday: 142
    });

    // Mock recent users
    setRecentUsers([
      { id: 'u1', username: 'sophia_captures', email: 'sophia@example.com', joinDate: '2025-05-17', status: 'active' },
      { id: 'u2', username: 'david_frames', email: 'david@example.com', joinDate: '2025-05-16', status: 'active' },
      { id: 'u3', username: 'emma_lens', email: 'emma@example.com', joinDate: '2025-05-15', status: 'active' },
      { id: 'u4', username: 'michael_shots', email: 'michael@example.com', joinDate: '2025-05-15', status: 'inactive' },
      { id: 'u5', username: 'olivia_focus', email: 'olivia@example.com', joinDate: '2025-05-14', status: 'active' }
    ]);

    // Mock recent posts
    setRecentPosts([
      { id: 'p1', title: 'Sunset over the mountains', author: 'sophia_captures', date: '2025-05-18', likes: 42, comments: 7 },
      { id: 'p2', title: 'Urban architecture', author: 'david_frames', date: '2025-05-17', likes: 38, comments: 5 },
      { id: 'p3', title: 'Wildlife in motion', author: 'emma_lens', date: '2025-05-17', likes: 56, comments: 12 },
      { id: 'p4', title: 'Macro photography tips', author: 'michael_shots', date: '2025-05-16', likes: 29, comments: 8 },
      { id: 'p5', title: 'Street photography essentials', author: 'olivia_focus', date: '2025-05-16', likes: 33, comments: 6 }
    ]);

    // Mock reported content
    setReportedContent([
      { id: 'r1', contentType: 'post', contentId: 'p101', reportedBy: 'user123', reason: 'Inappropriate content', date: '2025-05-18', status: 'pending' },
      { id: 'r2', contentType: 'comment', contentId: 'c202', reportedBy: 'user456', reason: 'Harassment', date: '2025-05-17', status: 'pending' },
      { id: 'r3', contentType: 'post', contentId: 'p303', reportedBy: 'user789', reason: 'Copyright violation', date: '2025-05-16', status: 'resolved' }
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Snapture Admin</h2>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Overview</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <i className="fas fa-box"></i>
            <span>Explore Management</span>
          </button>
          
          
          <button 
            className={`admin-nav-item ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <i className="fas fa-image"></i>
            <span>Post Management</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'communities' ? 'active' : ''}`}
            onClick={() => setActiveTab('communities')}
          >
            <i className="fas fa-users-cog"></i>
            <span>Communities </span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'learning' ? 'active' : ''}`}
            onClick={() => setActiveTab('learning')}
          >
            <i className="fas fa-book"></i>
            <span> Plans Management</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Analytics</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            <i className="fas fa-comment"></i>
            <span>Feedback Management</span>
          </button>

          <button 
            className={`admin-nav-item ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <i className="fas fa-history"></i>
            <span>Activity Logs</span>
          </button>
          
          
          <button 
            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </button>
        </nav>
        
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <main className="admin-content">
        <header className="admin-content-header">
          <h1>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'posts' && 'Post Management'}
            {activeTab === 'communities' && 'Community Management'}
            {activeTab === 'learning' && 'Learning Plans'}
            {activeTab === 'analytics' && 'Analytics Dashboard'}
            {activeTab === 'feedback' && 'Feedback'}
            {activeTab === 'activity' && 'Activity Logs'}
            {activeTab === 'reports' && 'Reported Content'}
            {activeTab === 'settings' && 'Admin Settings'}
          </h1>
          
          <div className="admin-profile">
            <span className="admin-name">{localStorage.getItem('adminName') || 'Admin'}</span>
            <div className="admin-avatar">
              <i className="fas fa-user-shield"></i>
            </div>
          </div>
        </header>
        
        <div className="admin-content-body">
          {activeTab === 'overview' && (
            <div className="overview-stats">
              <React.Suspense fallback={<div className="loading">Loading...</div>}>
                <AdminStats stats={stats} />
              </React.Suspense>
            </div>
          )}
          {activeTab === 'users' && (
            <div className="users-tab">
              <div className="tab-actions">
                <div className="search-container">
                  <input type="text" placeholder="Search users..." className="search-input" />
                  <button className="search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
                
                <div className="filter-container">
                  <select className="filter-select">
                    <option value="all">All Users</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>
              
              <div className="dashboard-card full-width">
                <div className="card-content">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Join Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...recentUsers, ...recentUsers].map((user, index) => (
                        <tr key={`${user.id}-${index}`}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.createdAt}</td>
                          <td>
                            <span className={`status-badge ${user.status}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="action-btn view-btn">
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="action-btn edit-btn">
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="action-btn delete-btn">
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="pagination">
                  <button className="pagination-btn">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="pagination-btn active">1</button>
                  <button className="pagination-btn">2</button>
                  <button className="pagination-btn">3</button>
                  <span className="pagination-ellipsis">...</span>
                  <button className="pagination-btn">10</button>
                  <button className="pagination-btn">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'inventory' && (
            <div className="inventory-tab">
              <React.Suspense fallback={<div className="loading">Loading...</div>}>
                <AdminInventory />
              </React.Suspense>
            </div>
          )}
          
          {activeTab === 'communities' && (
            <div className="communities-tab">
              <React.Suspense fallback={<div className="loading">Loading...</div>}>
                <AdminCommunities />
              </React.Suspense>
            </div>
          )}
          
          {activeTab === 'learning' && (
            <div className="learning-tab">
              <React.Suspense fallback={<div className="loading">Loading...</div>}>
                <AdminLearningPlans />
              </React.Suspense>
            </div>
          )}
          
          {activeTab === 'posts' && (
            <div className="posts-tab">
              <React.Suspense fallback={<div className="loading">Loading...</div>}>
                <AdminPosts />
              </React.Suspense>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              <React.Suspense fallback={<div className="loading">Loading...</div>}>
                <AdminAnalytics />
              </React.Suspense>
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="activity-tab">
              <React.Suspense fallback={<div className="loading">Loading...</div>}>
                <AdminActivity />
              </React.Suspense>
            </div>
          )}
          
          {activeTab === 'feedback' && (
            <div className="feedback-tab">
              <React.Suspense fallback={<div className="loading">Loading...</div>}>
                <AdminFeedback />
              </React.Suspense>
            </div>
          )}
          
          {(activeTab === 'reports' || activeTab === 'settings') && (
            <div className="placeholder-tab">
              <div className="placeholder-content">
                <i className="fas fa-cog fa-spin"></i>
                <h2>Coming Soon</h2>
                <p>The {activeTab} management interface is under development.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
