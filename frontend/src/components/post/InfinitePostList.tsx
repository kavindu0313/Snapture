import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTheme } from '../../context/ThemeContext';
import PostCard from './PostCard';

// Import types from the types directory
import { Post, Comment } from '../../types';

interface InfinitePostListProps {
  fetchPosts: (page: number) => Promise<Post[]>;
  initialPosts?: Post[];
}

const InfinitePostList: React.FC<InfinitePostListProps> = ({ fetchPosts, initialPosts = [] }) => {
  const { darkMode } = useTheme();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);



  useEffect(() => {
    if (initialPosts.length > 0) {
      setPosts(initialPosts);
    } else {
      loadMorePosts();
    }
  }, [initialPosts]);

  const loadMorePosts = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newPosts = await fetchPosts(page);
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          // Check if current user has already liked the post
          const userId = 'current-user-id'; // In a real app, get this from auth context
          const hasLiked = post.likes.some(like => like.userId === userId);
          
          // Update likes array
          const updatedLikes = hasLiked
            ? post.likes.filter(like => like.userId !== userId)
            : [...post.likes, { 
                id: Date.now().toString(), 
                postId, 
                userId, 
                username: 'current-user', // In a real app, get this from auth context
                createdAt: new Date().toISOString() 
              }];
          
          return {
            ...post,
            likes: updatedLikes,
            likesCount: updatedLikes.length
          };
        }
        return post;
      })
    );
  };

  const handleComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      userId: 'current-user-id', // In a real app, get this from auth context
      username: 'current-user', // In a real app, get this from auth context
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userProfilePic: 'https://via.placeholder.com/150' // In a real app, get this from auth context
    };
    
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, newComment],
              commentsCount: post.commentsCount + 1
            }
          : post
      )
    );
  };



  return (
    <div className={`${darkMode ? 'text-dark-text' : ''}`}>
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }
        endMessage={
          <p className="text-center my-4 text-gray-500">
            You've seen all posts
          </p>
        }
        scrollThreshold={0.9}
      >
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="mb-6">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default InfinitePostList;
