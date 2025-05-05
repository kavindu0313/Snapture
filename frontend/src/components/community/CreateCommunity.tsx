import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { communityAPI } from '../../services/api';

const CreateCommunity: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coverImage: '',
    tags: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!formData.name || !formData.description) {
      setError('Name and description are required');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const tagArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim())
        : [];
      
      const communityData = {
        name: formData.name,
        description: formData.description,
        coverImage: formData.coverImage,
        tags: tagArray,
      };
      
      const newCommunity = await communityAPI.createCommunity(communityData);
      navigate(`/communities/${newCommunity.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create community');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create New Community</h1>
      
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-sm">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Community Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="What is this community about?"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
              Cover Image URL (optional)
            </label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
              value={formData.coverImage}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma separated, optional)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="photography, nature, travel"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Community'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCommunity;
