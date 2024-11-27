import React, { useEffect, useState, useCallback } from 'react';
import { BACKEND_URL } from 'config/constants/backendApi';
import axios from 'axios';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

interface LiquidityPoint {
  rank: number;
  walletAddress: string;
  avatarUrl: string;
  username: string;
  totalPoint: number;
}

const LiquidityPoints: React.FC = () => {
  const { account } = useActiveWeb3React();
  const [liquidityPoints, setLiquidityPoints] = useState<LiquidityPoint[]>([]);
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
      const response = await axios.put(`${BACKEND_URL}/api/users/${account}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const { isActivate, walletAddress, ...rest } = response.data;

      setUserData({
        ...rest,
        isActivate,
        walletAddress: account,
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
    const fetchLiquidityPoints = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/point/socialpoints`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setLiquidityPoints(data);
        } else {
          console.error('Data received is not an array:', data);
          setLiquidityPoints([]);
        }
      } catch (error) {
        console.error('Error fetching liquidity points:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiquidityPoints();
  }, []);

  if (!userData.isActivate) {
    return (
      <div className="rounded-lg p-4">
        <div className="grid mb-5">
          <p className="text-black text-center">You need to activate your account to view the rank.</p>
        </div>
      </div>
    );
  }

  // Ambil 10 rank tertinggi
  const topTenLiquidityPoints = liquidityPoints.slice(0, 10);
  // Jika user tidak termasuk dalam top 10, tambahkan ke array jika belum ada
  if (!topTenLiquidityPoints.find(point => point.walletAddress === account) && liquidityPoints.length > 10) {
    const userPoint = liquidityPoints.find(point => point.walletAddress === account);
    if (userPoint) {
      topTenLiquidityPoints.push(userPoint);
    }
  }

  return (
    <div className="container mx-auto pb-4">
      <div className="leaderboard-container px-2 py-2 text-sm text-center font-semibold rounded-md">
        <div className="flex pl-1">Rank</div>
        <div className="flex pl-1">User</div>
        <div className="text-right pr-1">Point</div>
      </div>
        {topTenLiquidityPoints.map((point) => (
          <div key={point.walletAddress} className="leaderboard-container px-2 text-xs divide-y py-1 divide-gray-200">
            <div className="py-1 text-sm text-center bg-sky-100 rounded-lg mr-2">{point.rank}</div>
            <div className="flex text-sm py-1 text-center items-center bg-sky-100 pl-2 rounded-l-lg">
              <img src={point.avatarUrl} alt="avatar" className="w-4 h-4 rounded-full mr-2" />
              <span style={{ color: point.walletAddress === account ? 'red' : 'inherit' }}>
                {point.username}
              </span>
            </div>
            <div className="py-1 text-sm text-right bg-sky-100 pr-2 rounded-r-lg">{point.totalPoint}</div>
          </div>
        ))}
    </div>
  );
};

export default LiquidityPoints;
