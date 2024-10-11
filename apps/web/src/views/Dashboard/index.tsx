import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from '@pancakeswap/localization';
import { ChainId } from '@pancakeswap/sdk';
import { FetchStatus } from 'config/constants/types';
import { BACKEND_URL } from 'config/constants/backendApi';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Flex, Box, Heading, Button, Text, PageHeader } from '@pancakeswap/uikit';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useNativeCurrency from 'hooks/useNativeCurrency';
import useTokenBalance, { useGetCakeBalance, useGetUsdtBalance } from 'hooks/useTokenBalance';
import { formatBigNumber } from '@pancakeswap/utils/formatBalance';
import { useBalance } from 'wagmi';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
} from 'recharts';


const Avatar = styled.img`
  border: 0px solid;
`;

const CardImage = styled.img`
  border: 0px;
`;

const DivHeader = styled.div`
  margin: 20px;
  @media screen and (max-width: 480px) {
    margin: 10px;
  }
`;

const Div = styled.div`
  padding: 1px;
`;

const Card = styled.div`
  flex: 1;
  padding: 20px 10px 20px 10px;
  border: 1px solid gray;
  border-radius: 20px;
  margin: 5px;
`;

const CardBody = styled.div`
  display: flex;
  background:  linear-gradient(69deg, #80bdff,#42d9ff,#1addff);
  justify-content: space-between;
  align-items: center;
  padding-top: 25px;
  padding-bottom: 25px;
  border: 2px ;
  border-radius: 20px;
  margin-top: 5px;
  margin-bottom: 12px;
`;

const FlexContainer = styled.div`
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const UserDataComponent: React.FC = () => {
  const { account, chainId } = useActiveWeb3React();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const isBSC = chainId === ChainId.SIRE_TESTNET
  const bnbBalance = useBalance({ addressOrName: account, chainId: ChainId.SIRE_TESTNET })
  const nativeBalance = useBalance({ addressOrName: account, enabled: !isBSC })

  const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useGetCakeBalance()
  const { balance: usdtBalance, fetchStatus: usdtFetchStatus } = useGetUsdtBalance()

  const fetchUserData = useCallback(async (): Promise<void> => {
      if (!account) return;
      try {
        const response = await axios.put(`${BACKEND_URL}/api/users/${account}`, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }, [account]);

    useEffect(() => {
      fetchUserData();
      const intervalId = setInterval(fetchUserData, 5000);
      return () => clearInterval(intervalId);
    }, [fetchUserData]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (userData) {
    if (userData === null) {
      return (
        <PageHeader className="rounded-lg p-4">
          <div className="grid mb-5">
            <Text className="text-black text-center">You have no register yet. Register now...</Text>
            <Button onClick={() => router.push('/register')} className="mt-5">
              Register Now
            </Button>
          </div>
        </PageHeader>
      );
    }
  }

  if (!userData) {
    return (
      <PageHeader className="rounded-lg p-4">
        <div className="grid mb-5">
          <p className="text-black text-center">Trade any token to view the dashboard</p>
        </div>
      </PageHeader>
    );
  }

  const userAccountData = userData;

  const portfolioData = [
      { name: 'Current $ Balance', value: parseFloat(formatBigNumber(bnbBalance.data.value, 2)) || 0 },
      { name: '', value: 0 }, // Jika ada data sebelumnya
      // Anda dapat menambahkan data lebih lanjut sesuai kebutuhan
    ];

  return (
    <DivHeader className="rounded-lg p-2">
      <div className="mb-5">
        <Div className="flex items-center">
          <Avatar src="https://st2.depositphotos.com/2703645/7304/v/450/depositphotos_73040253-stock-illustration-male-avatar-icon.jpg" className="h-10 w-10 mr-2 rounded-full" />
          <Div>
            <p className="text-xs"> Welcome Back</p>
            <p className="text-lg">
              {userAccountData.username
                ? userAccountData.username
                : `${userAccountData.walletAddress.slice(0, 6)}...${userAccountData.walletAddress.slice(-4)}`}
            </p>
          </Div>
        </Div>
        <FlexContainer>
          <Card style={{ flex: 2, paddingTop: "20px" }}>
          <CardBody>
            <div className="ml-4">
              <p className="text-lg text-white">Balance</p>
              <p className="text-2xl md:text-3xl text-white">${formatBigNumber(bnbBalance.data.value, 2)}</p>
            </div>
            <div className="flex justify-center items-center">
              <CardImage src="/images/cardheaddashboard.png" className="h-24 w-24 mr-8" />
            </div>
          </CardBody>
            <Box mt="30px">
              <Flex alignItems="center" justifyContent="space-between" mb="4px" style={{borderBottom: '1px solid gray', paddingBottom: '10px'}}>
              <Flex>
               <Avatar
               src="https://pbs.twimg.com/profile_images/1745156323338301443/5tCj2PYf_400x400.jpg"
               className="h-10 w-10 mr-2 rounded-full"
               />
               <Div>
                <p className="text-lg font-semibold">5IRE</p>
                <p className="text-xs">5ire Chain</p>
               </Div>
               </Flex>
               <Div>
                <p className="text-lg font-semibold">{formatBigNumber(bnbBalance.data.value, 2)}</p>
                <p className="text-xs">$0.000</p>
               </Div>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mb="4px" style={{borderBottom: '1px solid gray', paddingBottom: '10px', paddingTop: '10px'}}>
              <Flex>
               <Avatar src="https://w7.pngwing.com/pngs/840/253/png-transparent-usdt-cryptocurrencies-icon-thumbnail.png" className="h-10 w-10 mr-2 rounded-full" />
               <Div>
                <p className="text-lg font-semibold">USDT</p>
                <p className="text-xs">tether USD</p>
               </Div>
               </Flex>
               <Div>
                <p className="text-lg font-semibold">{formatBigNumber(usdtBalance, 2)}</p>
                <p className="text-xs">$0.000</p>
               </Div>
              </Flex>
              <Flex alignItems="center" justifyContent="space-between" mb="4px" style={{borderBottom: '1px solid gray', paddingBottom: '10px', paddingTop: '10px'}}>
              <Flex>
               <Avatar src="/BullPad.png" className="h-10 w-10 mr-2 rounded-full" />
               <Div>
                <p className="text-lg font-semibold">BULL</p>
                <p className="text-xs">BullPad</p>
               </Div>
               </Flex>
               <Div>
                <p className="text-lg font-semibold">{formatBigNumber(cakeBalance, 2)}</p>
                <p className="text-xs">$0.000</p>
               </Div>
              </Flex>
            </Box>
          </Card>
          <Card style={{ flex: 3 }}>
            <p className="px-4 py-4 border-2 border-black rounded-lg">Portpolio Chart</p>
            {/* <ResponsiveContainer width="100%" height={350}>
              <LineChart data={portfolioData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="name" reversed />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" fill="url(#colorUv)" strokeWidth={2} dot={false} />

                <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} reversed fill="url(#colorUv)" />
              </LineChart>
            </ResponsiveContainer> */}
          </Card>
        </FlexContainer>
        <div className="border rounded-lg py-4">
          <Box mt="3">
            <Heading size="lg">Last 5 Trading Transactions</Heading>
            {userAccountData.lastTransactions && userAccountData.lastTransactions.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mt-4 border border-gray-100" style={{border: '2px solid gray', borderRadius: '10px', padding: '10px'}}>
                {/* Column Headers */}
                <div className="font-semibold" style={{borderRight: '2px solid gray', borderBottom: '2px solid gray', padding: '10px 5px 5px 5px'}}>Sent</div>
                <div className="font-semibold" style={{borderRight: '2px solid gray', borderBottom: '2px solid gray', padding: '10px 5px 5px 5px'}}>Received</div>
                <div className="font-semibold" style={{borderBottom: '2px solid gray', padding: '10px 5px 5px 5px'}}>TX Hash</div>

                {userAccountData.lastTransactions.map((transaction: any) => (
                  <React.Fragment key={transaction.txhash}> {/* Use a unique identifier here */}
                    <p className="text-sm" style={{ borderRight: '1px solid gray', borderBottom: '1px solid gray', padding: '0px 5px 5px 5px' }}>
                      {transaction.amount1} {transaction.fromCurrency}
                    </p>
                    <p className="text-sm" style={{ borderRight: '1px solid gray', borderBottom: '1px solid gray', padding: '0px 5px 5px 5px' }}>
                      {transaction.amount2} {transaction.toCurrency}
                    </p>
                    <p className="text-sm" style={{ borderBottom: '1px solid gray', padding: '0px 5px 5px 5px' }}>
                      <a
                        href={`https://etherscan.io/tx/${transaction.txhash}`} // Ubah URL ini jika Anda menggunakan explorer lain
                        target="_blank" // Membuka di tab baru
                        rel="noopener noreferrer" // Keamanan untuk membuka tautan di tab baru
                        style={{ textDecoration: 'underline', color: 'green' }} // Tambahkan gaya untuk tautan
                      >
                        {`${transaction.txhash.slice(0, 3)}...${userAccountData.walletAddress.slice(-4)}`}
                      </a>
                    </p>
                  </React.Fragment>
                ))}

              </div>
            ) : (
              <Text>No transactions recorded</Text>
            )}
          </Box>
        </div>

      </div>
    </DivHeader>
  );
};

export default UserDataComponent;
