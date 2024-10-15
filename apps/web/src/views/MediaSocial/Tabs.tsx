interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  // Fungsi untuk menangani event klik atau keyboard
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, tab: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onTabChange(tab);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row md:flex-col space-y-0 md:space-y-4 border-b md:border-b-0 md:border-r border-gray-200">
        <div
          role="button"
          tabIndex={0}
          onClick={() => onTabChange('post')}
          onKeyDown={(e) => handleKeyDown(e, 'post')}
          className={`py-2 px-4 cursor-pointer ${
            activeTab === 'post'
              ? 'border-b-2 md:border-l-4 border-blue-500 text-blue-500 font-semibold'
              : 'text-gray-500 md:font-bold hover:text-blue-500'
          }`}
        >
          Feeds
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => onTabChange('news')}
          onKeyDown={(e) => handleKeyDown(e, 'news')}
          className={`py-2 px-4 cursor-pointer ${
            activeTab === 'news'
              ? 'border-b-2 md:border-l-4 border-green-500 text-green-500 font-semibold'
              : 'text-gray-500 md:font-bold hover:text-green-500'
          }`}
        >
          News
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => onTabChange('event')}
          onKeyDown={(e) => handleKeyDown(e, 'event')}
          className={`py-2 px-4 cursor-pointer ${
            activeTab === 'event'
              ? 'border-b-2 md:border-l-4 border-red-500 text-red-500 font-semibold'
              : 'text-gray-500 md:font-bold hover:text-red-500'
          }`}
        >
          Event
        </div>
      </div>
    </div>
  );
};

export default Tabs;
