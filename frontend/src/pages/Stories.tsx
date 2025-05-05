import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface Story {
  id: string;
  user: {
    id: string;
    username: string;
    profilePicture: string;
  };
  imageUrl: string;
  createdAt: string;
  viewed: boolean;
}

const Stories: React.FC = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [createStoryMode, setCreateStoryMode] = useState(false);
  const [storyImage, setStoryImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Mock data for stories
  useEffect(() => {
    // In a real app, this would be an API call
    const mockStories: Story[] = [
      {
        id: '1',
        user: {
          id: '101',
          username: 'Dinethya Muniweera',
          profilePicture: 'https://i.pinimg.com/736x/6d/24/50/6d245011a02d8414360752b23a14db33.jpg'
        },
        imageUrl: 'https://i.pinimg.com/736x/55/d1/f3/55d1f34f3701962940054d7d3d0bbe5f.jpg',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        viewed: false
      },
      {
        id: '2',
        user: {
          id: '102',
          username: 'Uditha Senanayke',
          profilePicture: 'https://i.pinimg.com/736x/76/47/7f/76477fe661ff2c3260e070aa7d37b44f.jpg'
        },
        imageUrl: 'https://i.pinimg.com/736x/8f/52/9a/8f529a285b0b83f36ec4b885a0030af2.jpg',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        viewed: false
      },
      {
        id: '3',
        user: {
          id: '103',
          username: 'Yenura jayawardana',
          profilePicture: 'https://i.pinimg.com/736x/6b/b6/1c/6bb61c9bf2398f4bc6c0b3155da7ca85.jpg'
        },
        imageUrl: 'https://i.pinimg.com/736x/a3/45/91/a3459170d2b29e5c478b8b6499889162.jpg',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        viewed: true
      },
      {
        id: '4',
        user: {
          id: '104',
          username: 'Isuru seananyake',
          profilePicture: 'https://i.pinimg.com/736x/50/75/de/5075de4a3561ab935efde108bdbc3ecb.jpg'
        },
        imageUrl: 'https://i.pinimg.com/736x/35/a1/80/35a1808e9918858a932de0270d4240d5.jpg',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        viewed: true
      },
      {
        id: '5',
        user: {
          id: '105',
          username: 'Amali Perera',
          profilePicture: 'https://i.pinimg.com/736x/ff/a0/04/ffa004521c402bbc700bdafc93311384.jpg'
        },
        imageUrl: 'https://i.pinimg.com/736x/0e/b1/1f/0eb11fe9f77fb86f1ee1175130ddda2b.jpg',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        viewed: true
      },
      {
        id: '6',
        user: {
          id: '106',
          username: 'Shanuka Fernando',
          profilePicture: 'https://i.pinimg.com/736x/56/3a/7c/563a7c2ec21919f9341173c8461ab2e4.jpg'
        },
        imageUrl: 'https://i.pinimg.com/736x/10/08/e3/1008e32fc5fbc7df16b6fcdce7a496bd.jpg',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        viewed: true
      },
      {
        id: '7',
        user: {
          id: '107',
          username: 'Developers',
          profilePicture: 'https://i.pinimg.com/736x/fc/d8/31/fcd8310354601ee5a6f161324cee0ada.jpg'
        },
        imageUrl: 'https://i.pinimg.com/736x/1f/87/b2/1f87b29a2df46100a75aa86b170a21cb.jpg',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        viewed: true
      },
      {
        id: '8',
        user: {
          id: '108',
          username: 'Gaming CLUB',
          profilePicture: 'https://i.pinimg.com/736x/19/d8/88/19d888eafaf67437f6cab03f7f85bb7d.jpg'
        },
        imageUrl: 'https://i.pinimg.com/736x/21/c4/91/21c491bc63c21853c08aab7e07465a73.jpg',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        viewed: true
      },
      {
        id: '9',
        user: {
          id: '109',
          username: 'SLIIT',
          profilePicture: 'https://i.pinimg.com/736x/a5/87/57/a58757fdfdf0cdf18f38dfa48749d199.jpg'
        },
        imageUrl: 'https://i.pinimg.com/736x/fc/e2/52/fce252e5e4a326d6d7d886243e345643.jpg',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        viewed: true
      }
    ];
    
    setStories(mockStories);
  }, []);

  const handleStoryClick = (story: Story) => {
    setActiveStory(story);
    // Start progress timer
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds total duration

    // Auto close after 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      setActiveStory(null);
      // Mark as viewed
      setStories(prev => 
        prev.map(s => s.id === story.id ? {...s, viewed: true} : s)
      );
    }, 5000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStoryImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStory = () => {
    // In a real app, this would upload the image to a server
    if (storyImage && user) {
      const newStory: Story = {
        id: Date.now().toString(),
        user: {
          id: user.id,
          username: user.username,
          profilePicture: user.profilePicture || 'https://via.placeholder.com/150'
        },
        imageUrl: previewUrl || '',
        createdAt: new Date().toISOString(),
        viewed: false
      };
      
      setStories(prev => [newStory, ...prev]);
      setStoryImage(null);
      setPreviewUrl(null);
      setCreateStoryMode(false);
    }
  };

  return (
    <Layout>
      <div className={`container mx-auto px-4 py-8 ${darkMode ? 'text-dark-text' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Stories</h1>
          <button 
            onClick={() => setCreateStoryMode(true)}
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            Create Story
          </button>
        </div>

        {/* Stories List */}
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {stories.map(story => (
            <div 
              key={story.id} 
              className={`flex flex-col items-center cursor-pointer`}
              onClick={() => handleStoryClick(story)}
            >
              <div className={`w-16 h-16 rounded-full ${story.viewed ? 'border-2 border-gray-300' : `border-2 ${darkMode ? 'border-blue-500' : 'border-blue-600'}`} p-0.5`}>
                <img 
                  src={story.user.profilePicture} 
                  alt={story.user.username} 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-xs mt-1 truncate w-16 text-center">{story.user.username}</span>
            </div>
          ))}
        </div>

        {/* Active Story Viewer */}
        {activeStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="relative w-full max-w-lg">
              {/* Progress bar */}
              <div className="w-full h-1 bg-gray-700 mb-2">
                <div 
                  className="h-full bg-white" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              {/* User info */}
              <div className="flex items-center mb-2">
                <img 
                  src={activeStory.user.profilePicture} 
                  alt={activeStory.user.username} 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-white">{activeStory.user.username}</span>
              </div>
              
              {/* Story image */}
              <img 
                src={activeStory.imageUrl} 
                alt="Story" 
                className="w-full rounded-lg"
              />
              
              {/* Close button */}
              <button 
                className="absolute top-2 right-2 text-white"
                onClick={() => setActiveStory(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Create Story Modal */}
        {createStoryMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className={`w-full max-w-md p-6 rounded-lg ${darkMode ? 'bg-dark-secondary' : 'bg-white'}`}>
              <h2 className="text-xl font-bold mb-4">Create New Story</h2>
              
              {previewUrl ? (
                <div className="relative mb-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button 
                    className={`absolute top-2 right-2 p-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                    onClick={() => {
                      setStoryImage(null);
                      setPreviewUrl(null);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <label 
                    htmlFor="story-image" 
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer ${darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">Click to upload an image</p>
                    </div>
                    <input id="story-image" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <button 
                  className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  onClick={() => {
                    setCreateStoryMode(false);
                    setStoryImage(null);
                    setPreviewUrl(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'} text-white ${!storyImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleCreateStory}
                  disabled={!storyImage}
                >
                  Post Story
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Stories;
