import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post, Comment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { likes as likeAPI, comments as commentAPI } from '../../services/apiConfig';
import CommentList from './CommentList';
import TimeAgo from 'react-timeago';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if the current user has liked this post
    const checkIfLiked = async () => {
      try {
        const response = await likeAPI.checkIfLiked(post.id);
        setLiked(response.liked);
      } catch (error) {
        console.error('Failed to check like status:', error);
      }
    };

    if (user) {
      checkIfLiked();
    }
  }, [post.id, user]);

  const handleToggleLike = async () => {
    if (!user) return;

    try {
      const response = await likeAPI.toggleLike(post.id);
      setLiked(response.liked);
      setLikesCount(prev => response.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleLoadComments = async () => {
    if (!showComments) {
      try {
        const fetchedComments = await commentAPI.getPostComments(post.id);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    try {
      setIsSubmitting(true);
      const newComment = await commentAPI.createComment({
        postId: post.id,
        content: commentText,
      });
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
      {/* Post Header */}
      <div className="flex items-center p-3 border-b border-gray-200">
        <Link to={`/profile/${post.username}`} className="flex items-center">
          <img
            src={post.userId === '1' || post.userId === '2' ? 'https://i.pinimg.com/736x/87/22/ec/8722ec261ddc86a44e7feb3b46836c10.jpg' : `https://ui-avatars.com/api/?name=${post.username}&background=random`}
            alt={post.username}
            className="w-8 h-8 rounded-full object-cover border border-gray-200"
          />
          <div className="ml-2">
            <p className="text-sm font-semibold text-gray-900">{post.username}</p>
            {post.location && (
              <p className="text-xs text-gray-500">{post.location}</p>
            )}
          </div>
        </Link>
        <div className="ml-auto">
          <button className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative pb-[100%]">
        <img
          src={post.imageUrl}
          alt={post.caption}
          className="absolute object-cover w-full h-full"
        />
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center mb-2">
          <button
            onClick={handleToggleLike}
            className={`flex items-center mr-4 ${liked ? 'text-red-500' : 'text-gray-700'}`}
          >
            <svg
              className="w-7 h-7"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button
            onClick={handleLoadComments}
            className="flex items-center mr-4 text-gray-700"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <button className="flex items-center mr-4 text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
          <button className="flex items-center ml-auto text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
        
        <div className="font-semibold text-sm mb-1">{likesCount} likes</div>
      </div>

      {/* Post Caption */}
      <div className="px-3 pb-2">
        <p className="text-sm text-gray-900">
          <Link to={`/profile/${post.username}`} className="font-semibold">
            {post.username}
          </Link>{' '}
          {post.caption}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-1">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/search?tag=${tag}`}
                className="mr-2 text-xs text-blue-600"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">
          <TimeAgo date={new Date(post.createdAt)} />
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-200">
          <div className="p-3">
            <CommentList comments={comments} postId={post.id} />
          </div>
          {user && (
            <form onSubmit={handleSubmitComment} className="flex p-3 border-t border-gray-200">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-grow px-3 py-2 border-none focus:outline-none focus:ring-0"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="px-3 py-1 text-sm font-medium text-blue-600 disabled:text-blue-300 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
