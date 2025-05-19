import React, { useState } from 'react';
import axios from 'axios';
import './Comment.css';

function Comment({ comment, currentUserId, postOwnerId, onCommentDeleted, onCommentUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isCommentOwner = currentUserId === comment.userId;
  const isPostOwner = currentUserId === postOwnerId;
  const canModify = isCommentOwner;
  const canDelete = isCommentOwner || isPostOwner;
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleSaveEdit = async () => {
    if (editedContent.trim() === '') {
      alert('Comment cannot be empty');
      return;
    }
    
    try {
      setIsEditing(false);
      const response = await axios.put(`http://localhost:8080/comments/${comment.commentId}`, {
        userId: currentUserId,
        content: editedContent
      });
      
      if (onCommentUpdated) {
        onCommentUpdated(response.data);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
      setIsEditing(true);
    }
  };
  
  const handleDeleteClick = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        setIsDeleting(true);
        await axios.delete(`http://localhost:8080/comments/${comment.commentId}?userId=${currentUserId}`);
        
        if (onCommentDeleted) {
          onCommentDeleted(comment.commentId);
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment. Please try again.');
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-user">
          <span className="comment-username">{comment.username}</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
          {comment.createdAt !== comment.updatedAt && (
            <span className="comment-edited">(edited)</span>
          )}
        </div>
        
        <div className="comment-actions">
          {canModify && !isEditing && !isDeleting && (
            <button 
              className="edit-comment-btn" 
              onClick={handleEditClick}
              title="Edit comment"
            >
              <i className="fas fa-edit"></i>
            </button>
          )}
          
          {canDelete && !isEditing && !isDeleting && (
            <button 
              className="delete-comment-btn" 
              onClick={handleDeleteClick}
              title="Delete comment"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="comment-edit-form">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="comment-edit-textarea"
            placeholder="Edit your comment..."
          />
          <div className="comment-edit-actions">
            <button 
              className="cancel-edit-btn" 
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button 
              className="save-edit-btn" 
              onClick={handleSaveEdit}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="comment-content">
          {isDeleting ? (
            <div className="comment-deleting">Deleting comment...</div>
          ) : (
            <p>{comment.content}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Comment;