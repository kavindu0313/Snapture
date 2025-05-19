import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Stories.css';

function Stories() {
  const [stories, setStories] = useState([]);
  const [activeStory, setActiveStory] = useState(null);
  const [storyView, setStoryView] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load mock stories data
    loadMockStories();
  }, []);

  useEffect(() => {
    let timer;
    if (storyView && activeStory) {
      // Progress timer for story view
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // Move to next story or close
            handleNextStory();
            return 0;
          }
          return prev + 1;
        });
      }, 50); // 5 seconds total duration (50ms * 100)
    }
    return () => clearInterval(timer);
  }, [storyView, activeStory, currentStoryIndex]);

  const loadMockStories = () => {
    // Mock data for stories
    const mockStories = [
      {
        id: 1,
        userId: 1,
        username: 'sophia_captures',
        userImage: '',
        storyImage: 'https://i.pinimg.com/736x/2f/1e/26/2f1e266dfd032003a9ed1e33179b2439.jpg',
        timestamp: new Date(2025, 4, 17, 10, 30).toISOString(),
        seen: false
      },
      {
        id: 2,
        userId: 2,
        username: 'david_frames',
        userImage: '',
        storyImage: 'https://i.pinimg.com/736x/2f/1e/26/2f1e266dfd032003a9ed1e33179b2439.jpg',
        timestamp: new Date(2025, 4, 17, 11, 15).toISOString(),
        seen: false
      },
      {
        id: 3,
        userId: 3,
        username: 'emma_lens',
        userImage: '',
        storyImage: 'https://i.pinimg.com/736x/2f/1e/26/2f1e266dfd032003a9ed1e33179b2439.jpg',
        timestamp: new Date(2025, 4, 17, 12, 0).toISOString(),
        seen: false
      },
      {
        id: 4,
        userId: 4,
        username: 'michael_shots',
        userImage: '',
        storyImage: 'https://i.pinimg.com/736x/2f/1e/26/2f1e266dfd032003a9ed1e33179b2439.jpg',
        timestamp: new Date(2025, 4, 17, 12, 45).toISOString(),
        seen: false
      },
      {
        id: 5,
        userId: 5,
        username: 'olivia_focus',
        userImage: '',
        storyImage: 'https://i.pinimg.com/736x/2f/1e/26/2f1e266dfd032003a9ed1e33179b2439.jpg',
        timestamp: new Date(2025, 4, 17, 13, 30).toISOString(),
        seen: false
      }
    ];
    
    setStories(mockStories);
  };

  const openStory = (story, index) => {
    setActiveStory(story);
    setCurrentStoryIndex(index);
    setStoryView(true);
    setProgress(0);
    
    // Mark story as seen
    const updatedStories = [...stories];
    updatedStories[index].seen = true;
    setStories(updatedStories);
  };

  const closeStoryView = () => {
    setStoryView(false);
    setActiveStory(null);
    setProgress(0);
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setActiveStory(stories[currentStoryIndex - 1]);
      setProgress(0);
    } else {
      closeStoryView();
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setActiveStory(stories[currentStoryIndex + 1]);
      setProgress(0);
      
      // Mark story as seen
      const updatedStories = [...stories];
      updatedStories[currentStoryIndex + 1].seen = true;
      setStories(updatedStories);
    } else {
      closeStoryView();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="stories-container">
      <h2 className="stories-title">Stories</h2>
      
      <div className="stories-list">
        {/* Add Story Button */}
        <div className="story-item add-story">
          <div className="story-add-button">
            <span>+</span>
          </div>
          <span className="story-username">Add Story</span>
        </div>
        
        {/* Story Items */}
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className={`story-item ${story.seen ? 'seen' : ''}`}
            onClick={() => openStory(story, index)}
          >
            <div className="story-avatar">
              {story.userImage ? (
                <img src={story.userImage} alt={story.username} />
              ) : (
                <div className="avatar-placeholder">
                  <span>{story.username.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <span className="story-username">{story.username}</span>
          </div>
        ))}
      </div>
      
      {/* Story View Modal */}
      {storyView && activeStory && (
        <div className="story-view-modal">
          <div className="story-header">
            <div className="progress-container">
              {stories.map((story, index) => (
                <div 
                  key={story.id} 
                  className={`progress-bar ${index < currentStoryIndex ? 'completed' : ''} ${index === currentStoryIndex ? 'active' : ''}`}
                >
                  {index === currentStoryIndex && (
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="story-user-info">
              <div className="story-avatar small">
                {activeStory.userImage ? (
                  <img src={activeStory.userImage} alt={activeStory.username} />
                ) : (
                  <div className="avatar-placeholder small">
                    <span>{activeStory.username.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <span className="story-username">{activeStory.username}</span>
              <span className="story-timestamp">{formatTimestamp(activeStory.timestamp)}</span>
            </div>
            
            <button className="close-button" onClick={closeStoryView}>×</button>
          </div>
          
          <div className="story-content">
            <div className="story-image">
              <img src={activeStory.storyImage} alt="Story" />
            </div>
            
            <div className="story-navigation">
              <div className="nav-button prev" onClick={handlePrevStory}></div>
              <div className="nav-button next" onClick={handleNextStory}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stories;
