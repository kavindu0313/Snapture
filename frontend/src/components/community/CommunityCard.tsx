import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Community } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { communityAPI } from '../../services/api';

interface CommunityCardProps {
  community: Community;
  onJoinLeave?: (communityId: string, joined: boolean) => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community, onJoinLeave }) => {
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState(
    user ? community.members.includes(user.id) : false
  );
  const [memberCount, setMemberCount] = useState(community.memberCount);
  const [isLoading, setIsLoading] = useState(false);

  const isCreator = user && user.id === community.creatorId;

  const handleJoinLeave = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      if (isJoined) {
        await communityAPI.leaveCommunity(community.id);
        setMemberCount(prev => prev - 1);
      } else {
        await communityAPI.joinCommunity(community.id);
        setMemberCount(prev => prev + 1);
      }
      setIsJoined(!isJoined);
      
      if (onJoinLeave) {
        onJoinLeave(community.id, !isJoined);
      }
    } catch (error) {
      console.error('Failed to join/leave community:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="relative h-32">
        <img
          src={community.coverImage || 'https://source.unsplash.com/random/800x200/?nature'}
          alt={community.name}
          className="object-cover w-full h-full"
        />
      </div>
      
      <div className="p-4">
        <Link to={`/communities/${community.id}`} className="block mb-2">
          <h3 className="text-lg font-bold text-gray-900">{community.name}</h3>
        </Link>
        
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">{community.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{memberCount}</span> members •{' '}
            <span className="font-medium">{community.postCount}</span> posts
          </div>
          
          <div className="flex space-x-2">
            <Link
              to={`/communities/${community.id}`}
              className="px-4 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              View Details
            </Link>
            
            {!isCreator && (
              <button
                onClick={handleJoinLeave}
                disabled={isLoading}
                className={`px-4 py-1 text-sm font-medium rounded-md ${
                  isJoined
                    ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    : 'text-white bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isLoading ? 'Loading...' : isJoined ? 'Leave' : 'Join'}
              </button>
            )}
            
            {isCreator && (
              <Link
                to={`/communities/${community.id}/edit`}
                className="px-4 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Manage
              </Link>
            )}
          </div>
        </div>
        
        {community.tags.length > 0 && (
          <div className="flex flex-wrap mt-3 gap-1">
            {community.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs text-indigo-800 bg-indigo-100 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityCard;
