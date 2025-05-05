import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Community } from '../types';
import { communities as communityAPI } from '../services/apiConfig';
import Layout from '../components/layout/Layout';
import CommunityCard from '../components/community/CommunityCard';
import { useAuth } from '../context/AuthContext';
//import { Link } from 'react-router-dom';  
const Communities: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all communities
        const allCommunities = await communityAPI.getAllCommunities();
        setCommunities(allCommunities);
        
        // Fetch user's communities if authenticated
        if (isAuthenticated) {
          const userCommunitiesData = await communityAPI.getUserCommunities();
          setUserCommunities(userCommunitiesData);
        }
      } catch (err) {
        console.error('Failed to fetch communities:', err);
        setError('Failed to load communities. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, [isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      const fetchSearchResults = async () => {
        try {
          setIsLoading(true);
          const results = await communityAPI.searchCommunities(searchQuery, 'name');
          setCommunities(results);
        } catch (err) {
          console.error('Failed to search communities:', err);
          setError('Failed to search communities. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSearchResults();
    }
  };

  const handleJoinLeave = (communityId: string, joined: boolean) => {
    // Update user communities list when joining/leaving
    if (joined) {
      const community = communities.find(c => c.id === communityId);
      if (community && !userCommunities.some(c => c.id === communityId)) {
        setUserCommunities(prev => [...prev, community]);
      }
    } else {
      setUserCommunities(prev => prev.filter(c => c.id !== communityId));
    }
  };

  const displayedCommunities = activeTab === 'all' ? communities : userCommunities;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 md:mb-0">Photography Communities</h1>
          
          <div className="flex flex-col w-full space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:w-auto">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search communities..."
                className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 text-white bg-indigo-600 rounded-r-md hover:bg-indigo-700"
              >
                Search
              </button>
            </form>
            
            <div className="flex space-x-2">
              <div className="relative group">
                <button
                  className="px-4 py-2 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <span>View Community Details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  <div className="py-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {communities.length > 0 ? (
                      communities.slice(0, 5).map(community => (
                        <Link
                          key={community.id}
                          to={`/communities/${community.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {community.name}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No communities found</div>
                    )}
                    {communities.length > 5 && (
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <Link
                          to="/communities"
                          className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                        >
                          View all communities
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Link
                to="/create-community"
                className="px-4 py-2 text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Create Community
              </Link>
            </div>
            
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'all'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All Communities
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'my'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Communities
            </button>
          </div>
        )}
        
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : displayedCommunities.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">
              {activeTab === 'all'
                ? 'No communities found.'
                : 'You haven\'t joined any communities yet.'}
            </p>
            {activeTab === 'my' && (
              <button
                onClick={() => setActiveTab('all')}
                className="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Explore Communities
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedCommunities.map(community => (
              <CommunityCard
                key={community.id}
                community={community}
                onJoinLeave={handleJoinLeave}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Communities;
