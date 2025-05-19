import React, { useState, useEffect, useCallback, memo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import './Explore.css';

function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    orientation: 'all',
    color: 'all',
    resolution: 'all',
    license: 'all'
  });

  // Mock data for photo categories - using smaller, optimized images
  const photoCategories = [
    { id: 'royalty-free', name: 'Royalty Free Images', count: '308,000+', image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&w=400&q=75' },
    { id: 'public-domain', name: 'Public Domain Images', count: '308,100+', image: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?auto=format&w=400&q=75' },
    { id: 'creative-commons', name: 'Creative Commons Images', count: '308,200+', image: 'https://images.unsplash.com/photo-1682687218147-9806132dc697?auto=format&w=400&q=75' },
    { id: 'high-resolution', name: 'High Resolution Images', count: '308,400+', image: 'https://images.unsplash.com/photo-1682687982360-3fbccf2b481d?auto=format&w=400&q=75' },
    { id: 'creative', name: 'Creative Images', count: '308,700+', image: 'https://images.unsplash.com/photo-1682687218608-5e2d20dd75a8?auto=format&w=400&q=75' },
    { id: '4k', name: '4K Images', count: '309,200+', image: 'https://images.unsplash.com/photo-1682687220067-dcedfcbcd897?auto=format&w=400&q=75' },
    { id: 'png', name: 'PNG Images', count: '309,100+', image: 'https://images.unsplash.com/photo-1682695797221-8164ff1fafc9?auto=format&w=400&q=75' },
    { id: 'non-copyrighted', name: 'Non Copyrighted Images', count: '308,900+', image: 'https://images.unsplash.com/photo-1682687220208-22d7a2543e88?auto=format&w=400&q=75' },
    { id: 'cover-photos', name: 'Cover Photos & Images', count: '309,300+', image: 'https://images.unsplash.com/photo-1682695794947-17061dc284dd?auto=format&w=400&q=75' },
    { id: 'hdr', name: 'HD R Photos & Images', count: '4,200+', image: 'https://images.unsplash.com/photo-1682685797661-9e0c87f59c60?auto=format&w=400&q=75' }
  ];

  // Mock data for trending photos - using smaller, optimized images
  const trendingPhotos = [
    { id: 1, title: 'Mountain Sunset', photographer: 'Alex Rivera', likes: 1243, tags: ['landscape', 'nature'], image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&w=400&q=75' },
    { id: 2, title: 'Ocean Waves', photographer: 'Maria Chen', likes: 982, tags: ['ocean', 'water'], image: 'https://images.unsplash.com/photo-1682687220305-ce8a9ab237b1?auto=format&w=400&q=75' },
    { id: 3, title: 'City Lights', photographer: 'James Wilson', likes: 1567, tags: ['city', 'night'], image: 'https://images.unsplash.com/photo-1682687220923-c5acf4cbaebd?auto=format&w=400&q=75' },
    { id: 4, title: 'Desert Dunes', photographer: 'Sarah Ahmed', likes: 756, tags: ['desert', 'landscape'], image: 'https://images.unsplash.com/photo-1682687220945-540e6f3ba9cd?auto=format&w=400&q=75' },
    { id: 5, title: 'Forest Path', photographer: 'Michael Brown', likes: 1102, tags: ['forest', 'nature'], image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&w=400&q=75' },
    { id: 6, title: 'Northern Lights', photographer: 'Emma Johnson', likes: 2341, tags: ['night', 'sky'], image: 'https://images.unsplash.com/photo-1682687220305-ce8a9ab237b1?auto=format&w=400&q=75' }
  ];

  // Memoized filtering functions to prevent unnecessary recalculations
  const getFilteredCategories = useCallback(() => {
    return photoCategories.filter(category => {
      // Filter by search query
      if (searchQuery.trim() !== '') {
        return category.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    });
  }, [searchQuery]);

  const getFilteredPhotos = useCallback(() => {
    return trendingPhotos.filter(photo => {
      // Filter by search query
      if (searchQuery.trim() !== '') {
        const matchesTitle = photo.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPhotographer = photo.photographer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTags = photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTitle || matchesPhotographer || matchesTags;
      }
      return true;
    });
  }, [searchQuery]);
  
  // Memoized filtered data
  const filteredCategories = getFilteredCategories();
  const filteredPhotos = getFilteredPhotos();

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, this would trigger a search API call
    console.log('Searching for:', searchQuery);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Memoized category card component to prevent unnecessary re-renders
  const CategoryCard = memo(({ category }) => (
    <div className="category-card">
      <div className="category-image">
        <img 
          src={category.image} 
          alt={category.name} 
          loading="lazy" 
          width="400" 
          height="200"
        />
      </div>
      <div className="category-details">
        <h3>{category.name}</h3>
        <p>{category.count} Images</p>
      </div>
    </div>
  ));

  // Memoized photo card component to prevent unnecessary re-renders
  const PhotoCard = memo(({ photo }) => (
    <div className="photo-card">
      <div className="photo-image">
        <img 
          src={photo.image} 
          alt={photo.title} 
          loading="lazy" 
          width="400" 
          height="300"
        />
        <div className="photo-overlay">
          <button className="download-btn" onClick={(e) => handleDownload(e, photo)}>
            <span className="download-icon">⬇️</span>
          </button>
          <button className="like-btn">
            <span className="like-icon">❤️</span>
          </button>
        </div>
      </div>
      <div className="photo-details">
        <h4>{photo.title}</h4>
        <div className="photo-meta">
          <span className="photographer">{photo.photographer}</span>
          <span className="likes">❤️ {photo.likes}</span>
        </div>
        <div className="photo-tags">
          {photo.tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  ));
  
  // Handle photo download
  const handleDownload = (e, photo) => {
    e.stopPropagation();
    // In a real app, this would trigger a download of the image
    alert(`Downloading ${photo.title} by ${photo.photographer}`);
  };
  
  // Render filter section
  const FilterSection = () => (
    <div className={`filter-section ${showFilters ? 'show' : ''}`}>
      <div className="filter-row">
        <div className="filter-group">
          <label>Orientation:</label>
          <select 
            value={filters.orientation} 
            onChange={(e) => handleFilterChange('orientation', e.target.value)}
          >
            <option value="all">All</option>
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
            <option value="square">Square</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Color:</label>
          <select 
            value={filters.color} 
            onChange={(e) => handleFilterChange('color', e.target.value)}
          >
            <option value="all">All Colors</option>
            <option value="black_white">Black & White</option>
            <option value="red">Red</option>
            <option value="orange">Orange</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Resolution:</label>
          <select 
            value={filters.resolution} 
            onChange={(e) => handleFilterChange('resolution', e.target.value)}
          >
            <option value="all">All</option>
            <option value="4k">4K+</option>
            <option value="hd">HD</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>License:</label>
          <select 
            value={filters.license} 
            onChange={(e) => handleFilterChange('license', e.target.value)}
          >
            <option value="all">All</option>
            <option value="free">Free to use</option>
            <option value="commercial">Commercial</option>
            <option value="editorial">Editorial</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Use effect to simulate initial loading state
  useEffect(() => {
    setLoading(true);
    // Simulate API loading time but keep it short
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h1>Stock Photos & Images</h1>
        
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search photos and illustrations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search photos"
            />
            <button type="submit" className="search-button" aria-label="Submit search">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        </div>
        
        <div className="header-actions">
          <div className="category-tabs">
            <button 
              className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              All Categories
            </button>
            <button 
              className={`category-tab ${activeCategory === 'trending' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('trending')}
            >
              Trending
            </button>
            <button 
              className={`category-tab ${activeCategory === 'new' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('new')}
            >
              New
            </button>
            <button 
              className={`category-tab ${activeCategory === 'premium' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('premium')}
            >
              Premium
            </button>
          </div>
          
          <button className="filter-toggle" onClick={toggleFilters}>
            {showFilters ? 'Hide Filters' : 'Show Filters'} 🔍
          </button>
        </div>
        
        {/* Filter section */}
        <FilterSection />
      </div>
      
      <div className="explore-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <Suspense fallback={<div className="loading">Loading categories...</div>}>
              <div className="categories-grid">
                {filteredCategories.slice(0, 8).map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </Suspense>
            
            <div className="section-header">
              <h2 className="section-title">Trending Photos</h2>
              <div className="results-count">{filteredPhotos.length} photos</div>
            </div>
            
            <Suspense fallback={<div className="loading">Loading photos...</div>}>
              <div className="trending-photos-grid">
                {filteredPhotos.map(photo => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            </Suspense>
            
            {filteredPhotos.length === 0 && (
              <div className="no-results">
                <p>No photos found matching your search criteria.</p>
                <button onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    orientation: 'all',
                    color: 'all',
                    resolution: 'all',
                    license: 'all'
                  });
                }} className="clear-filters-btn">
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Explore;
