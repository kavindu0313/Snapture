import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Comment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { commentAPI } from '../../services/api';
import TimeAgo from 'react-timeago';

interface CommentListProps {
  comments: Comment[];
  postId: string;
}
// This component displays a list of comments for a post, allowing users to edit and delete their own comments.
// It uses the `useAuth` context to get the current user and the `commentAPI` service to handle API requests.
const CommentList: React.FC<CommentListProps> = ({ comments, postId }) => {
  const { user } = useAuth();
  const [commentsList, setCommentsList] = useState<Comment[]>(comments);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const updatedComment = await commentAPI.updateComment(commentId, editText);
      setCommentsList(prev =>
        prev.map(comment => (comment.id === commentId ? updatedComment : comment))
      );
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await commentAPI.deleteComment(commentId);
      setCommentsList(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  if (commentsList.length === 0) {
    return <p className="text-sm text-gray-500">No comments yet.</p>;
  }

  return (
    <div className="space-y-4">
      {commentsList.map(comment => (
        <div key={comment.id} className="flex">
          <Link to={`/profile/${comment.username}`} className="flex-shrink-0">
            <img
              src={comment.userProfilePic || `https://ui-avatars.com/api/?name=${comment.username}&background=random`}
              alt={comment.username}
              className="w-8 h-8 rounded-full"
            />
          </Link>
          <div className="flex-grow ml-3">
            {editingId === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveEdit(comment.id)}
                    className="px-3 py-1 text-xs text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-sm">
                  <Link to={`/profile/${comment.username}`} className="font-medium text-gray-900">
                    {comment.username}
                  </Link>{' '}
                  <span className="text-gray-700">{comment.content}</span>
                </div>
                <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
                  <TimeAgo date={new Date(comment.createdAt)} />
                  
                  {user && user.id === comment.userId && (
                    <>
                      <button
                        onClick={() => handleEdit(comment)}
                        className="font-medium hover:text-gray-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="font-medium hover:text-gray-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
