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
      <h2 className="text-lg font-bold mb-2 mt-6 px-2">Last 100 Transactions</h2>
      <div className="grid md:grid-cols-7 grid-cols-5 gap-y-2 text-sm text-left p-2 rounded-lg">
        {/* Header */}
        <div className="font-bold px-2">TIME</div>
        <div className="font-bold">TYPE</div>
        <div className="font-bold hidden md:block">PRICE 5IRE</div>
        <div className="font-bold hidden md:block">PRICE USD</div>
        <div className="font-bold">AMOUNT</div>
        <div className="font-bold">VALUE</div>
        <div className="font-bold">TX</div>

        {/* Content */}
        {transactions.map((transaction) => (
          <React.Fragment key={transaction.txhash}>
            <div  className={`p-2 ${
              transaction.type === 'Buy'
                ? 'bg-green-100 rounded-l-lg'
                : transaction.type === 'Sell'
                ? 'bg-red-100 rounded-l-lg'
                : ''
                }`}>
              {formatTimeAgo(transaction.date)}
            </div>
            <div
              className={`p-2 ${
                transaction.type === 'Buy'
                  ? 'bg-green-100'
                  : transaction.type === 'Sell'
                  ? 'bg-red-100'
                  : ''
              }`}
            >
              {transaction.type}
            </div>
            <div className={`p-2 hidden md:block ${
              transaction.type === 'Buy'
                ? 'bg-green-100'
                : transaction.type === 'Sell'
                ? 'bg-red-100'
                : ''
            }`}>
              {transaction.nativePrice.toFixed(4)}
            </div>
            <div className={`p-2 hidden md:block ${
              transaction.type === 'Buy'
                ? 'bg-green-100'
                : transaction.type === 'Sell'
                ? 'bg-red-100'
                : ''
            }`}>${transaction.usdPrice.toFixed(4)}</div>
            <div className={`p-2 ${
              transaction.type === 'Buy'
                ? 'bg-green-100'
                : transaction.type === 'Sell'
                ? 'bg-red-100'
                : ''
            }`}>
              {transaction.tokenAmount.toFixed(1)} {transaction.tokenSymbol}
            </div>
            <div className={`p-2 ${
              transaction.type === 'Buy'
                ? 'bg-green-100'
                : transaction.type === 'Sell'
                ? 'bg-red-100'
                : ''
            }`}>${transaction.amountInUsd.toFixed(3)}</div>
            <div className={`p-2 ${
              transaction.type === 'Buy'
                ? 'bg-green-100 rounded-r-lg'
                : transaction.type === 'Sell'
                ? 'bg-red-100 rounded-r-lg'
                : ''
            }`}>
              <a
                href={`https://5irescan.io/tx/${transaction.txhash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                Tx
              </a>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TransactionRecords;
