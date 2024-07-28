import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {
  Flex,
  Box,
  IconButton,
  CardBody,
  Text,
  CopyAddress,
} from '@pancakeswap/uikit';
import { useTranslation } from '@pancakeswap/localization';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import Page from '../Page';

const StyledSwapContainer = styled(Flex)`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 40px;
  }
`;

const StyledInputCurrencyWrapper = styled(Box)`
  width: 400px;
`;

const Wrapper = styled.div`
  padding-top: 10px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 24px;
    box-sizing: border-box;
    background: ${({ theme }) => (theme.isDark ? 'rgba(39, 38, 44, 0.5)' : 'rgba(255, 255, 255, 0.5)')};
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    border-radius: 10px;
  }
`
const HotTokenListContainer = styled.div`

  @media (min-width: 768px) {
    // Untuk desktop, tampilkan di samping
    display: flex;
    flex-direction: row;
  }

  @media (max-width: 767px) {
    // Untuk mobile, tampilkan di bawah
    display: flex;
    flex-direction: column;
  }
`

interface Swap {
  _id: string;
  chainId: number;
  userAddress: string;
  fromCurrency: string;
  toCurrency: string;
  amount1: number;
  amount2: number;
  txhash: string;
  status: string;
  price: number;
  timestamp: string; // Assuming timestamp is a string for formatting
}

interface UserData {
  totalCore: number;
  totalVanry: number;
  totalBull: number;
  swaps: Swap[];
}

interface Add {
  _id: string;
  chainId: number;
  account: string;
  currencyA: string;
  currencyB: string;
  amountA: number;
  amountB: number;
  status: string;
  timestamp: string;
}

interface Remove {
  _id: string;
  chainId: number;
  account: string;
  currencyA: string;
  currencyB: string;
  amountA: number;
  amountB: number;
  status: string;
  timestamp: string;
}


interface UserResponse {
  [account: string]: UserData;
}

const UserDataComponent: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const [adds, setAdds] = useState<Add[]>([]);
  const [removes, setRemoves] = useState<Remove[]>([]);
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const maxItemsPerPage = 3;

  const explorers = {
    1116: 'https://scan.coredao.org/tx/',
    2040: 'https://explorer.vanarchain.com/tx/',
  };

  const API_BASE_URL = 'https://swapback.vercel.app'; // Replace with your API base URL
  // const API_BASE_URL = 'http://localhost:5000';

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/swaps/user-data`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data.userData);
      } catch (error) {
        console.error('Failed to fetch total CORE amount:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
    const intervalId = setInterval(getUserData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchAdds = async () => {
      try {
        const response = await axios.get<{ userAddData: { [account: string]: { adds: Add[] } } }>(`${API_BASE_URL}/api/adds/user-Add`);
        const userAddData = response.data.userAddData;

        if (userAddData && userAddData[account] && Array.isArray(userAddData[account].adds)) {
          const fetchedAdds = userAddData[account].adds;
          const sortedAdds = fetchedAdds.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          setAdds(sortedAdds);
          setMaxPage(Math.ceil(sortedAdds.length / maxItemsPerPage));
        } else {
          console.error('Fetched adds is not an array:', userAddData);
        }
      } catch (error) {
        console.error('Failed to fetch adds:', error);
      }
    };

    fetchAdds();

    const intervalId = setInterval(fetchAdds, 5000);

    return () => clearInterval(intervalId);
  }, [account]); // Menambahkan account sebagai dependency agar diperbarui saat account berubah


  useEffect(() => {
    const fetchRemoves = async () => {
      try {
        const response = await axios.get<{ userRemoveData: { [account: string]: { removes: Remove[] } } }>(`${API_BASE_URL}/api/removes/user-Remove`);
        const userRemoveData = response.data.userRemoveData;

        if (userRemoveData && userRemoveData[account] && Array.isArray(userRemoveData[account].removes)) {
          const fetchedRemoves = userRemoveData[account].removes;
          const sortedRemoves = fetchedRemoves.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

          setRemoves(sortedRemoves);
          setMaxPage(Math.ceil(sortedRemoves.length / maxItemsPerPage));
        } else {
          console.error('Fetched removes is not an array:', userRemoveData);
        }
      } catch (error) {
        console.error('Failed to fetch removes:', error);
      }
    };

    fetchRemoves();

    const intervalId = setInterval(fetchRemoves, 5000);

    return () => clearInterval(intervalId);
  }, [account]); // Menambahkan account sebagai dependency agar diperbarui saat account berubah


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User data not found for {account}</div>;
  }

  const formatAddress = (address: string) => {
    return `0x${address.slice(2, 6)}...${address.slice(-4)}`;
  };

  const formatTxHash = (txhash: string | undefined) => {
    if (!txhash) {
      return '';
    }
    return `${txhash.slice(0, 6)}...${txhash.slice(-4)}`;
  };

  const getExplorerLink = (chainId: number, txhash: string) => {
    const baseUrl = explorers[chainId];
    return baseUrl ? `${baseUrl}${txhash}` : '';
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const startIndex = (page - 1) * maxItemsPerPage;
  const endIndex = startIndex + maxItemsPerPage;

  // Filter data untuk pengguna yang sedang aktif
  const userAccountData = userData[account];
  const sortedSwaps = userAccountData?.swaps.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ) || [];

  return (

  <Wrapper style={{ boxShadow: '2px 2px 4px 2px black', margin: '10px'}}>
    <div style={{ maxWidth: '100%', margin: '0 auto', textAlign: 'center'}}>
      <div style={{ margin: '10px', textAlign: 'center' }}>
         <p>Your Add & Remove Liquidity Activity</p>
      </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Time</th>
              <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Token A</th>
              <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Token B</th>
              <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {adds.slice(startIndex, endIndex).map((add) => {
              return (
                <tr key={add._id}>
                  <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>{formatDate(add.timestamp)}</td>

                  <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                    {`${Number(add.amountA).toFixed(4)} ${add.currencyA}`}
                  </td>
                  <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                    {`${Number(add.amountB).toFixed(4)} ${add.currencyB}`}
                  </td>
                  <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                    {`${add.status}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Time</th>
              <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Token A</th>
              <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Token B</th>
              <th style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '14px' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {removes.slice(startIndex, endIndex).map((remove) => {
              return (
                <tr key={remove._id}>
                  <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>{formatDate(remove.timestamp)}</td>

                  <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                    {`${Number(remove.amountA).toFixed(4)} ${remove.currencyA}`}
                  </td>
                  <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                    {`${Number(remove.amountB).toFixed(4)} ${remove.currencyB}`}
                  </td>
                  <td style={{ border: '1px solid #ccc', boxShadow: '0px 0px 1px 1px #3ce3f3', padding: '10px', fontSize: '12px' }}>
                    {`${remove.status}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            style={{
              padding: '0 10px',
              background: '#e7f4ff',
              borderRadius: '5px',
              border: '1px solid green',
            }}
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            ←
          </button>
          <span style={{ margin: '0 10px' }}>Page {page}</span>
          <button
            style={{
              padding: '0 10px',
              background: '#e7f4ff',
              borderRadius: '5px',
              border: '1px solid green',
            }}
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={endIndex >= sortedSwaps.length}
          >
            →
          </button>
          </div>
    </div>
    </Wrapper>
  );
};

export default UserDataComponent;
