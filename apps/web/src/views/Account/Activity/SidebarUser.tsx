import React, { useState } from 'react';
import Rank from './Rank';
import SocialRank from './SocialRank';
import ActivityHistory from './ActivityHistory';

const ProfileSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('points');

  return (
    <div
      className="rounded-xl">
      <div className="flex justify-start border-b border-gray-300">
        {['points', 'History'].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 text-lg font-semibold ${
              activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500 bg-white' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4 border-top mb-4">
        {activeTab === 'points' && (
          <div className="py-2 space-y-2 pb-6">
            <Rank />
            <SocialRank />
          </div>
        )}
        {activeTab === 'History' && (
          <div className="px-4 py-4 pb-6">
            <ActivityHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSidebar;
