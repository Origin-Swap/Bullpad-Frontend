import React, { useEffect, useState, useCallback } from 'react';
import { DiscordIcon, InstaIcon, TelegramIcon, TwitterIcon, WebIcon } from '@pancakeswap/uikit';
import styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/router';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useSigner } from 'wagmi';
import { parseEther } from '@ethersproject/units';
import { BACKEND_URL } from 'config/constants/backendApi';

interface ProfileProps {
  bannerUrl: string;
  avatarUrl: string;
  username: string;
  following?: number;  // Change to number
  followers?: number;
  walletAddress?: string;  // Change to number
}

const Container = styled.div``; // Mengganti 'Div' dengan 'Container'

const ProfilePage: React.FC<ProfileProps> = ({ bannerUrl, avatarUrl, followers, following }) => {
  const router = useRouter();
  const { account } = useActiveWeb3React();
  const { walletAddress } = router.query;
  const [targetAddress, setTargetAddress] = useState(walletAddress || account);
  const [userData, setUserData] = useState<{
    username?: string;
    avatarUrl?: string;
    walletAddress?: string;
    lastTransactions?: any[];
    followerList?: any[];
    followingList?: any[];
    isActivate?: boolean;
    totalTx?: string;
    following?: number;  // Assuming wallet addresses are strings
    followers?: number;
    website?: string;
    telegram?: string;
    twitter?: string;
    discord?: string;
    instagram?: string;
  }>({
    username: '',
    avatarUrl: '',
    walletAddress: '',
    lastTransactions: [],
    followerList: [],
    followingList: [],
    isActivate: false,
    totalTx: '',
    following: 0, // Ubah ke 0
    followers: 0,
    website: '',
    telegram: '',
    twitter: '',
    discord: '',
    instagram: '',
  });
  const { data: signer } = useSigner();
  const [loading, setLoading] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const fetchUserData = useCallback(async (): Promise<void> => {
    if (!account) return;

    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/${account}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      setUserData({
        ...userData,
        ...response.data,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [walletAddress, account]);

  useEffect(() => {
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 5000);
    return () => clearInterval(intervalId);
  }, [fetchUserData]);

  const userAccountData = userData;

  const activateProfile = async () => {
    const projectAddress = "0xCe4077660C599152C0F92fcD649Ac51213eBB48B"; // Ganti dengan alamat tujuan
    const amountInEther = '1'; // Jumlah BNB yang ingin dikirim

    try {
      const tx = await signer.sendTransaction({
        to: projectAddress,
        value: parseEther(amountInEther), // Gunakan parseEther untuk mengonversi
      });

      // Hanya kirim ke backend jika txHash tersedia
      if (tx && tx.hash) {
        // Kirim txHash ke backend untuk validasi
        const response = await axios.post(`${BACKEND_URL}/api/activate-profile`, {
          walletAddress: account,
          txHash: tx.hash,
        });

        console.log('Profile activated successfully:', response.data);
      }
    } catch (error) {
      console.error('Error activating profile:', error);
    }
  };

  useEffect(() => {
  if (userAccountData.followerList && account && userAccountData.followerList.includes(account)) {
    setIsFollowing(true);
  }
}, [userAccountData, account]);

  return (
    <Container>
      <div className="md:px-8 px-4 pt-4">
        {/* Banner */}
        <div className="relative md:px-4 md:pt-4 ">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuWltO_NqEn3SjW4eFfH_ubrhFFlLZZreFxw&s"
            alt="Banner"
            className="w-full md:h-60 h-40 rounded-3xl object-cover md:block hidden"
          />
          <img
            src="https://www.shutterstock.com/image-illustration/decentralized-finance-dex-hologram-financial-600nw-2290588475.jpg"
            alt="Banner"
            className="w-full md:h-60 h-40 rounded-3xl object-cover block md:hidden"
          />

          {/* Avatar */}
          <div className="flex absolute bottom-0 md:left-[20px] left-[10px] transform translate-y-1/2">
            <img
              src={userAccountData.avatarUrl || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
              alt="Avatar"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 bg-gray-100 border-white object-cover"
            />

              <div className="flex items-end md:space-x-4 space-x-2 md:px-4 mt-4 py-4 md:mt-6 md:mb-6 mb-4 transform ">
               {userData.website && (
                <WebIcon
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  alt="Avatar"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1"
                />
              )}
              {userData.telegram && (
                <TelegramIcon
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  alt="Avatar"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1"
                />
                )}
                {userData.twitter && (
                <TwitterIcon
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  alt="Avatar"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1"
                />
                )}
                {userData.discord && (
                <DiscordIcon
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  alt="Avatar"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1"
                />
                )}
                {userData.instagram && (
                <InstaIcon
                  src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                  alt="Avatar"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1"
                />
                )}
              </div>
          </div>
        </div>

        <h1 className="text-3xl font-roboto font-semibold md:font-bold md:px-4 md:mt-20 mt-14">
          {userAccountData.username
            ? userAccountData.username
            : `${account?.slice(0, 6)}...${account?.slice(-4)}`}
        </h1>
        <div className="md:abosolute md:flex md:justify-between text-left mt-2 md:px-4 md:mb-4 mb-2">
          <div className=" flex justify-start font-roboto space-x-8">
            <div>
              <span className="block md:text-xl text-md font-bold">
              {userAccountData.followers !== undefined ? userAccountData.followers : '0'}
              </span>
              <span className="text-gray-600 md:text-lg text-xs">Followers</span>
            </div>
            <div>
              <span className="block md:text-xl text-md font-bold">
              {userAccountData.following !== undefined ? userAccountData.following : '0'}
              </span>
              <span className="text-gray-600 md:text-lg text-xs">Following</span>
            </div>
            <div>
              <span className="block md:text-xl text-md font-bold">{userAccountData.totalTx}</span>
              <span className="text-gray-600 md:text-lg text-xs">Txns</span>
            </div>
          </div>

          <div className="flex md:relative md:-top-32 translate-y-1/2 mb-6 mt-4">
          <div className="mt-2 mr-2">
            {userData.isActivate ? (
              <button
                type="button"
                className="bg-green-500 text-black px-4 py-2 rounded-xl shadow hover:bg-green-600"
                onClick={() => router.push('/account/edit')}
              >
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600"
                onClick={activateProfile}
              >
                Activate Profile
              </button>
            )}
          </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;
