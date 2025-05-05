import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import Profile from './pages/Profile';
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';
import CreatePostPage from './pages/CreatePostPage';
import CreateCommunityPage from './pages/CreateCommunityPage';
import Notifications from './pages/Notifications';
import ExplorePage from './pages/ExplorePage';
import SplashPage from './pages/SplashPage';
import Stories from './pages/Stories';
import Messages from './pages/Messages';
import CategoryPage from './pages/CategoryPage';
import Settings from './pages/Settings';
import TestConnectionPage from './pages/TestConnectionPage';

// Components
import ApiToggle from './components/ApiToggle';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test-connection" element={<TestConnectionPage />} />
          
          {/* Protected Routes */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          } />
          <Route path="/explore/:category" element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          } />
          <Route path="/profile/:username" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/communities" element={
            <ProtectedRoute>
              <Communities />
            </ProtectedRoute>
          } />
          <Route path="/communities/:id" element={
            <ProtectedRoute>
              <CommunityDetail />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/create-post" element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          } />
          <Route path="/create-community" element={
            <ProtectedRoute>
              <CreateCommunityPage />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/stories" element={
            <ProtectedRoute>
              <Stories />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        {/* API Toggle Component - visible on all pages */}
        <ApiToggle />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
