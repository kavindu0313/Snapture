import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ImageEditor from './ImageEditor';

interface PostEditorProps {
  onSubmit: (data: { image: string; caption: string; tags: string[] }) => void;
  initialImage?: string;
  initialCaption?: string;
  initialTags?: string[];
}

const PostEditor: React.FC<PostEditorProps> = ({ 
  onSubmit, 
  initialImage = '', 
  initialCaption = '', 
  initialTags = [] 
}) => {
  const { darkMode } = useTheme();
  const [image, setImage] = useState<string>(initialImage);
  const [caption, setCaption] = useState<string>(initialCaption);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState<string>('');
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleEditImage = () => {
    setShowEditor(true);
  };

  const handleSaveEdit = (editedImage: string) => {
    setImage(editedImage);
    setShowEditor(false);
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ image, caption, tags });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className={`${darkMode ? 'text-dark-text' : ''}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload/Preview */}
        <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700 bg-dark-secondary' : 'border-gray-300'}`}>
          {image ? (
            <div className="relative">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full rounded-lg"
              />
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  type="button"
                  onClick={handleEditImage}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImage('');
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG or GIF (MAX. 10MB)
                  </p>
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </label>
            </div>
          )}
        </div>

        {/* Caption */}
        <div>
          <label htmlFor="caption" className="block text-sm font-medium mb-2">
            Caption
          </label>
          <textarea
            id="caption"
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg ${
              darkMode 
                ? 'bg-dark-bg border-gray-700 focus:border-blue-500' 
                : 'border-gray-300 focus:border-blue-500'
            } focus:outline-none`}
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Tags
          </label>
          <div className="flex items-center">
            <input
              id="tags"
              type="text"
              className={`flex-1 px-3 py-2 border rounded-lg ${
                darkMode 
                  ? 'bg-dark-bg border-gray-700 focus:border-blue-500' 
                  : 'border-gray-300 focus:border-blue-500'
              } focus:outline-none`}
              placeholder="Add tags (press Enter to add)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className={`ml-2 px-4 py-2 rounded-lg ${
                darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
              onClick={handleAddTag}
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div 
                  key={tag} 
                  className={`flex items-center px-3 py-1 rounded-full text-sm ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  #{tag}
                  <button
                    type="button"
                    className="ml-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`w-full py-2 rounded-lg ${
              darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-medium`}
            disabled={!image}
          >
            Post
          </button>
        </div>
      </form>

      {/* Image Editor Modal */}
      {showEditor && image && (
        <ImageEditor
          imageUrl={image}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default PostEditor;
