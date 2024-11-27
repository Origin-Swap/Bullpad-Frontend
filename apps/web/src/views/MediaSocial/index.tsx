import { useState } from 'react';
import Tabs from './Tabs'; // Pastikan path ini benar
import PostContent from './components/post';  // Path ke komponen PostContent
import News from './components/news';          // Path ke komponen News
import Event from './components/event';        // Path ke komponen Event

const SocialMediaHome = () => {
  const [activeTab, setActiveTab] = useState('post'); // Default tab "post"

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto">
      {/* Tabs Container */}
      <div className="md:w-2/12 w-full bg-white md:bg-[#f8fafc] text-center md:text-left flex md:block items-center justify-center p-2 md:pt-6">
        <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Content Container */}
      <div className="md:w-10/12 w-full p-2 md:p-0">
        {activeTab === 'post' && <PostContent />}
        {activeTab === 'news' && <News />}
        {activeTab === 'event' && <Event />}
      </div>
    </div>
  );
};

export default SocialMediaHome;
