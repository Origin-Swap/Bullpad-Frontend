import React from 'react';

const topCoins = [
  {
    id: 1,
    name: '5IRE',
    symbol: '5IRE',
    price: '$27,000',
    change: '+2.5%',
  },
  {
    id: 2,
    name: 'BULL',
    symbol: 'BULL',
    price: '$1,800',
    change: '+1.8%',
  },
];

const Top3Coins = () => {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg w-full">
      <h2 className="text-xl font-bold text-gray-700 mb-2">Top Coins This Week</h2>
      <ul>
        {topCoins.map((coin) => (
          <li key={coin.id} className="flex justify-between items-center mb-2 border-b pb-2">
            <div className="flex">
              <h3 className="text-md font-semibold text-gray-800 mr-2">{coin.symbol}</h3>
              <p className={`text-xs ${coin.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {coin.change}
              </p>
            </div>
            <div className="text-right">
            <button type="button" className="bg-[#60a5fa] text-sm text-white px-3 py-1 rounded-xl">Trade</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Top3Coins;
