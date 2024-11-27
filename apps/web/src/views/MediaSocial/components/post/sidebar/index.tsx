import React from 'react';
import Top3Coins from './Top3Coins';  // Path ke komponen Top3Coins
import UserRecommendations from './UserRecommendations';  // Path ke komponen UserRecommendations

const SocialMediaRecommendations = () => {
  return (
    <div className=" w-full mx-2 bg-[#f1f5f9] flex justify-center items-start p-2">
      <div className="max-w-5xl w-full space-y-2">
        <Top3Coins />
        <UserRecommendations />
      </div>
    </div>
  );
};

export default SocialMediaRecommendations;
