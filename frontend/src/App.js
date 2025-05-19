import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Home from "./components/Home/Home.js";
import AddItem from "./components/AddItem/AddItem.js";
import DisplayItem from "./components/DisplayItem/DisplayItem.js";
import UpdateItem from "./components/UpdateItem/UpdateItem.js";
import Register from "./components/Register/Register.js";
import Login from "./components/Login/Login.js";
import UserProfile from "./components/UserProfile/UserProfile.js";
import Splash from "./components/SplashPage/Splash.js";
import CreatePost from "./components/AddItem/CreatePost.js";
import PostList from "./components/DisplayItem/PostList.js";
import ViewPost from "./components/DisplayItem/ViewPost.js";
import EditPost from "./components/UpdateItem/EditPost.js";
import LearningProgressForm from "./components/AddItem/LearningProgressForm.js";
import LearningProgressList from "./components/DisplayItem/LearningProgressList.js";
import LearningPlanForm from "./components/AddItem/LearningPlanForm.js";
import LearningPlanList from "./components/DisplayItem/LearningPlanList.js";
import LearningPlanDetails from "./components/DisplayItem/LearningPlanDetails.js";
import Communities from "./components/Communities/Communities.js";
import CreateCommunity from "./components/Communities/CreateCommunity.js";
import CommunityDetail from "./components/Communities/CommunityDetail.js";
import EditCommunity from "./components/Communities/EditCommunity.js";
import CreateCommunityPost from "./components/Communities/CreateCommunityPost.js";
import EditCommunityPost from "./components/Communities/EditCommunityPost.js";
// Import components from centralized index.js to avoid circular dependencies
import {
  Explore,
  Stories,
  Messages,
  SideNavbar,
  Settings,
  Notifications,
  Header,
  Footer,
  AdminLogin,
  AdminRegister,
  AdminDashboard,
  AdminRoute
} from "./components";
import "./App.css";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");
  
  // Enhanced check to ensure userId exists and is valid
  if (!userId || userId === "undefined" || userId === "null") {
    // Clear any potentially corrupted localStorage data
    localStorage.removeItem("userId");
    localStorage.removeItem("userFullName");
    localStorage.removeItem("userEmail");
    
    console.log("Protected route: User not authenticated, redirecting to login");
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};


function App() {
  const location = useLocation();
  const isPublicRoute = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin/login' || location.pathname === '/admin/register';
  const isAdminRoute = location.pathname.startsWith('/admin/');
  const hideHeader = location.pathname === '/explore' || location.pathname.startsWith('/communities');
  
  return (
    <div className="app-container">
      {!isPublicRoute && !isAdminRoute && <SideNavbar />}
      <div className={isPublicRoute || isAdminRoute ? "main-content-container-full" : "main-content-container"}>
      {!isPublicRoute && !isAdminRoute && !hideHeader && <Header />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        
        <Route path="/feedback" element={
          <ProtectedRoute>
            <Settings activeTab="feedback" />
          </ProtectedRoute>
        } />
        
        <Route path="/profile/:userId" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/additem" element={
          <ProtectedRoute>
            <AddItem />
          </ProtectedRoute>
        } />
        
        <Route path="/allitems" element={
          <ProtectedRoute>
            <DisplayItem />
          </ProtectedRoute>
        } />
        
        <Route path="/updateitem/:id" element={
          <ProtectedRoute>
            <UpdateItem />
          </ProtectedRoute>
        } />
        
        {/* Post routes */}
        <Route path="/create-post" element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } />
        
        <Route path="/posts" element={
          <ProtectedRoute>
            <PostList />
          </ProtectedRoute>
        } />
        
        <Route path="/view-post/:postId" element={
          <ProtectedRoute>
            <ViewPost />
          </ProtectedRoute>
        } />
        
        <Route path="/edit-post/:postId" element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        } />
        
        {/* Learning Progress routes */}
        <Route path="/learning-progress/create" element={
          <ProtectedRoute>
            <LearningProgressForm />
          </ProtectedRoute>
        } />
        
        <Route path="/posts/learning-progress" element={
          <ProtectedRoute>
            <LearningProgressList />
          </ProtectedRoute>
        } />
        
        {/* Learning Plan routes */}
        <Route path="/learning-plans" element={
          <ProtectedRoute>
            <LearningPlanList />
          </ProtectedRoute>
        } />
        
        <Route path="/create-learning-plan" element={
          <ProtectedRoute>
            <LearningPlanForm />
          </ProtectedRoute>
        } />
        
        <Route path="/edit-learning-plan/:planId" element={
          <ProtectedRoute>
            <LearningPlanForm />
          </ProtectedRoute>
        } />
        
        <Route path="/learning-plans/:planId" element={
          <ProtectedRoute>
            <LearningPlanDetails />
          </ProtectedRoute>
        } />
        
        {/* Explore route */}
        <Route path="/explore" element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        } />
        
        {/* Stories route */}
        <Route path="/stories" element={
          <ProtectedRoute>
            <Stories />
          </ProtectedRoute>
        } />
        
        {/* Messages route */}
        <Route path="/messages" element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        } />
        
        {/* Notifications route */}
        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        
        {/* Community routes */}
        <Route path="/communities" element={
          <ProtectedRoute>
            <Communities />
          </ProtectedRoute>
        } />
        
        <Route path="/communities/create" element={
          <ProtectedRoute>
            <CreateCommunity />
          </ProtectedRoute>
        } />
        
        <Route path="/communities/:communityId" element={
          <ProtectedRoute>
            <CommunityDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/communities/:communityId/edit" element={
          <ProtectedRoute>
            <EditCommunity />
          </ProtectedRoute>
        } />
        
        <Route path="/communities/:communityId/create-post" element={
          <ProtectedRoute>
            <CreateCommunityPost />
          </ProtectedRoute>
        } />
        
        <Route path="/communities/:communityId/posts/:postId/edit" element={
          <ProtectedRoute>
            <EditCommunityPost />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        {!isPublicRoute && !isAdminRoute && <Footer />}
      </div>
    </div>
  );
}

export default App;
