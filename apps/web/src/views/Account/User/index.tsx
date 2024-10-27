import React, { useEffect, useState, useCallback } from 'react';
import { DiscordIcon, InstaIcon, TelegramIcon, TwitterIcon, WebIcon } from '@pancakeswap/uikit';
import styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/router';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useSigner } from 'wagmi';
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
  const { account } = useActiveWeb3React();
  const router = useRouter();
  const { walletAddress } = router.query;
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
    if (!walletAddress || !account) return;

    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/${walletAddress}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      setUserData({
        ...userData,
        ...response.data,
      });

      const followResponse = await axios.get(`${BACKEND_URL}/api/follow/status/${walletAddress}`, {
        params: { followerAddress: account }, // Kirim followerAddress sebagai query parameter
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        },
      });
      setIsFollowing(followResponse.data.isFollowing);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [walletAddress, account]);

  useEffect(() => {
    console.log("Wallet Address:", walletAddress); // Tambahkan log ini
    if (walletAddress) {
      fetchUserData();
    }
  }, [fetchUserData, walletAddress]);


  const userAccountData = userData;

  const handleFollowUnfollow = async () => {
    if (!account) {
      alert("Silakan hubungkan wallet Anda terlebih dahulu.");
      return;
    }

    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const response = await axios.post(`${BACKEND_URL}/api/${endpoint}`, {
        followerAddress: account,
        followingAddress: walletAddress,
      });

      if (response.data.message.includes("Berhasil")) {
        setIsFollowing(!isFollowing);
        // Update jumlah following/followers
        setUserData(prevData => ({
          ...prevData,
          following: isFollowing ? prevData.following - 1 : prevData.following + 1,
          followers: isFollowing ? prevData.followers - 1 : prevData.followers + 1,
        }));
      }
    } catch (error) {
      console.error("Gagal mengikuti atau berhenti mengikuti:", error);
    }
  };


  useEffect(() => {
    if (userAccountData.followerList && walletAddress && userAccountData.followerList.includes(walletAddress)) {
      setIsFollowing(true);
    }
  }, [userAccountData, walletAddress]);


  return (
    <Container>
    <div className="w-full md:m-1 rounded-2xl">
      <div className="px-2 pt-2">
        {/* Banner */}
        <div className="relative md:px-4 md:pt-4 ">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuWltO_NqEn3SjW4eFfH_ubrhFFlLZZreFxw&s"
            alt="Banner"
            className="w-full md:h-60 h-40 rounded-3xl object-cover"
          />
          <div className="flex absolute bottom-0 md:left-22 left-[10px] transform translate-y-1/2 z-10">
            <img
              src={userAccountData.avatarUrl || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'}
              alt="Avatar"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 bg-gray-100 border-white object-cover"
            />
          </div>
        </div>

      <div className="flex justify-between pl-2 items-center">
        <h1 className="md:text-3xl text-xl font-semibold md:font-bold md:ml-4 ml-1 mt-16 md:mt-20">
          {userAccountData.username
            ? userAccountData.username
            : `${userAccountData.walletAddress?.slice(0, 6)}...${userAccountData.walletAddress?.slice(-4)}`}
        </h1>
        {account && (
          <div className="mr-4">
        {isFollowing ? (
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600"
            onClick={handleFollowUnfollow} // Use the correct function
          >
            Unfollow
          </button>
        ) : (
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600"
            onClick={handleFollowUnfollow} // Use the correct function
          >
            Follow
          </button>
        )}
      </div>
      )}
      </div>

      <div className="flex items-end md:space-x-4 space-x-2 md:px-4 mt-4 py-4 md:mt-6 md:mb-6 mb-4 transform ">
        {userData.website && (
          <a href={userData.website} target="_blank" rel="noopener noreferrer">
            <WebIcon className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1" />
          </a>
        )}
        {userData.telegram && (
          <a href={userData.telegram} target="_blank" rel="noopener noreferrer">
            <TelegramIcon className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1" />
          </a>
        )}
        {userData.twitter && (
          <a href={userData.twitter} target="_blank" rel="noopener noreferrer">
            <TwitterIcon className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1" />
          </a>
        )}
        {userData.discord && (
          <a href={userData.discord} target="_blank" rel="noopener noreferrer">
            <DiscordIcon className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1" />
          </a>
        )}
        {userData.instagram && (
          <a href={userData.instagram} target="_blank" rel="noopener noreferrer">
            <InstaIcon className="w-8 h-8 md:w-10 md:h-10 rounded-lg border-4 border-white object-cover bg-gray-200 px-1 py-1" />
          </a>
        )}
      </div>
        <div className="md:absolute flex justify-between text-left mt-2 md:px-4 ml-2 md:mb-4 mb-2">
          <div className="flex md:justify-start items-center justify-center space-x-8">
            {/* Menampilkan jumlah Followers */}
            <div className="md:flex">
              <span className="block md:text-xl text-md font-bold md:mr-2">
                {userAccountData.followers !== undefined ? userAccountData.followers : '0'}
              </span>
              <span className="text-gray-600 md:text-lg text-xs">Followers</span>
            </div>
            {/* Menampilkan jumlah Following */}
            <div className="md:flex">
              <span className="block md:text-xl text-md font-bold md:mr-2">
                {userAccountData.following !== undefined ? userAccountData.following : '0'}
              </span>
              <span className="text-gray-600 md:text-lg text-xs">Following</span>
            </div>
            {/* Menampilkan jumlah Transaksi */}
            <div className="md:flex">
              <span className="block md:text-xl text-md font-bold md:mr-2">
                {userAccountData.totalTx}
              </span>
              <span className="text-gray-600 md:text-lg text-xs">Txns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Container>
  );
};

export default ProfilePage;
