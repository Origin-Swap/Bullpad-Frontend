// index.tsx
import React, { useState } from 'react';
import PostContent from './posts'; // Import PostContent component
import CreatePost from './create';
import Sidebar from './sidebar';

const IndexPage = () => {
  const [activeTab, setActiveTab] = useState<'following' | 'foryou'>('foryou'); // State to manage active tab

  return (
    <div className="flex min-h-screen bg-[#f1f5f9]">
    <div className="md:w-7/12 w-full bg-[#f8fafc] overflow-y-auto" style={{ borderRadius: '10px' }}>
    <div className="md:m-4 m-2">
      <CreatePost />
    </div>
      <div className="flex justify-between items-center mr-4 mt-4">
      <p className="text-lg font-bold ml-4 "> Feeds </p>
      <div className="bg-gray-200 border rounded-full">
        <div className="flex space-x-1">
          <button
           type="button"
            className={`py-2 px-4 rounded-xl font-roboto ${activeTab === 'foryou' ? 'bg-[#f1f5f9] text-black' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('foryou')}
          >
            For You
          </button>
          <button
            type="button"
            className={`py-2 px-4 rounded-xl ${activeTab === 'following' ? 'bg-[#f1f5f9] text-black' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('following')}
          >
            Following
          </button>
        </div>
        </div>
      </div>
      <div>
        <PostContent activeTab={activeTab} />
      </div>
      </div>
      <div className="md:w-5/12 w-full md:block hidden">
        <div className="sticky top-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
