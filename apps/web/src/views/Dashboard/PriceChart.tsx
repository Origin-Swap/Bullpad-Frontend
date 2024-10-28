import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { BACKEND_URL } from 'config/constants/backendApi';

// Definisikan tipe data untuk entri harga
interface PriceEntry {
  time: string;
  price: number;
}

// Definisikan tipe untuk props komponen
interface PriceChartProps {
  token: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ token }) => {
  const [priceData, setPriceData] = useState<PriceEntry[]>([]);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/token-price-history`);
        const hourlyData = response.data;

        // Map data untuk token tertentu dalam bentuk array `PriceEntry`
        const data = Object.keys(hourlyData).map(hour => ({
          time: hour,
          price: hourlyData[hour][token] || 0 // Jika harga tidak ditemukan, set 0
        }));
        setPriceData(data);
      } catch (error) {
        console.error('Error fetching price history:', error);
      }
    };

    fetchPriceHistory();
  }, [token]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={priceData}>
        <XAxis dataKey="time" />
        <YAxis dataKey="price" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
