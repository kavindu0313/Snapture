import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postAPI, communityAPI } from '../../services/api';
import { Community } from '../../types';

const CreatePost: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user's communities
    const fetchCommunities = async () => {
      try {
        const userCommunities = await communityAPI.getUserCommunities();
        setCommunities(userCommunities);
      } catch (error) {
        console.error('Failed to fetch communities:', error);
      }
    };

    fetchCommunities();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!image) {
      setError('Please select an image');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('image', image);
      formData.append('caption', caption);
      
      // Add optional fields if they exist
      if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim());
        tagArray.forEach(tag => formData.append('tags', tag));
      }
      
      if (location) {
        formData.append('location', location);
      }
      
      if (communityId) {
        formData.append('communityId', communityId);
      }
      
      await postAPI.createPost(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 text-center">Create New Post</h1>
      
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image Upload */}
        <div className="space-y-4">
          <div className={`border-2 border-dashed rounded-lg ${imagePreview ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'} p-4 flex flex-col items-center justify-center h-80`}>
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-contain w-full h-full rounded-md"
                />
                <button 
                  type="button" 
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Drag and drop an image, or click to select</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors shadow-sm">
              <span>{imagePreview ? 'Change Photo' : 'Choose File'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        {/* Right Column - Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <textarea
              id="caption"
              rows={4}
              className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
              placeholder="Write a caption for your photo..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
              placeholder="nature, photography, sunset"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location (optional)
            </label>
            <input
              type="text"
              id="location"
              className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
              placeholder="New York, NY"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          {communities.length > 0 && (
            <div>
              <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
                Post to Community (optional)
              </label>
              <select
                id="community"
                className="block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
              >
                <option value="">Select a community</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !image}
              className="w-full px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Post...
                </span>
              ) : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
