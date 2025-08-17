"use client";
import React from 'react';
import Avatar from './Avatar';
import { useProfile } from '@/app/context/profileContext';

interface Person {
  _id: string;
  fullname?: string;
  firstName?: string;
  lastName?: string;
  avatarLink?: string;
}

interface TopBarProps {
  selectedUserId: string;
  setSelectedUserId: (id: string | null) => void;
  offlinePeople: Record<string, Person>;
  onlinePeople: Record<string, { firstName:string,lastName:string,fullname: string; avatarLink?: string }>;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  onBack?: () => void;
  isMobile?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  selectedUserId,
  offlinePeople,
  onlinePeople,
  connectionStatus,
  onBack,
  isMobile = false
}) => {
const { userDetails } = useProfile();
  
  // Get the person from either onlinePeople or offlinePeople
  const onlinePerson = onlinePeople[selectedUserId];
  const offlinePerson = offlinePeople[selectedUserId];
  const person = onlinePerson || offlinePerson;

  if (!userDetails) return null;

  // Handle different person types with proper fallbacks
  const fullname =`${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || 
                   'Unknown User';

  const isOnline = !!onlinePeople[selectedUserId];
  const avatarLink = userDetails.avatarLink;

  return (
    <div className="flex items-center gap-3 p-3">
      {isMobile && (
        <button 
          onClick={onBack}
          className="p-1 text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      )}
      
      <div className="flex-shrink-0">
        <Avatar
          userId={selectedUserId}
          fullname={fullname}
          size="sm"
          avatarLink={avatarLink}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h2 className="text-white font-medium truncate">{fullname}</h2>
        <p className={`text-xs truncate ${
          isOnline ? 'text-green-400' : 'text-gray-400'
        }`}>
          {isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
      
      {connectionStatus !== 'connected' && (
        <div className={`text-xs px-2 py-1 rounded ${
          connectionStatus === 'connecting' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'
        }`}>
          {connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
        </div>
      )}
    </div>
  );
};

export default TopBar;