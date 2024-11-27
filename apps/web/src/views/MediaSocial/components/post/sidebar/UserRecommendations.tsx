import React from 'react';

const userRecommendations = [
  {
    id: 1,
    image: '/images/help1.png',
    fullName: 'John Crypto',
  },
  {
    id: 2,
    image: '/images/help1.png',
    fullName: 'Queen of Ethereum',
  },
  {
    id: 3,
    image: '/images/help1.png',
    fullName: 'Binance Bro',
  },
];

const UserRecommendations = () => {
  return (
    <div className="bg-[#f8fafc] p-4 shadow-sm rounded-lg w-full mt-2">
      <h2 className="text-xl font-bold text-gray-700 mb-2">User Recomendations</h2>
      <ul>
        {userRecommendations.map((user) => (
          <li key={user.id} className="flex justify-between items-center mb-2 border-b">
            <div className="flex items-center">
             <img src={user.image} className="w-8 h-8 mr-2 rounded-lg bg-gray-200" alt={user.fullName} />
              <h3 className="text-sm font-semibold text-gray-800">{user.fullName}</h3>
            </div>
            <button type="button" className="bg-[#60a5fa] text-sm text-white px-3 py-1 rounded-xl">Follow</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserRecommendations;
