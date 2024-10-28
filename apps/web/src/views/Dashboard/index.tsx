import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from '@pancakeswap/localization';
import { ChainId } from '@pancakeswap/sdk';
import { FetchStatus } from 'config/constants/types';
import { BACKEND_URL } from 'config/constants/backendApi';
import { useRouter } from 'next/router';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useNativeCurrency from 'hooks/useNativeCurrency';
import useTokenBalance, { useGetCakeBalance, useGetUsdtBalance }from 'hooks/useTokenBalance';
import { formatBigNumber } from '@pancakeswap/utils/formatBalance';
import { useBalance } from 'wagmi';
import TradingRank from './TradingRank';
import LiquidityRank from './LiquidityRank';
import TokenInfo from './TokenVolume';
import TradingData from './TradingData';


const UserDataComponent: React.FC = () => {
  const { account, chainId } = useActiveWeb3React();
  const [ priceData, setPriceData ] = useState();
  const [userData, setUserData] = useState<{
    isActivate?: boolean;
    username?: string;
    avatarUrl?: string;
    walletAddress?: string;
  }>({
    isActivate: false,
    username: '',
    avatarUrl: '',
    walletAddress: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const isBSC = chainId === ChainId.SIRE_MAINNET
  const bnbBalance = useBalance({ addressOrName: account, chainId: ChainId.SIRE_MAINNET })
  const nativeBalance = useBalance({ addressOrName: account, enabled: !isBSC })

  const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useGetCakeBalance()
  const { balance: usdtBalance, fetchStatus: usdtFetchStatus } = useGetUsdtBalance()

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Ambil harga 5ire dari CoinGecko
        const priceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=5ire&vs_currencies=usd');
        const priceInUSD = priceResponse.data['5ire'].usd;
        setPriceData(priceInUSD);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchPrices();
  }, []);

  const fetchUserData = useCallback(async (): Promise<void> => {
      if (!account) return;
      try {
        const response = await axios.put(`${BACKEND_URL}/api/users/${account}`, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        const { isActivate, ...rest } = response.data; // Ensure isActivate is extracted

          setUserData({
            ...rest,
            isActivate,
        });
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

    if (!account) {
    return (
      <div className="h-screen text-center content-center">
        <p className="text-black">Connect wallet to view dashboard</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const userAccountData = userData;

  return (
    <div className="md:m-4 m-2 rounded-lg p-2">
      <div className="mb-5">
        <div className="flex items-center justify-between">
        <div className="flex">
        <img
          src={userAccountData && userAccountData.avatarUrl && userAccountData.avatarUrl.trim() !== ''
            ? userAccountData.avatarUrl
            : 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg'}
          alt="avatar"
          className="h-10 w-10 mr-2 rounded-full"
        />
          <div>
            <p className="text-xs"> Welcome Back</p>
            <p className="text-lg">
              {userAccountData && userAccountData.username
                ? userAccountData.username
                : userAccountData && userAccountData.walletAddress
                  ? `${userAccountData.walletAddress.slice(0, 6)}...${userAccountData.walletAddress.slice(-4)}`
                  : 'N/A'}
            </p>

          </div>
          </div>
          {userAccountData && !userAccountData.isActivate && (
          <button
            type="button"
            className="ml-4 border-2 px-4 py-2 border-gray-300 rounded-lg shadow-md"
            onClick={() => router.push('/account')}
          >
            Activate Profile
          </button>
        )}
        </div>
        <div className="flex flex-col md:flex-row gap-2 mt-4">

          <div className="w-full md:w-6/12 p-4 md:mb-4" style={{border: '1px solid gray', borderRadius: '10px'}}>
          <div
          className="flex pt-4 pb-4 items-center content-center bg-blue-100 justify-between"
          style={{border: '1px solid gray', borderRadius: '10px'}}
          >
            <div className="ml-4">
              <p className="text-lg text-black">Balance</p>
              <p className="text-2xl md:text-3xl text-black">
                ${bnbBalance?.data?.value && priceData ? (parseFloat(formatBigNumber(bnbBalance.data.value, 2)) * priceData).toFixed(2) : '0.00'}
              </p>

            </div>
            <div className="flex justify-center items-center">
              <img src="/images/cardheaddashboard.png" alt="sire" className="h-24 w-24 mr-8" />
            </div>
          </div>
            <div className="mt-3">
              <div className="flex justify-between mb-4 mt-2" style={{borderBottom: '1px solid gray', paddingBottom: '10px'}}>
              <div className="flex">
               <img
               src="https://pbs.twimg.com/profile_images/1745156323338301443/5tCj2PYf_400x400.jpg"
               alt="sire"
               className="h-10 w-10 mr-2 rounded-full"
               />
               <div>
                <p className="text-lg font-semibold">5IRE</p>
                <p className="text-xs">5ire Chain</p>
               </div>
               </div>
               <div>
                <p className="text-lg font-semibold">{formatBigNumber(bnbBalance.data.value, 2)}</p>
                <p className="text-xs">${bnbBalance?.data?.value && priceData ? (parseFloat(formatBigNumber(bnbBalance.data.value, 2)) * priceData).toFixed(2) : '0.00'}</p>
               </div>
              </div>
              <div className="flex justify-between mb-4 mt-2" style={{borderBottom: '1px solid gray', paddingBottom: '10px'}}>
              <div className="flex">
               <img
               src="https://w7.pngwing.com/pngs/840/253/png-transparent-usdt-cryptocurrencies-icon-thumbnail.png"
               alt="sire"
               className="h-10 w-10 mr-2 rounded-full"
               />
               <div>
                <p className="text-lg font-semibold">USDT</p>
                <p className="text-xs">tether USD</p>
               </div>
               </div>
               <div>
                <p className="text-lg font-semibold">{formatBigNumber(usdtBalance, 2)}</p>
                <p className="text-xs">$0.000</p>
               </div>
              </div>
              <div className="flex justify-between mb-4 mt-2" style={{borderBottom: '1px solid gray', paddingBottom: '10px'}}>
              <div className="flex">
               <img
               src="/BullPad.png"
               alt="sire"
               className="h-10 w-10 mr-2 rounded-full"
               />
               <div>
                <p className="text-lg font-semibold">BULL</p>
                <p className="text-xs">BullPad</p>
               </div>
               </div>
               <div>
                <p className="text-lg font-semibold">{formatBigNumber(cakeBalance, 2)}</p>
                <p className="text-xs">$0.000</p>
               </div>
              </div>
            </div>
          </div>
          <div
          className="w-full md:w-6/12 mb-4 mt-4 md:mt-0 md:mb-0"
          style={{border: '1px solid black', borderRadius: '10px', }}>
            <p className="px-2 py-4 font-bold text-center" style={{borderBottom: '1px solid black'}}>Top 10 trading points</p>
            <TradingRank />
          </div>
          <div className="w-full md:w-6/12 mb-4 md:mb-0"
           style={{border: '1px solid black', borderRadius: '10px', }}>
            <p className="px-4 py-4 font-bold text-center" style={{borderBottom: '1px solid black'}}>Top 10 Liquidity Points</p>
            <LiquidityRank />
          </div>
        </div>
        {/* <TradeHistory />
        <LiquidityHistory /> */}
        <TokenInfo/>
        <TradingData />
      </div>
    </div>
  );
};

export default UserDataComponent;
