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
        const response = await fetch(`${BACKEND_URL}/api/point/liquiditypoints`);
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
    <div className="container mx-auto">
      <div className="leaderboard-container px-2 py-2 text-sm text-center font-semibold bg-gray-100 rounded-md">
        <div className="flex">Rank</div>
        <div className="flex">Name</div>
        <div className="flex">Point Earning</div>
      </div>
        {topTenLiquidityPoints.map((point) => (
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

export default LiquidityPoints;
