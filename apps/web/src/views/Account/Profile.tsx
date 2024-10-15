import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { BACKEND_URL } from 'config/constants/backendApi';
import WebIcon from './svgs/web';
import TeleIcon from './svgs/telegram';
import TwitterIcon from './svgs/twitter';
import DiscordIcon from './svgs/discord';
import InstaIcon from './svgs/insta';

interface ProfileProps {
  bannerUrl: string;
  avatarUrl: string;
  username: string;
  followers: number;
  following: number;
}

const Container = styled.div``; // Mengganti 'Div' dengan 'Container'

const ProfilePage: React.FC<ProfileProps> = ({ bannerUrl, avatarUrl, followers, following }) => {
  const { account } = useActiveWeb3React();
  const [userData, setUserData] = useState<{ username?: string; walletAddress?: string; lastTransactions?: any[] }>({
    username: '',
    walletAddress: '',
    lastTransactions: [],
  });

  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserData = useCallback(async (): Promise<void> => {
    if (!account) return;
    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/${account}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchUserData]);

  const userAccountData = userData;

  return (
    <Container>
      <div className="md:px-8 px-4 pt-4">
        {/* Banner */}
        <div className="relative md:px-4 md:pt-4 ">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuWltO_NqEn3SjW4eFfH_ubrhFFlLZZreFxw&s"
            alt="Banner"
            className="w-full md:h-60 h-40 rounded-3xl object-cover"
          />

          {/* Avatar */}
          <div className="flex absolute bottom-0 md:left-[20px] left-[10px] transform translate-y-1/2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
            {account && (
              <div className="flex items-end md:space-x-4 space-x-2 md:px-4 mt-4 py-4 md:mt-6 mb-4 transform ">
                <WebIcon
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  alt="Avatar"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1"
                />
                <TeleIcon
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  alt="Avatar"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1"
                />
                <TwitterIcon
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  alt="Avatar"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1"
                />
                <DiscordIcon
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  alt="Avatar"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1"
                />
                <InstaIcon
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  alt="Avatar"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1"
                />
              </div>
            )}
          </div>
        </div>

        <h1 className="text-3xl font-semibold md:font-bold md:px-4 mt-14">
          {userAccountData.username
            ? userAccountData.username
            : `${userAccountData.walletAddress?.slice(0, 6)}...${userAccountData.walletAddress?.slice(-4)}`}
        </h1>

        <p className="text-lg font-semibold md:font-bold md:px-4 mt-2 mb-4">
          bio
        </p>

        <div className="md:abosolute md:flex md:justify-between text-left mt-2 md:px-4 md:mb-4 mb-2">
          <div className=" flex justify-start space-x-8">
            <div>
              <span className="block md:text-xl text-md font-bold">1000</span>
              <span className="text-gray-600 md:text-lg text-xs">Followers</span>
            </div>
            <div>
              <span className="block md:text-xl text-md font-bold">122</span>
              <span className="text-gray-600 md:text-lg text-xs">Following</span>
            </div>
            <div>
              <span className="block md:text-xl text-md font-bold">300</span>
              <span className="text-gray-600 md:text-lg text-xs">TX</span>
            </div>
            <div>
              <span className="block md:text-xl text-md font-bold">$1000</span>
              <span className="text-gray-600 md:text-lg text-xs">Rewards</span>
            </div>
          </div>

          <div className="flex md:relative md:-top-32 translate-y-1/2 mb-10">
            {account && (
              <div className="mt-2 mr-2">
                <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600">
                  Activate Profile
                </button>
              </div>
            )}

            {/* Sembunyikan tombol Follow jika account terhubung */}
            {!account && (
              <div className="mt-2">
                <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600">
                  Follow
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;
