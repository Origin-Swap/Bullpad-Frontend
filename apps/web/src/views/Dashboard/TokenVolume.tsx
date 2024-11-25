import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from 'config/constants/backendApi';

interface VolumeData {
  [key: string]: {
    totalVolume: number;
    volume24h: number;
    txns24h: number;
    lastPrice: number;
  };
}

const VolumePage: React.FC = () => {
  const [priceData, setPriceData] = useState<number | null>(null);
  const [volumes, setVolumes] = useState<VolumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const priceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=5ire&vs_currencies=usd');
        const priceInUSD = priceResponse.data['5ire'].usd;
        setPriceData(priceInUSD);
      } catch (err) {
        console.error('Error fetching price data:', err);
      }
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchVolumes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/volume`);
        setVolumes(response.data);
      } catch (err) {
        console.error('Error fetching volume data:', err);
        setError('Failed to fetch volume data');
      } finally {
        setLoading(false);
      }
    };

    fetchVolumes();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  // Sort by totalVolume
  const sortedVolumes = Object.entries(volumes || {}).sort(([, a], [, b]) => b.totalVolume - a.totalVolume).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto mt-4">
      <h2 className="text-lg font-bold mb-2 mt-6 px-2">Top 10 tokens by volume</h2>
      <div className="grid grid-cols-5 gap-y-2 text-sm text-left p-2 rounded-lg">
        {/* Header */}
        <div className="font-bold">Token</div>
        <div className="font-bold">Price</div>
        <div className="font-bold">24h Txns</div>
        <div className="font-bold">Volume 24h</div>
        <div className="font-bold">Total Volume</div>

        {/* Content */}
        {sortedVolumes.map(([token, { lastPrice, totalVolume, volume24h, txns24h }]) => (
          <React.Fragment key={token}>
            <div className="p-2 bg-green-200 rounded-l-lg">{token}</div>
            <div className="p-2 bg-green-200">
              ${lastPrice !== null && lastPrice !== undefined ? lastPrice.toFixed(5) : 'N/A'}
            </div>
            <div className="p-2 bg-green-200">{txns24h}</div>
            <div className="p-2 bg-green-200">
              ${lastPrice !== null && lastPrice !== undefined ? (volume24h * lastPrice).toFixed(5) : 'N/A'}
            </div>
            <div className="p-2 bg-green-200 rounded-r-lg">
              ${lastPrice !== null && lastPrice !== undefined ? (totalVolume * lastPrice).toFixed(5) : 'N/A'}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default VolumePage;
