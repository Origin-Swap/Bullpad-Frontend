import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from 'config/constants/backendApi';

const PricePage: React.FC = () => {
  const [lastPricePerBullIn5ire, setLastPricePerBullIn5ire] = useState<number | null>(null);
  const [lastPricePer5ireInBull, setLastPricePer5ireInBull] = useState<number | null>(null);
  const [previousPricePer5ireInBull, setPreviousPricePer5ireInBull] = useState<number | null>(null);
  const [priceChangePercentage, setPriceChangePercentage] = useState<number | null>(null);
  const [price5ire, setPrice5ire] = useState<number | null>(null);
  const [pricePerBullInUSD, setPricePerBullInUSD] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Ambil harga 5ire dari CoinGecko
        const priceResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=5ire&vs_currencies=usd');
        const priceInUSD = priceResponse.data['5ire'].usd;
        setPrice5ire(priceInUSD);

        // Ambil harga terakhir dari backend
        const lastPriceResponse = await axios.get(`${BACKEND_URL}/api/price-5ire-bull-latest`);
        setLastPricePerBullIn5ire(lastPriceResponse.data.pricePerBullIn5ire);
        setLastPricePer5ireInBull(lastPriceResponse.data.pricePer5ireInBull);
        setPreviousPricePer5ireInBull(lastPriceResponse.data.previousPricePer5ireInBull);

        // Hitung harga Bull dalam USD
        const bullPriceInUSD = priceInUSD * lastPriceResponse.data.pricePerBullIn5ire;
        setPricePerBullInUSD(bullPriceInUSD);

        // Hitung persentase perubahan harga
        const changePercentage = lastPriceResponse.data.priceChangePercentage;
        setPriceChangePercentage(changePercentage);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch price or volume data');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Harga Token Terakhir 5ire dan Bull</h1>

      {lastPricePerBullIn5ire !== null && lastPricePer5ireInBull !== null ? (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <p>Harga Terakhir 1 Bull = {lastPricePerBullIn5ire} 5ire</p>
          <p>Harga Terakhir 1 5ire = {lastPricePer5ireInBull} Bull</p>
          <p>Harga 5ire dalam USD = {price5ire}</p>
          <p>Harga Bull dalam USD = {pricePerBullInUSD}</p>
          <p>Harga 5ire Sebelumnya = {previousPricePer5ireInBull} Bull</p>
          {priceChangePercentage !== null && (
            <p>
              Perubahan Harga: {priceChangePercentage.toFixed(2)}% {priceChangePercentage > 0 ? '↑' : '↓'}
            </p>
          )}
        </div>
      ) : (
        <p>Loading harga terakhir...</p>
      )}
    </div>
  );
};

export default PricePage;
