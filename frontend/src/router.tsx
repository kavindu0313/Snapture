import React from 'react';
import { 
  createBrowserRouter, 
  Navigate
} from 'react-router-dom';

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
import DatabaseTest from './components/DatabaseTest';
import ConnectionTest from './components/ConnectionTest';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Future flags to fix warnings
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

// Check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Routes configuration
const routes = [
  {
    path: '/',
    element: <SplashPage />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/home',
    element: isAuthenticated() ? <Home /> : <Navigate to="/" />
  },
  {
    path: '/explore',
    element: isAuthenticated() ? <ExplorePage /> : <Navigate to="/" />
  },
  {
    path: '/explore/:category',
    element: isAuthenticated() ? <CategoryPage /> : <Navigate to="/" />
  },
  {
    path: '/profile/:username',
    element: isAuthenticated() ? <Profile /> : <Navigate to="/" />
  },
  {
    path: '/communities',
    element: isAuthenticated() ? <Communities /> : <Navigate to="/" />
  },
  {
    path: '/communities/:id',
    element: isAuthenticated() ? <CommunityDetail /> : <Navigate to="/" />
  },
  {
    path: '/create-post',
    element: isAuthenticated() ? <CreatePostPage /> : <Navigate to="/" />
  },
  {
    path: '/create-community',
    element: isAuthenticated() ? <CreateCommunityPage /> : <Navigate to="/" />
  },
  {
    path: '/notifications',
    element: isAuthenticated() ? <Notifications /> : <Navigate to="/" />
  },
  {
    path: '/stories',
    element: isAuthenticated() ? <Stories /> : <Navigate to="/" />
  },
  {
    path: '/messages',
    element: isAuthenticated() ? <Messages /> : <Navigate to="/" />
  },
  {
    path: '/settings',
    element: isAuthenticated() ? <Settings /> : <Navigate to="/" />
  },
  {
    path: '/db-test',
    element: isAuthenticated() ? <DatabaseTest /> : <Navigate to="/" />
  },
  {
    path: '/connection-test',
    element: <ConnectionTest />
  },
  {
    path: '*',
    element: <Navigate to="/" />
  }
];

// Create router with future flags
const router = createBrowserRouter(
  routes,
  routerOptions
);

export default router;
