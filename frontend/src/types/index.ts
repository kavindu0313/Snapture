// User type definition
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Optional for authentication purposes only
  fullName: string;
  bio: string;
  profilePicture: string;
  followers: string[];
  following: string[];
  interests: string[];
  createdAt: string;
  updatedAt: string;
}

// Post type definition
export interface Post {
  id: string;
  userId: string;
  username: string;
  caption: string;
  imageUrl: string;
  tags: string[];
  likes: Like[];
  comments: Comment[];
  communityId?: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
  location?: string;
}

// Comment type definition
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userProfilePic: string;
}

// Like type definition
export interface Like {
  id: string;
  postId: string;
  userId: string;
  username: string;
  createdAt: string;
}

// Community type definition
export interface Community {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  coverImage: string;
  members: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  postCount: number;
}

// Notification type definition
export interface Notification {
  id: string;
  userId: string;
  senderId: string;
  senderUsername: string;
  senderProfilePic: string;
  type: string;
  postId?: string;
  communityId?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Auth response type
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

// API Error type
export interface ApiError {
  message: string;
}
