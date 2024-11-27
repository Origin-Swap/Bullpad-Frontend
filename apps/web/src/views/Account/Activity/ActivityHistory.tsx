import React, { useEffect, useState, useCallback } from 'react';
import { BACKEND_URL } from 'config/constants/backendApi';
import axios from 'axios';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { formatDistanceToNow, differenceInDays, parseISO, format } from 'date-fns';

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
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);
  console.log('pointHistory:', pointHistory);

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

  const fetchPointHistory = useCallback(async (): Promise<void> => {
    if (!account) return;

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/users/${account}/transaction-point-history`
      );

      const { history } = response.data;
      setPointHistory(history.slice(0, 10)); // Tampilkan 5 riwayat terbaru
    } catch (error) {
      console.error('Error fetching point history:', error);
    }
  }, [account]);

  useEffect(() => {
    fetchUserData();
    fetchUserTradingPoint();
    fetchPointHistory();
  }, [fetchUserData, fetchUserTradingPoint, fetchPointHistory]);

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) return interval === 1 ? '1 year ago' : `${interval} year ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval === 1 ? '1 month ago' : `${interval} month ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval === 1 ? '1d ago' : `${interval}d ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval === 1 ? '1h ago' : `${interval}h ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval === 1 ? '1m ago' : `${interval}m ago`;
    return 's ago';
  };

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
    <div>
      <h1 className="text-left mb-2">Recent Points History</h1>
      <div className="flex justify-between items-center px-2 py-2 text-sm text-center font-semibold rounded-md">
        <div className="flex pl-1">Activities</div>
        <div className="flex pl-1">Points</div>
      </div>
      <div className="space-y-2">
        {pointHistory.map((history) => (
          <div
            key={history.id}
            className="flex justify-between px-4 py-2 border rounded-lg bg-gray-100"
          >
            <div>
            <div>{history.activity}</div>
            <div className="text-gray-400 text-xs">
              {formatTimeAgo(history.timestamp)}
            </div>
            </div>
            <div className="text-green-600 text-left text-lg">+{history.points}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradingPoints;
