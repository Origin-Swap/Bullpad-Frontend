import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from 'config/constants/backendApi';

interface TransactionRecord {
  type: string;
  nativePrice: number;
  usdPrice: number;
  tokenAmount: number;
  amountInUsd: number;
  txhash: string;
  date: string;
  tokenSymbol: string;
}

const TransactionRecords: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to format date to a relative time string
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

  // Fetch data from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BACKEND_URL}/api/transactions`);

        // Sort and get only the last 20 transactions
        const sortedTransactions = response.data
          .sort((a: TransactionRecord, b: TransactionRecord) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 100); // Limit to last 20 transactions

        setTransactions(sortedTransactions);
      } catch (err) {
        console.error('Failed to fetch transaction data:', err);
        setError('Failed to fetch transaction data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-4">
      <h2 className="text-lg font-bold mb-2 mt-6">Last 100 Transactions (all users & tokens)</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left rounded-full" style={{borderRadius: '10px', border: '1px solid gray'}}>
          <thead>
            <tr>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold" style={{border: '1px solid gray'}}>TIME</th>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold" style={{border: '1px solid gray'}}>TYPE</th>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold hidden md:block" style={{border: '1px solid gray'}}>PRICE 5IRE</th>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold" style={{border: '1px solid gray'}}>PRICE USD</th>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold" style={{border: '1px solid gray'}}>AMOUNT</th>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold" style={{border: '1px solid gray'}}>Value</th>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold" style={{border: '1px solid gray'}}>TX</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.txhash} className="border-t border-gray-300">
                <td className="md:px-4 md:text-sm text-xs px-2 py-1" style={{border: '1px solid gray'}}>
                  {formatTimeAgo(transaction.date)}
                </td>
                <td
                  className={`md:px-4 md:text-sm text-xs px-2 py-1 ${
                    transaction.type === 'Buy' ? 'text-green-500' : transaction.type === 'Sell' ? 'text-red-500' : ''
                  }`}
                  style={{border: '1px solid gray'}}
                >
                  {transaction.type}
                </td>
                <td className="md:px-4 md:text-sm text-xs px-2 py-1 hidden md:block" style={{border: '1px solid gray'}}>
                  {transaction.nativePrice.toFixed(4)}
                </td>
                <td className="md:px-4 md:text-sm text-xs px-2 py-1" style={{border: '1px solid gray'}}>
                  ${transaction.usdPrice.toFixed(4)}
                </td>
                <td className="md:px-4 md:text-sm text-xs px-2 py-1" style={{border: '1px solid gray'}}>
                  {transaction.tokenAmount.toFixed(1)} {transaction.tokenSymbol}
                </td>
                <td className="md:px-4 md:text-sm text-xs px-2 py-1" style={{border: '1px solid gray'}}>
                  ${transaction.amountInUsd.toFixed(3)}
                </td>
                <td className="md:px-4 md:text-sm text-xs px-2 py-1" style={{border: '1px solid gray'}}>
                  <a
                    href={`https://5irescan.io/tx/${transaction.txhash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    Tx
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionRecords;
