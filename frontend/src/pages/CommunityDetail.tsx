import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Community, Post, User } from '../types';
import { communities as communityAPI, posts as postAPI, users as userAPI } from '../services/apiConfig';
import Layout from '../components/layout/Layout';
import PostCard from '../components/post/PostCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import InfinitePostList from '../components/post/InfinitePostList';
 //community detail page
const CommunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'about' | 'activity'>('posts');
  const [members, setMembers] = useState<User[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'mostLiked'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFeed, setActivityFeed] = useState<Array<{id: string, type: 'join' | 'post' | 'like', user: User, timestamp: string, content?: string}>>([]);
  
  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch community details
        const communityData = await communityAPI.getCommunityById(id);
        setCommunity(communityData);
        setMemberCount(communityData.memberCount);
        
        // Check if user is a member and creator status
        if (user) {
          setIsJoined(communityData.members.includes(user.id));
        }
        
        // Fetch community posts
        const communityPosts = await postAPI.getCommunityPosts(id);
        setPosts(communityPosts);
        setFilteredPosts(communityPosts);
        
        // Create mock activity feed
        const mockActivity = [
          {
            id: '1',
            type: 'join' as const,
            user: { id: 'user1', username: 'newMember123', profilePicture: 'https://via.placeholder.com/50' } as User,
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '2',
            type: 'post' as const,
            user: { id: 'user2', username: 'contentCreator', profilePicture: 'https://via.placeholder.com/50' } as User,
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            content: 'Posted a new photo in the community'
          },
          {
            id: '3',
            type: 'like' as const,
            user: { id: 'user3', username: 'photoEnthusiast', profilePicture: 'https://via.placeholder.com/50' } as User,
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            content: 'Liked a post: "Amazing sunset capture!"'
          }
        ];
        setActivityFeed(mockActivity);
      } catch (err) {
        console.error('Failed to fetch community data:', err);
        setError('Failed to load community. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCommunityData();
  }, [id, user]);
  
  // Fetch community members when the members tab is selected
  useEffect(() => {
    const fetchMembers = async () => {
      if (activeTab !== 'members' || !id || !community) return;
      
      try {
        setLoadingMembers(true);
        // In a real app, this would be paginated
        const memberIds = community.members || [];
        if (memberIds.length > 0) {
          // Fetch each user individually since we don't have a bulk fetch method
          const fetchedMembers: User[] = [];
          // Only fetch first 20 for performance
          const membersToFetch = memberIds.slice(0, 20);
          
          for (const memberId of membersToFetch) {
            try {
              const userData = await userAPI.getProfile(memberId);
              fetchedMembers.push(userData);
            } catch (error) {
              console.error(`Failed to fetch user with ID ${memberId}:`, error);
            }
          }
          //return data to community detail page
          setMembers(fetchedMembers);
        }
      } catch (err) {
        console.error('Failed to fetch community members:', err);
      } finally {
        setLoadingMembers(false);
      }
    };
    
    fetchMembers();
  }, [activeTab, id, community]);

  const handleJoinLeave = async () => {
    if (!user || !community) return;

    try {
      if (isJoined) {
        await communityAPI.leaveCommunity(community.id);
        setMemberCount(prev => prev - 1);
      } else {
        await communityAPI.joinCommunity(community.id);
        setMemberCount(prev => prev + 1);
      }
      setIsJoined(!isJoined);
    } catch (error) {
      console.error('Failed to join/leave community:', error);
    }
  };
  
  const loadMorePosts = async () => {
    if (!id || !hasMore) return;
    
    try {
      const nextPage = page + 1;
      // Pass only the ID parameter since the API doesn't accept page parameter
      // In a real app, you would implement pagination in the API
      const morePosts = await postAPI.getCommunityPosts(id);
      
      // Filter out posts that we already have to simulate pagination
      const existingPostIds = posts.map((post: Post) => post.id);
      const newPosts = morePosts.filter((post: Post) => !existingPostIds.includes(post.id));
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to load more posts:', error);
      setHasMore(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className={`w-12 h-12 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-indigo-500'} rounded-full animate-spin`}></div>
        </div>
      </Layout>
    );
  }

  if (error || !community) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className={`p-4 ${darkMode ? 'text-red-400 bg-red-900' : 'text-red-700 bg-red-100'} rounded-md`}>
            {error || 'Community not found'}
          </div>
          <button
            onClick={() => navigate(-1)}
            className={`px-4 py-2 mt-4 text-sm font-medium ${darkMode ? 'text-gray-300 bg-gray-800 hover:bg-gray-700' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'} rounded-md`}
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  // Determine if current user is the creator
  const isCreator = user && user.id === community.creatorId;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4">
        {/* Community Header */}
        <div className={`relative mb-6 overflow-hidden rounded-lg shadow-sm ${darkMode ? 'bg-dark-secondary' : 'bg-white'}`}>
          <div className="h-64 bg-gray-200">
            {community.coverImage && (
              <img
                src={community.coverImage}
                alt={community.name}
                className="object-cover w-full h-full"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-3xl font-bold">{community.name}</h1>
              <p className="mt-1 text-sm opacity-90">
                {memberCount} members • {community.postCount} posts • Created {new Date(community.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className={`p-6 ${darkMode ? 'bg-dark-secondary' : 'bg-white'} flex flex-wrap items-center justify-between gap-4`}>
            <div className="flex space-x-4 flex-wrap">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'posts' 
                  ? (darkMode ? 'bg-blue-700 text-white' : 'bg-indigo-600 text-white')
                  : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'members' 
                  ? (darkMode ? 'bg-blue-700 text-white' : 'bg-indigo-600 text-white')
                  : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}
              >
                Members
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'about' 
                  ? (darkMode ? 'bg-blue-700 text-white' : 'bg-indigo-600 text-white')
                  : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'activity' 
                  ? (darkMode ? 'bg-blue-700 text-white' : 'bg-indigo-600 text-white')
                  : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}`}
              >
                Activity
              </button>
            </div>
            
            <div className="flex space-x-3">
              {user && !isCreator && (
                <button
                  onClick={handleJoinLeave}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isJoined
                      ? (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                      : (darkMode ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-indigo-600 text-white hover:bg-indigo-700')
                  }`}
                >
                  {isJoined ? 'Leave Community' : 'Join Community'}
                </button>
              )}
              
              {isCreator && (
                <button
                  onClick={() => navigate(`/communities/${community.id}/edit`)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Edit Community
                </button>
              )}
              
              {user && isJoined && (
                <button
                  onClick={() => navigate('/create-post', { state: { communityId: community.id } })}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${darkMode ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                >
                  Create Post
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Community Content Based on Active Tab */}
        <div className="mb-6">
          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div>
              {/* Search and Sort Controls */}
              <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-1/2">
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value === '') {
                          setFilteredPosts(posts);
                        } else {
                          const filtered = posts.filter(post => 
                            post.caption.toLowerCase().includes(e.target.value.toLowerCase()) ||
                            post.tags.some(tag => tag.toLowerCase().includes(e.target.value.toLowerCase()))
                          );
                          setFilteredPosts(filtered);
                        }
                      }}
                      className={`w-full px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 text-gray-200 placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sort by:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => {
                        setSortOption(e.target.value as 'newest' | 'oldest' | 'mostLiked');
                        const postsToSort = [...(searchQuery ? filteredPosts : posts)];
                        
                        if (e.target.value === 'newest') {
                          postsToSort.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                        } else if (e.target.value === 'oldest') {
                          postsToSort.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                        } else if (e.target.value === 'mostLiked') {
                          postsToSort.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
                        }
                        
                        setFilteredPosts(postsToSort);
                      }}
                      className={`px-3 py-1.5 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border`}
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="mostLiked">Most Liked</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {(searchQuery ? filteredPosts : posts).length === 0 ? (
                <div className={`p-8 text-center rounded-lg shadow-sm ${darkMode ? 'bg-dark-secondary' : 'bg-white'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No posts in this community yet.</p>
                  {user && isJoined && (
                    <button
                      onClick={() => navigate('/create-post', { state: { communityId: community.id } })}
                      className={`px-4 py-2 mt-4 text-sm font-medium rounded-md ${darkMode ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                    >
                      Create the first post
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {(searchQuery ? filteredPosts : posts).map(post => (
                    <div key={post.id} className={`p-4 rounded-lg shadow-sm ${darkMode ? 'bg-dark-secondary' : 'bg-white'}`}>
                      <PostCard post={post} />
                    </div>
                  ))}
                  
                  {hasMore && (
                    <div className="flex justify-center my-4">
                      <button 
                        onClick={loadMorePosts}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Load More Posts
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-dark-secondary' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Community Members</h2>
              
              {loadingMembers ? (
                <div className="flex justify-center py-8">
                  <div className={`w-10 h-10 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-indigo-500'} rounded-full animate-spin`}></div>
                </div>
              ) : members.length === 0 ? (
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No members found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map(member => (
                    <div key={member.id} className={`flex items-center p-3 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
                      <img 
                        src={member.profilePicture || 'https://via.placeholder.com/150'} 
                        alt={member.username} 
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <div>
                        <Link to={`/profile/${member.username}`} className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                          {member.username}
                        </Link>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.fullName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Activity Feed Tab */}
          {activeTab === 'activity' && (
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-dark-secondary' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Community Activity</h2>
              
              <div className="space-y-4">
                {activityFeed.length === 0 ? (
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No recent activity.</p>
                ) : (
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
                    
                    {activityFeed.map((activity) => (
                      <div key={activity.id} className="relative pl-10 pb-6">
                        <div className="absolute left-3 top-1.5 w-5 h-5 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center">
                          {activity.type === 'join' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                          )}
                          {activity.type === 'post' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                          {activity.type === 'like' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          )}
                        </div>
                        
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} p-4 rounded-lg`}>
                          <div className="flex items-center mb-2">
                            <img 
                              src={activity.user.profilePicture} 
                              alt={activity.user.username} 
                              className="w-8 h-8 rounded-full object-cover mr-2"
                            />
                            <div>
                              <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{activity.user.username}</span>
                              <span className={`ml-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(activity.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            {activity.type === 'join' && 'Joined the community'}
                            {activity.type === 'post' && activity.content}
                            {activity.type === 'like' && activity.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className={`p-6 rounded-lg shadow-sm ${darkMode ? 'bg-dark-secondary' : 'bg-white'}`}>
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>About {community.name}</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Description</h3>
                  <p className={darkMode ? 'text-gray-400' : 'text-gray-700'}>{community.description}</p>
                </div>
                
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Tags</h3>
                  {community.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {community.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 text-sm rounded-full ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-indigo-100 text-indigo-800'}`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>No tags specified</p>
                  )}
                </div>
                
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Community Stats</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Members</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{memberCount}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Posts</p>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{community.postCount}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Created</p>
                      <p className={`text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{new Date(community.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                {isCreator && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Community Management</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/communities/${community.id}/edit`)}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${darkMode ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                      >
                        Edit Community
                      </button>
                      <button
                        onClick={() => navigate(`/communities/${community.id}/settings`)}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        Community Settings
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CommunityDetail;
