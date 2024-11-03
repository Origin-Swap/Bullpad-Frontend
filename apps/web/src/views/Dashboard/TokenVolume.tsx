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
      <h2 className="text-lg font-bold mb-2 mt-6">Top 10 tokens by volume</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left rounded-full" style={{borderRadius: '10px', border: '1px solid gray'}}>
          <thead>
            <tr>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold" style={{border: '1px solid gray'}}>Token</th>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold" style={{border: '1px solid gray'}}>Price</th>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold" style={{border: '1px solid gray'}}>24h Txns</th>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold" style={{border: '1px solid gray'}}>Volume 24h</th>
              <th className="md:px-4 md:text-md text-sm px-2 py-2 font-bold" style={{border: '1px solid gray'}}>Total Volume</th>
            </tr>
          </thead>
          <tbody>
            {sortedVolumes.map(([token, { lastPrice, totalVolume, volume24h, txns24h }]) => (
              <tr key={token}>
                <td className="md:px-4 md:text-sm text-xs px-2 py-2" style={{ border: '1px solid gray' }}>{token}</td>
                <td className="md:px-4 md:text-sm text-xs px-2 py-2" style={{ border: '1px solid gray' }}>
                  ${lastPrice !== null && lastPrice !== undefined ? lastPrice.toFixed(5) : 'N/A'}
                </td>
                <td className="md:px-4 md:text-sm text-xs px-2 py-2" style={{ border: '1px solid gray' }}>{txns24h}</td>
                <td className="md:px-4 md:text-sm text-xs px-2 py-2" style={{ border: '1px solid gray' }}>
                  ${lastPrice !== null && lastPrice !== undefined ? (volume24h * lastPrice).toFixed(5) : 'N/A'}
                </td>
                <td className="md:px-4 md:text-sm text-xs px-2 py-2" style={{ border: '1px solid gray' }}>
                  ${lastPrice !== null && lastPrice !== undefined ? (totalVolume * lastPrice).toFixed(5) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolumePage;
