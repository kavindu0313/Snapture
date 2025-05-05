import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';

// Mock data for trending images
const trendingImages = [
  {
    id: '1',
    imageUrl: 'https://i.pinimg.com/736x/4a/e9/ef/4ae9efa41d72b0c5fe9f3bc948380047.jpg',
    category: 'Landscape',
    title: 'Tropical Beach Sunset'
  },
  {
    id: '2',
    imageUrl: 'https://i.pinimg.com/736x/46/ee/33/46ee3324e0e5aa5b5e853310b251185c.jpg',
    category: 'Landscape',
    title: 'Mediterranean Village'
  },
  {
    id: '3',
    imageUrl: 'https://i.pinimg.com/736x/57/73/89/577389f4b72f0d0133007c46620cdce2.jpg',
    category: 'Wildlife',
    title: 'Wild Horses'
  },
  {
    id: '4',
    imageUrl: 'https://i.pinimg.com/736x/a3/bd/99/a3bd99ff636a9cd1c51b07c65f1aae60.jpg',
    category: 'Architecture',
    title: 'Eiffel Tower View'
  }
];

// Categories for explore
const categories = [
  {
    id: '1',
    name: 'Landscape',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: '2',
    name: 'Portrait',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80'
  },
  {
    id: '3',
    name: 'Street',
    imageUrl: 'https://images.unsplash.com/photo-1503248947681-3198a7abfcc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
  },
  {
    id: '4',
    name: 'Wildlife',
    imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1759&q=80'
  },
  {
    id: '5',
    name: 'Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: '6',
    name: 'Macro',
    imageUrl: 'https://images.unsplash.com/photo-1550686041-366ad85a1355?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
  }
];

const ExplorePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'Trending', 'Recent', 'Popular', 'Following', 'Landscape', 'Portrait', 'Street', 'Wildlife', 'Architecture'];

  return (
    <Layout>
      <div className="py-6">
        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search photos, users, or tags..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {filters.map(filter => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Trending Today Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingImages.map(image => (
              <div key={image.id} className="relative overflow-hidden rounded-lg shadow-sm group">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <span className="text-xs text-blue-300 font-medium">{image.category}</span>
                    <h3 className="text-white font-semibold">{image.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Categories Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <Link 
                to={`/explore/${category.name.toLowerCase()}`} 
                key={category.id} 
                className="relative overflow-hidden rounded-lg shadow-sm group h-48"
              >
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-6">
          <button className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ExplorePage;
