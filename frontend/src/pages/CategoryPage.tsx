import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useTheme } from '../context/ThemeContext';

// Mock data for category images - in a real app, this would come from an API
const categoryImages = {
  landscape: [
    {
      id: '1',
      imageUrl: 'https://i.pinimg.com/736x/4a/e9/ef/4ae9efa41d72b0c5fe9f3bc948380047.jpg',
      title: 'Tropical Beach Sunset',
      username: 'naturephotographer',
      likes: 245
    },
    {
      id: '2',
      imageUrl: 'https://i.pinimg.com/736x/46/ee/33/46ee3324e0e5aa5b5e853310b251185c.jpg',
      title: 'Mediterranean Village',
      username: 'travelshots',
      likes: 189
    },
    {
      id: '3',
      imageUrl: 'https://i.pinimg.com/736x/8a/4e/8c/8a4e8c0e05a04bfe61d5a7ac2a4c8d88.jpg',
      title: 'Mountain Range at Sunset',
      username: 'hikerpro',
      likes: 302
    },
    {
      id: '4',
      imageUrl: 'https://i.pinimg.com/736x/f3/a5/a8/f3a5a8c7a3d69c69e95615d1f7afe4c5.jpg',
      title: 'Foggy Forest Path',
      username: 'naturewalker',
      likes: 176
    },
    {
      id: '5',
      imageUrl: 'https://i.pinimg.com/736x/7c/a3/d9/7ca3d96d8a8b9d1a4d89f6c9a02b5a2b.jpg',
      title: 'Desert Dunes',
      username: 'deserttrekker',
      likes: 210
    },
    {
      id: '6',
      imageUrl: 'https://i.pinimg.com/736x/e2/5d/f3/e25df3f1b2c0d7f6256ccb5ee2e45f35.jpg',
      title: 'Coastal Cliffs',
      username: 'coastalviews',
      likes: 165
    }
  ],
  portrait: [
    {
      id: '1',
      imageUrl: 'https://i.pinimg.com/736x/c0/e2/8c/c0e28c57b0b3fd7b1aacb4a6d4e25b5c.jpg',
      title: 'Natural Light Portrait',
      username: 'portraitmaster',
      likes: 278
    },
    {
      id: '2',
      imageUrl: 'https://i.pinimg.com/736x/a8/5b/49/a85b49d56702f9b8f4b6768d8a9ecb6e.jpg',
      title: 'Studio Headshot',
      username: 'studiopro',
      likes: 195
    },
    {
      id: '3',
      imageUrl: 'https://i.pinimg.com/736x/1f/f9/6c/1ff96c55df16bf6821a1a3d83ca8d1c1.jpg',
      title: 'Environmental Portrait',
      username: 'environmentalshots',
      likes: 220
    },
    {
      id: '4',
      imageUrl: 'https://i.pinimg.com/736x/d7/cf/38/d7cf38c5a4e861f5f3caa5e193d27bd7.jpg',
      title: 'Black and White Portrait',
      username: 'monochromeartist',
      likes: 312
    }//
  ],//
  street: [
    {
      id: '1',
      imageUrl: 'https://i.pinimg.com/736x/e3/a5/a2/e3a5a2d08cd4e9f692f4a8a6c02faa0a.jpg',
      title: 'Urban Life',
      username: 'streetphotog',
      likes: 187
    },
    {
      id: '2',
      imageUrl: 'https://i.pinimg.com/736x/8d/c5/85/8dc585d6bdcfae311ff5bd1fd6f1d087.jpg',
      title: 'City Lights at Night',
      username: 'nightshooter',
      likes: 243
    },
    {
      id: '3',
      imageUrl: 'https://i.pinimg.com/736x/f9/e1/f9/f9e1f9db9e003d1e6a8de3c7b9d9ca5b.jpg',
      title: 'Street Market',
      username: 'urbanexplorer',
      likes: 156
    }
  ],
  wildlife: [
    {
      id: '1',
      imageUrl: 'https://i.pinimg.com/736x/57/73/89/577389f4b72f0d0133007c46620cdce2.jpg',
      title: 'Wild Horses',
      username: 'wildlifepro',
      likes: 325
    },
    {
      id: '2',
      imageUrl: 'https://i.pinimg.com/736x/e0/f3/b9/e0f3b9f3e6863743d9b5b8b107459d9e.jpg',
      title: 'Eagle in Flight',
      username: 'birdwatcher',
      likes: 287
    },
    {
      id: '3',
      imageUrl: 'https://i.pinimg.com/736x/b5/a9/d1/b5a9d1e4b9c9f5b9b9e0e5a5a5a5a5a5.jpg',
      title: 'Lion Pride',
      username: 'safariphotographer',
      likes: 412
    },
    {
      id: '4',
      imageUrl: 'https://i.pinimg.com/736x/c7/d6/0c/c7d60c9e2c173a6a82a5a6a6a6a6a6a6.jpg',
      title: 'Underwater Coral Reef',
      username: 'diverphotog',
      likes: 198
    }
  ],
  architecture: [
    {
      id: '1',
      imageUrl: 'https://i.pinimg.com/736x/a3/bd/99/a3bd99ff636a9cd1c51b07c65f1aae60.jpg',
      title: 'Eiffel Tower View',
      username: 'architecturelover',
      likes: 276
    },
    {
      id: '2',
      imageUrl: 'https://i.pinimg.com/736x/d1/e8/a3/d1e8a3a3a3a3a3a3a3a3a3a3a3a3a3a3.jpg',
      title: 'Modern Skyscraper',
      username: 'cityviews',
      likes: 189
    },
    {
      id: '3',
      imageUrl: 'https://i.pinimg.com/736x/f4/a5/b7/f4a5b7b7b7b7b7b7b7b7b7b7b7b7b7b7.jpg',
      title: 'Ancient Temple',
      username: 'historicbuildings',
      likes: 345
    }
  ],
  macro: [
    {
      id: '1',
      imageUrl: 'https://i.pinimg.com/736x/a1/b2/c3/a1b2c3c3c3c3c3c3c3c3c3c3c3c3c3c3.jpg',
      title: 'Water Droplet on Leaf',
      username: 'macromaster',
      likes: 231
    },
    {
      id: '2',
      imageUrl: 'https://i.pinimg.com/736x/d4/e5/f6/d4e5f6f6f6f6f6f6f6f6f6f6f6f6f6f6.jpg',
      title: 'Butterfly Wing Detail',
      username: 'insectphotographer',
      likes: 187
    },
    {
      id: '3',
      imageUrl: 'https://i.pinimg.com/736x/1a/2b/3c/1a2b3c3c3c3c3c3c3c3c3c3c3c3c3c3c.jpg',
      title: 'Snowflake Close-up',
      username: 'wintermacro',
      likes: 265
    }//end macro
  ]//end category images
};

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { darkMode } = useTheme();
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular');
//use effect
  useEffect(() => {
    // Simulate API call to fetch images for the category
    setIsLoading(true);
    setTimeout(() => {
      if (category && categoryImages[category as keyof typeof categoryImages]) {
        let sortedImages = [...categoryImages[category as keyof typeof categoryImages]];
        
        if (sortBy === 'popular') {
          sortedImages.sort((a, b) => b.likes - a.likes);
        } else {
          // For demo purposes, we'll just randomize for "recent"
          sortedImages.sort(() => Math.random() - 0.5);
        }
        //set images
        setImages(sortedImages);
      } else {
        setImages([]);
      }
      //set loading
      setIsLoading(false);
    }, 800);
  }, [category, sortBy]);

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Category';

  return (
    <Layout>
      <div className="py-6 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {categoryTitle} Photography
            </h1>
            <Link 
              to="/explore" 
              className={`flex items-center text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Explore
            </Link>
          </div>
          <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Discover amazing {categoryTitle.toLowerCase()} photography from talented photographers around the world.
          </p>
        </div>

        {/* Sorting Options */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'recent')}
              className={`px-3 py-1.5 rounded-md text-sm ${
                darkMode 
                  ? 'bg-gray-700 text-gray-200 border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              } border`}
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {images.length} photos
          </span>
        </div>

        {/* Image Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className={`w-12 h-12 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-indigo-500'} rounded-full animate-spin`}></div>
          </div>
        ) : images.length === 0 ? (
          <div className={`p-8 text-center rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No images found for this category.</p>
            <Link 
              to="/explore" 
              className={`inline-block px-4 py-2 mt-4 text-sm font-medium rounded-md ${
                darkMode 
                  ? 'bg-blue-700 text-white hover:bg-blue-800' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Explore other categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div 
                key={image.id} 
                className={`group relative overflow-hidden rounded-lg shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <Link to={`/photo/${image.id}`}>
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div>
                      <h3 className="text-white font-semibold">{image.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-300">by {image.username}</span>
                        <div className="flex items-center ml-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-gray-300 ml-1">{image.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
