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
    <div className="grid grid-cols-2 gap-2">

        <div className="flex justify-between mb-2 p-2 bg-gray-100 rounded-lg" style={{border: '2px solid gray'}}>
         <div>
          <p className="text-xl font-bold">5IRE</p>
          <p>${price5ire.toFixed(5)}</p>
        </div>
        <img
        src="https://pbs.twimg.com/profile_images/1745156323338301443/5tCj2PYf_400x400.jpg"
        alt="sire"
        className="h-10 w-10 mr-2 rounded-full"
        />
        </div>

      {lastPricePerBullIn5ire !== null && lastPricePer5ireInBull !== null ? (
        <div className="flex justify-between mb-2 p-2 bg-gray-100 rounded-lg" style={{border: '2px solid gray'}}>
         <div>
          <p className="text-xl font-bold">BULL</p>
          <p>${pricePerBullInUSD.toFixed(5)}</p>
        </div>
        <img
        src="/BullPad.png"
        alt="sire"
        className="h-10 w-10 mr-2 rounded-full"
        />
        </div>
      ) : (
        <p>Loading harga terakhir...</p>
      )}
    </div>
  );
};

export default PricePage;
