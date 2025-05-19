import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Comment from './Comment';
import './CommentSection.css';

function CommentSection({ postId, postOwnerId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    // Get current user info from localStorage
    const currentUserId = localStorage.getItem('userId');
    const userFullName = localStorage.getItem('userFullName');
    
    if (currentUserId) {
      setUserId(currentUserId);
      setUsername(userFullName || 'Anonymous');
    }
    
    // Load comments for this post
    fetchComments();
  }, [postId]);
  
  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:8080/posts/${postId}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (newComment.trim() === '') {
      return;
    }
    
    if (!userId) {
      alert('Please log in to comment');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const commentData = {
        userId: userId,
        username: username,
        content: newComment
      };
      
      const response = await axios.post(`http://localhost:8080/posts/${postId}/comments`, commentData);
      
      // Add the new comment to the list
      setComments([response.data, ...comments]);
      
      // Clear the comment input
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCommentDeleted = (commentId) => {
    // Remove the deleted comment from the list
    setComments(comments.filter(comment => comment.commentId !== commentId));
  };
  
  const handleCommentUpdated = (updatedComment) => {
    // Update the comment in the list
    setComments(comments.map(comment => 
      comment.commentId === updatedComment.commentId ? updatedComment : comment
    ));
  };
  
  return (
    <div className="comment-section">
      <h3 className="comment-section-title">Comments ({comments.length})</h3>
      
      {userId ? (
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="Write a comment..."
            className="comment-input"
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            className="post-comment-btn"
            disabled={isSubmitting || newComment.trim() === ''}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="login-to-comment">
          Please log in to comment
        </div>
      )}
      
      {isLoading ? (
        <div className="comments-loading">Loading comments...</div>
      ) : error ? (
        <div className="comments-error">
          {error}
          <button onClick={fetchComments} className="retry-btn">Retry</button>
        </div>
      ) : comments.length === 0 ? (
        <div className="no-comments">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <Comment
              key={comment.commentId}
              comment={comment}
              currentUserId={userId}
              postOwnerId={postOwnerId}
              onCommentDeleted={handleCommentDeleted}
              onCommentUpdated={handleCommentUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentSection;
