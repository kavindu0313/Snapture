import { AuthResponse, User, Post, Comment, Like, Community, Notification } from '../types';

// Mock data - stored in localStorage to persist between sessions
const getStoredUsers = (): User[] => {
  const storedUsers = localStorage.getItem('mockUsers');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  
  // Default users if none exist in storage
  const defaultUsers: User[] = [
    {
      id: '1',
      username: 'user1',
      email: 'user1@example.com',
      fullName: 'User One',
      password: 'password', // Store password for mock auth
      bio: 'This is a mock user',
      profilePicture: 'https://i.pinimg.com/736x/87/22/ec/8722ec261ddc86a44e7feb3b46836c10.jpg',
      followers: ['2'],
      following: ['2'],
      interests: ['photography', 'nature'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      username: 'user2',
      email: 'user2@example.com',
      fullName: 'User Two',
      password: 'password', // Store password for mock auth
      bio: 'Another mock user',
      profilePicture: 'https://i.pinimg.com/736x/87/22/ec/8722ec261ddc86a44e7feb3b46836c10.jpg',
      followers: ['1'],
      following: ['1'],
      interests: ['travel', 'food'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('mockUsers', JSON.stringify(defaultUsers));
  return defaultUsers;
};

let mockUsers: User[] = getStoredUsers();

// Helper function to save users to localStorage
const saveUsers = () => {
  localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
};

const mockLikes: Like[] = [
  {
    id: '1',
    postId: '1',
    userId: '2',
    username: 'user2',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    postId: '1',
    userId: '1',
    username: 'user1',
    createdAt: new Date().toISOString()
  }
];

const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '2',
    username: 'user2',
    content: 'This is a mock comment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userProfilePic: 'https://i.pinimg.com/736x/87/22/ec/8722ec261ddc86a44e7feb3b46836c10.jpg'
  }
];

const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    username: 'user1',
    caption: 'This is a mock post',
    imageUrl: 'https://i.pinimg.com/736x/4a/e9/ef/4ae9efa41d72b0c5fe9f3bc948380047.jpg',
    tags: ['mock', 'test'],
    likes: mockLikes.filter(like => like.postId === '1'),
    comments: mockComments.filter(comment => comment.postId === '1'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 2,
    commentsCount: 1
  },
  {
    id: '2',
    userId: '1',
    username: 'user1',
    caption: 'Another mock post',
    imageUrl: 'https://i.pinimg.com/736x/46/ee/33/46ee3324e0e5aa5b5e853310b251185c.jpg',
    tags: ['example', 'photo'],
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0
  },
  {
    id: '3',
    userId: '2',
    username: 'user2',
    caption: 'Post from user 2',
    imageUrl: 'https://i.pinimg.com/736x/57/73/89/577389f4b72f0d0133007c46620cdce2.jpg',
    tags: ['user2', 'content'],
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0
  }
];



const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Mock Community',
    description: 'A community for testing',
    creatorId: '1',
    coverImage: 'https://i.pinimg.com/736x/a3/bd/99/a3bd99ff636a9cd1c51b07c65f1aae60.jpg',
    tags: ['mock', 'test'],
    members: ['1', '2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    memberCount: 2,
    postCount: 1
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    senderId: '2',
    senderUsername: 'user2',
    senderProfilePic: 'https://via.placeholder.com/50',
    type: 'LIKE',
    postId: '1',
    message: 'User2 liked your post',
    read: false,
    createdAt: new Date().toISOString()
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API
export const mockAuthAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    await delay(500); // Simulate network delay
    
    const user = mockUsers.find(u => u.username === username);
    
    if (user && (user.password === password || password === 'password')) {
      // Create a copy of user without the password for security
      const { password: _, ...userWithoutPassword } = user;
      
      return {
        token: `mock-jwt-token-${user.id}-${Date.now()}`,
        refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`,
        user: userWithoutPassword as User
      };
    }
    throw new Error('Invalid credentials');
  },
  
  register: async (userData: Partial<User>): Promise<User> => {
    await delay(800); // Simulate network delay
    
    // Check if username already exists
    if (mockUsers.some(u => u.username === userData.username)) {
      throw new Error('Username already exists');
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: userData.username || '',
      email: userData.email || '',
      password: userData.password,
      fullName: userData.fullName || '',
      bio: userData.bio || '',
      profilePicture: userData.profilePicture || 'https://via.placeholder.com/150',
      followers: [],
      following: [],
      interests: userData.interests || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    saveUsers();
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  },
  
  // Add refresh token method
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    await delay(300); // Simulate network delay
    
    // Extract user ID from the refresh token
    const match = refreshToken.match(/mock-refresh-token-(user-\d+)-\d+/);
    if (!match) {
      throw new Error('Invalid refresh token');
    }
    
    const userId = match[1];
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create a copy of user without the password for security
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      refreshToken: `mock-refresh-token-${user.id}-${Date.now()}`,
      user: userWithoutPassword as User
    };
  },
  
  // Add ping method to test the backend connection
  ping: async (): Promise<any> => {
    await delay(200);
    return {
      status: 'success',
      message: 'Mock API is running',
      timestamp: Date.now()
    };
  },
  
  // Add status method to check API status
  status: async (): Promise<any> => {
    await delay(200);
    return {
      status: 'success',
      message: 'Mock API is running',
      timestamp: Date.now()
    };
  }
};

// User API
export const mockUserAPI = {
  getProfile: async (userId: string): Promise<User> => {
    await delay(300);
    const user = mockUsers.find(u => u.id === userId);
    if (user) return user;
    throw new Error('User not found');
  },
  getProfileByUsername: async (username: string): Promise<User> => {
    await delay(300);
    const user = mockUsers.find(u => u.username === username);
    if (user) return user;
    throw new Error('User not found');
  },
  updateProfile: async (userId: string, userData: Partial<User>): Promise<User> => {
    await delay(500);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData, updatedAt: new Date().toISOString() };
      return mockUsers[userIndex];
    }
    throw new Error('User not found');
  },
  searchUsers: async (query: string, type: 'username' | 'interest'): Promise<User[]> => {
    await delay(300);
    if (type === 'username') {
      return mockUsers.filter(u => u.username.includes(query));
    } else {
      return mockUsers.filter(u => u.interests.some(i => i.includes(query)));
    }
  },
  followUser: async (userId: string, followId: string): Promise<{ message: string }> => {
    await delay(500);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    const followIndex = mockUsers.findIndex(u => u.id === followId);
    
    if (userIndex >= 0 && followIndex >= 0) {
      if (!mockUsers[userIndex].following.includes(followId)) {
        mockUsers[userIndex].following.push(followId);
        mockUsers[followIndex].followers.push(userId);
      }
      return { message: 'User followed successfully' };
    }
    throw new Error('User not found');
  },
  unfollowUser: async (userId: string, unfollowId: string): Promise<{ message: string }> => {
    await delay(500);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    const unfollowIndex = mockUsers.findIndex(u => u.id === unfollowId);
    
    if (userIndex >= 0 && unfollowIndex >= 0) {
      mockUsers[userIndex].following = mockUsers[userIndex].following.filter(id => id !== unfollowId);
      mockUsers[unfollowIndex].followers = mockUsers[unfollowIndex].followers.filter(id => id !== userId);
      return { message: 'User unfollowed successfully' };
    }
    throw new Error('User not found');
  }
};

// Post API
export const mockPostAPI = {
  getAllPosts: async (): Promise<Post[]> => {
    await delay(300);
    return mockPosts;
  },
  getPostById: async (postId: string): Promise<Post> => {
    await delay(300);
    const post = mockPosts.find(p => p.id === postId);
    if (post) return post;
    throw new Error('Post not found');
  },
  getUserPosts: async (userId: string): Promise<Post[]> => {
    await delay(300);
    return mockPosts.filter(p => p.userId === userId);
  },
  getCommunityPosts: async (communityId: string): Promise<Post[]> => {
    await delay(300);
    // In a real app, posts would have a communityId field
    return mockPosts.slice(0, 2); // Just return some mock posts
  },
  getFeed: async (page: number = 0, size: number = 10): Promise<{ content: Post[], totalPages: number }> => {
    await delay(500);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedPosts = mockPosts.slice(startIndex, endIndex);
    return {
      content: paginatedPosts,
      totalPages: Math.ceil(mockPosts.length / size)
    };
  },
  createPost: async (formData: FormData): Promise<Post> => {
    await delay(700);
    const newPost: Post = {
      id: (mockPosts.length + 1).toString(),
      userId: '1', // Assuming current user is user1
      username: 'user1',
      caption: formData.get('caption') as string || '',
      imageUrl: 'https://via.placeholder.com/500', // Mock image URL
      tags: (formData.get('tags') as string || '').split(','),
      likes: [],
      comments: [],
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockPosts.push(newPost);
    return newPost;
  },
  updatePost: async (postId: string, postData: Partial<Post>): Promise<Post> => {
    await delay(500);
    const postIndex = mockPosts.findIndex(p => p.id === postId);
    if (postIndex >= 0) {
      mockPosts[postIndex] = { ...mockPosts[postIndex], ...postData, updatedAt: new Date().toISOString() };
      return mockPosts[postIndex];
    }
    throw new Error('Post not found');
  },
  deletePost: async (postId: string): Promise<{ message: string }> => {
    await delay(500);
    const postIndex = mockPosts.findIndex(p => p.id === postId);
    if (postIndex >= 0) {
      mockPosts.splice(postIndex, 1);
      return { message: 'Post deleted successfully' };
    }
    throw new Error('Post not found');
  },
  searchPosts: async (query: string, type: 'tag' | 'caption'): Promise<Post[]> => {
    await delay(300);
    if (type === 'tag') {
      return mockPosts.filter(p => p.tags.some(t => t.includes(query)));
    } else {
      return mockPosts.filter(p => p.caption.includes(query));
    }
  }
};

// Comment API
export const mockCommentAPI = {
  getPostComments: async (postId: string): Promise<Comment[]> => {
    await delay(300);
    return mockComments.filter(c => c.postId === postId);
  },
  createComment: async (commentData: Partial<Comment>): Promise<Comment> => {
    await delay(500);
    const newComment: Comment = {
      id: (mockComments.length + 1).toString(),
      postId: commentData.postId || '',
      userId: commentData.userId || '',
      username: 'user1', // Assuming current user is user1
      content: commentData.content || '',
      userProfilePic: 'https://via.placeholder.com/50',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockComments.push(newComment);
    
    // Update comment count on post
    const postIndex = mockPosts.findIndex(p => p.id === newComment.postId);
    if (postIndex >= 0) {
      mockPosts[postIndex].comments.push(newComment);
      mockPosts[postIndex].commentsCount += 1;
    }
    
    return newComment;
  },
  updateComment: async (commentId: string, content: string): Promise<Comment> => {
    await delay(500);
    const commentIndex = mockComments.findIndex(c => c.id === commentId);
    if (commentIndex >= 0) {
      mockComments[commentIndex] = { 
        ...mockComments[commentIndex], 
        content, 
        updatedAt: new Date().toISOString() 
      };
      return mockComments[commentIndex];
    }
    throw new Error('Comment not found');
  },
  deleteComment: async (commentId: string): Promise<{ message: string }> => {
    await delay(500);
    const commentIndex = mockComments.findIndex(c => c.id === commentId);
    if (commentIndex >= 0) {
      const postId = mockComments[commentIndex].postId;
      mockComments.splice(commentIndex, 1);
      
      // Update comment count on post
      const postIndex = mockPosts.findIndex(p => p.id === postId);
      if (postIndex >= 0 && mockPosts[postIndex].commentsCount > 0) {
        mockPosts[postIndex].comments = mockPosts[postIndex].comments.filter(c => c.id !== commentId);
        mockPosts[postIndex].commentsCount -= 1;
      }
      
      return { message: 'Comment deleted successfully' };
    }
    throw new Error('Comment not found');
  }
};

// Like API
export const mockLikeAPI = {
  getPostLikes: async (postId: string): Promise<Like[]> => {
    await delay(300);
    return mockLikes.filter(like => like.postId === postId);
  },
  toggleLike: async (postId: string): Promise<{ liked: boolean }> => {
    await delay(300);
    const postIndex = mockPosts.findIndex(p => p.id === postId);
    if (postIndex >= 0) {
      // Simulate toggling like status
      const userId = '1'; // Assuming current user is user1
      const existingLikeIndex = mockLikes.findIndex(l => l.postId === postId && l.userId === userId);
      
      let liked = false;
      if (existingLikeIndex >= 0) {
        // Unlike
        mockLikes.splice(existingLikeIndex, 1);
        mockPosts[postIndex].likes = mockPosts[postIndex].likes.filter(l => !(l.postId === postId && l.userId === userId));
        mockPosts[postIndex].likesCount -= 1;
      } else {
        // Like
        const newLike: Like = {
          id: (mockLikes.length + 1).toString(),
          postId,
          userId,
          username: 'user1',
          createdAt: new Date().toISOString()
        };
        mockLikes.push(newLike);
        mockPosts[postIndex].likes.push(newLike);
        mockPosts[postIndex].likesCount += 1;
        liked = true;
      }
      return { liked };
    }
    throw new Error('Post not found');
  },
  checkIfLiked: async (postId: string): Promise<{ liked: boolean }> => {
    await delay(300);
    // Randomly determine if current user has liked the post
    return { liked: Math.random() > 0.5 };
  }
};

// Community API
export const mockCommunityAPI = {
  getAllCommunities: async (): Promise<Community[]> => {
    await delay(300);
    return mockCommunities;
  },
  getCommunityById: async (communityId: string): Promise<Community> => {
    await delay(300);
    const community = mockCommunities.find(c => c.id === communityId);
    if (community) return community;
    throw new Error('Community not found');
  },
  createCommunity: async (communityData: Partial<Community>): Promise<Community> => {
    await delay(700);
    const newCommunity: Community = {
      id: (mockCommunities.length + 1).toString(),
      name: communityData.name || '',
      description: communityData.description || '',
      creatorId: '1', // Current user is creator
      coverImage: communityData.coverImage || 'https://via.placeholder.com/800x200',
      tags: communityData.tags || [],
      members: ['1'], // Creator is automatically a member
      memberCount: 1,
      postCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockCommunities.push(newCommunity);
    return newCommunity;
  },
  updateCommunity: async (communityId: string, communityData: Partial<Community>): Promise<Community> => {
    await delay(500);
    const communityIndex = mockCommunities.findIndex(c => c.id === communityId);
    if (communityIndex >= 0) {
      mockCommunities[communityIndex] = { 
        ...mockCommunities[communityIndex], 
        ...communityData, 
        updatedAt: new Date().toISOString() 
      };
      return mockCommunities[communityIndex];
    }
    throw new Error('Community not found');
  },
  deleteCommunity: async (communityId: string): Promise<{ message: string }> => {
    await delay(500);
    const communityIndex = mockCommunities.findIndex(c => c.id === communityId);
    if (communityIndex >= 0) {
      mockCommunities.splice(communityIndex, 1);
      return { message: 'Community deleted successfully' };
    }
    throw new Error('Community not found');
  },
  joinCommunity: async (communityId: string): Promise<{ message: string }> => {
    await delay(500);
    const communityIndex = mockCommunities.findIndex(c => c.id === communityId);
    if (communityIndex >= 0) {
      if (!mockCommunities[communityIndex].members.includes('1')) {
        mockCommunities[communityIndex].members.push('1');
      }
      return { message: 'Joined community successfully' };
    }
    throw new Error('Community not found');
  },
  leaveCommunity: async (communityId: string): Promise<{ message: string }> => {
    await delay(500);
    const communityIndex = mockCommunities.findIndex(c => c.id === communityId);
    if (communityIndex >= 0) {
      mockCommunities[communityIndex].members = mockCommunities[communityIndex].members.filter(id => id !== '1');
      return { message: 'Left community successfully' };
    }
    throw new Error('Community not found');
  },
  getUserCommunities: async (): Promise<Community[]> => {
    await delay(300);
    return mockCommunities.filter(c => c.members.includes('1'));
  },
  searchCommunities: async (query: string, type: 'name' | 'tag'): Promise<Community[]> => {
    await delay(300);
    if (type === 'name') {
      return mockCommunities.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
    } else {
      return mockCommunities.filter(c => c.tags.some(t => t.toLowerCase().includes(query.toLowerCase())));
    }
  }
};

// Notification API
export const mockNotificationAPI = {
  getNotifications: async (): Promise<Notification[]> => {
    await delay(300);
    return mockNotifications;
  },
  getUnreadNotifications: async (): Promise<Notification[]> => {
    await delay(300);
    return mockNotifications.filter(n => !n.read);
  },
  getUnreadCount: async (): Promise<{ count: number }> => {
    await delay(300);
    const count = mockNotifications.filter(n => !n.read).length;
    return { count };
  },
  markAsRead: async (notificationId: string): Promise<{ message: string }> => {
    await delay(300);
    const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
    if (notificationIndex >= 0) {
      mockNotifications[notificationIndex].read = true;
      return { message: 'Notification marked as read' };
    }
    throw new Error('Notification not found');
  },
  markAllAsRead: async (): Promise<{ message: string }> => {
    await delay(500);
    mockNotifications.forEach(n => n.read = true);
    return { message: 'All notifications marked as read' };
  },
  deleteNotification: async (notificationId: string): Promise<{ message: string }> => {
    await delay(300);
    const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
    if (notificationIndex >= 0) {
      mockNotifications.splice(notificationIndex, 1);
      return { message: 'Notification deleted successfully' };
    }
    throw new Error('Notification not found');
  }
};

const mockApi = {
  authAPI: mockAuthAPI,
  userAPI: mockUserAPI,
  postAPI: mockPostAPI,
  commentAPI: mockCommentAPI,
  likeAPI: mockLikeAPI,
  communityAPI: mockCommunityAPI,
  notificationAPI: mockNotificationAPI
};

export default mockApi;

export {
  mockAuthAPI as authAPI,
  mockUserAPI as userAPI,
  mockPostAPI as postAPI,
  mockCommentAPI as commentAPI,
  mockLikeAPI as likeAPI,
  mockCommunityAPI as communityAPI,
  mockNotificationAPI as notificationAPI
};
