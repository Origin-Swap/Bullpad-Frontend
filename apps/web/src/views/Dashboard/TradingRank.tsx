// src/components/TradingPoints.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { BACKEND_URL } from 'config/constants/backendApi';
import axios from 'axios';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

interface TradingPoint {
  rank: number;
  walletAddress: string;
  avatarUrl: string;
  username: string;
  totalPoint: number;
  dailyPoint: number;
  weeklyPoint: number;
  monthlyPoint: number;
}

const TradingPoints: React.FC = () => {
  const { account } = useActiveWeb3React();
  const [tradingPoints, setTradingPoints] = useState<TradingPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  const fetchUserData = useCallback(async (): Promise<void> => {
    if (!account) return;

    try {
      const response = await axios.put(`${BACKEND_URL}/api/users/${account}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      // Destructure isActivate and other user data from the response
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


  useEffect(() => {
    const fetchTradingPoints = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/point/tradingpoints`);
        const data = await response.json();

        // Pastikan data yang diterima adalah array
        if (Array.isArray(data)) {
          setTradingPoints(data);
        } else {
          console.error('Data received is not an array:', data);
          setTradingPoints([]);
        }
      } catch (error) {
        console.error('Error fetching trading points:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTradingPoints();
  }, []);


  if (!userData.isActivate) {
    return (
      <div className="rounded-lg p-4">
        <div className="grid mb-5">
          <p className="text-black text-center">You need to activate your account to view the rank..</p>
        </div>
      </div>
    );
  }

  const topTenLiquidityPoints = tradingPoints.slice(0, 10);
  // Jika user tidak termasuk dalam top 10, tambahkan ke array jika belum ada
  if (!topTenLiquidityPoints.find(point => point.walletAddress === account) && tradingPoints.length > 10) {
    const userPoint = tradingPoints.find(point => point.walletAddress === account);
    if (userPoint) {
      topTenLiquidityPoints.push(userPoint);
    }
  }


  return (
    <div className="container mx-auto">
      <div className="leaderboard-container px-2 py-2 text-sm text-center font-semibold bg-gray-100 rounded-md">
        <div className="flex">Rank</div>
        <div className="flex">Name</div>
        <div className="flex">Point Earning</div>
      </div>
        {tradingPoints.map((point) => (
          <div key={point.walletAddress} className="leaderboard-container px-2 text-xs divide-y py-1 divide-gray-200"
          style={{borderTop: '1px solid gray', borderBottom: '1px solid gray'}}>
            <div className="flex py-1 text-center">{point.rank}</div>
            <div className="flex py-1 text-center items-center">
              <img src={point.avatarUrl} alt="avatar" className="w-4 h-4 rounded-full mr-2" />
              <span style={{ color: point.walletAddress === account ? 'red' : 'inherit' }}>
                {point.username}
              </span>
            </div>
            <div className="flex py-1 text-center">{point.totalPoint}</div>
          </div>
        ))}
    </div>
  );
};

export default TradingPoints;
