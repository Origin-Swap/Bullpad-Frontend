import React, { useEffect, useState, useCallback } from 'react';
import { BACKEND_URL } from 'config/constants/backendApi';
import axios from 'axios';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

interface TradingPoint {
  rank: number;
  walletAddress: string;
  totalPoint: number;
  currentPoint: number;
  claimedPoint: number;
}

interface PointHistory {
  id: number;
  activity: string;
  points: number;
  timestamp: string;
}

const TradingPoints: React.FC = () => {
  const { account } = useActiveWeb3React();
  const [userPoint, setUserPoint] = useState<TradingPoint | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<{ isActivate?: boolean }>({
    isActivate: false,
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

      const { isActivate } = response.data;
      setUserData({ isActivate });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [account]);

  const fetchUserTradingPoint = useCallback(async (): Promise<void> => {
    if (!account) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/point/tradingpoints`);
      const data: TradingPoint[] = await response.json();

      // Cari data untuk wallet address terkait
      const userPointData = data.find((point) => point.walletAddress === account);
      setUserPoint(userPointData || null);
    } catch (error) {
      console.error('Error fetching trading points:', error);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchUserData();
    fetchUserTradingPoint();
  }, [fetchUserData, fetchUserTradingPoint]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData.isActivate) {
    return (
      <div className="rounded-lg p-4">
        <p className="text-black text-center">You need to activate your account to view the rank and points.</p>
      </div>
    );
  }

  if (!userPoint) {
    return (
      <div className="rounded-lg p-4">
        <p className="text-black text-center">No rank available for your account.</p>
      </div>
    );
  }

  return (
    <div
      className="mx-4 p-4 rounded-xl shadow-lg"
      style={{ border: "2px solid #e2e8f0" }}
    >
      <h1 className="text-left mb-2">My Transaction Rank</h1>
      <div className="flex justify-between">
      <p className="py-1 text-sm text-center">Rank:</p>
      <p className="py-1 text-sm text-center">{userPoint.rank  || '0'}</p>
      </div>
      <div className="flex justify-between">
      <p className="py-1 text-sm text-center">Current:</p>
      <p className="py-1 text-sm text-center">{userPoint.currentPoint || '0'} Points</p>
      </div>
      <div className="flex justify-between">
      <p className="py-1 text-sm text-center">Claimed:</p>
      <p className="py-1 text-sm text-center">{userPoint.claimedPoint || '0'} Points</p>
      </div>
      <div className="flex justify-between">
      <p className="py-1 text-sm text-center">Total:</p>
      <p className="py-1 text-sm text-center">{userPoint.totalPoint || '0'} Points</p>
      </div>
      <div className="flex justify-center mt-4">
        <button
          type="button"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#fef9c3] text-black hover:bg-blue-500 hover:text-white transition"
        >
          Convert to BULL
        </button>
      </div>
    </div>
  );
};

export default TradingPoints;
