import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChainId, WNATIVE } from '@pancakeswap/sdk'
import styled from 'styled-components';
import {
  Flex,
  Box,
  Heading,
  IconButton,
  CardBody,
  Button,
  Text,
  CopyAddress,
  Skeleton,
  PageHeader,
  NextLinkFromReactRouter,
  Grid,
} from '@pancakeswap/uikit';
import useTokenBalance, { useGetCakeBalance } from 'hooks/useTokenBalance'
import { formatBigNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { useBalance } from 'wagmi'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import Activity from './Activity'
import AddActivity from './AddActivity'
import Page from '../Page';
import ClaimReward from './DailyReward'

const StyledSwapContainer = styled(Flex)`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 40px;
  }
`;

const StyledInputCurrencyWrapper = styled(Box)`
  width: 60px;
`;

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`;

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

const FarmH1 = styled(Heading)`
  font-size: 16px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
    margin-bottom: 24px;
  }
`
const FarmH2 = styled(Heading)`
  font-size: 16px;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 24px;
    margin-bottom: 18px;
  }
`

const FarmFlexWrapper = styled(Flex)`
  flex-wrap: wrap;
  margin-bottom: 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-wrap: nowrap;
  }
`

const Wrapper = styled.div`
  display: grid;
  margin-bottom: 20px;
  grid-template-columns: auto;
  ${({ theme }) => theme.mediaQueries.md} {
    display: grid;
  column-gap: 10px;
  grid-template-columns: auto auto;
  }
`

const Wrapper2 = styled.div`
  display: grid;
  margin-bottom: 20px;
  grid-template-columns: auto;
  ${({ theme }) => theme.mediaQueries.md} {
    display: grid;
  column-gap: 10px;
  grid-template-columns: 25% 75%;
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

interface UserResponse {
  [account: string]: UserData;
}

const UserDataComponent: React.FC = () => {
  const { t } = useTranslation();
  const { account, chainId, chain } = useActiveWeb3React()
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const maxItemsPerPage = 10;
  const isBSC = chainId === ChainId.CORE
  const native = useNativeCurrency()
  const nativeBalance = useBalance({ addressOrName: account, enabled: !isBSC })
  const { balance: cakeBalance, fetchStatus: cakeFetchStatus } = useGetCakeBalance()

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User data not found for {account}</div>;
  }
  // Filter data untuk pengguna yang sedang aktif
  const userAccountData = userData[account];

  return (
    <PageHeader borderRadius="10px">
      <FarmFlexWrapper
      display="flex"
      justifyContent="space-between"
      style={{
        padding: '10px',
        border: '2px solid #80e1e6',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <Box>
          <Text color="black" fontSize="32px">
            {t('DashBoard')}
          </Text>
          <Text color="black" mb="10px" textAlign="center">
            {account}
          </Text>
        </Box>
        <Flex alignItems="center">
        <Box style={{border: '1px solid #80e1e6', marginRight:'20px' , padding: '10px 20px 10px 20px', borderRadius: '10px'}}>
        <Text color="textSubtle">
          {native.symbol} {t('Balance')}
        </Text>
        {!nativeBalance.isFetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text fontSize="24px">{formatBigNumber(nativeBalance.data.value, 3)} {native.symbol}</Text>
        )}
        </Box>
        <Box style={{border: '1px solid #80e1e6', padding: '10px 20px 10px 20px', borderRadius: '10px'}}>
        <Text color="textSubtle">{t('BULL Balance')}</Text>
        {cakeFetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text fontSize="24px">{formatBigNumber(cakeBalance, 3)} BULL</Text>
        )}
        </Box>
        </Flex>
      </FarmFlexWrapper>
      <Wrapper>
      <ClaimReward />
      {userAccountData && (
        <Flex style={{alignItems: 'center', justifyContent: 'center', border: '2px solid #80e1e6', borderRadius: '10px', margin: '5px', boxShadow: '2px 2px 4px 2px #919191', padding: '10px'}}>
          <Text style={{ paddingRight: '20px', marginTop: '5px', color: 'black' }}>
            Trading Reward
          </Text>
          <Button
            style={{
              border: '2px solid #80e1e6',
              borderRadius: '10px',
              boxShadow: '2px 2px 4px 2px #919191',
              fontSize: '16px'
            }}
            disabled
          >
            Claim {userAccountData.totalBull} BULL
          </Button>
        </Flex>
      )}
      </Wrapper>

      <Wrapper>

        <Box
          style={{
            background: 'white',
            border: '2px solid #80e1e6',
            padding: '10px 20px',
            borderRadius: '10px',
            margin: '5px',
            boxShadow: '2px 2px 4px 2px #919191',
          }}
        >
          <Text style={{ padding: '5px' }}>TRADE</Text>
          <Text style={{ padding: '5px' }}>+ Earn 2 BULL for every 1 CORE you Swap</Text>
          <Text style={{ padding: '5px' }}>+ Earn 2 BULL for every 5 VANRY you Swap</Text>
          <NextLinkFromReactRouter to="/swap">
            <Button marginTop="24px">{t('Launch Swap')}</Button>
          </NextLinkFromReactRouter>
        </Box>
        <Box
          style={{
            background: 'white',
            border: '2px solid #80e1e6',
            padding: '10px 20px',
            borderRadius: '10px',
            margin: '5px',
            boxShadow: '2px 2px 4px 2px #919191',
          }}
        >
          <Text style={{ padding: '5px' }}>ADD LIQUIDITY</Text>
          <Text style={{ padding: '5px' }}>+ Earn 2 BULL for every 1 CORE you Add</Text>
          <Text style={{ padding: '5px' }}>+ Earn 2 BULL for every 5 VANRY you Add</Text>
          <NextLinkFromReactRouter to="/add">
            <Button marginTop="24px">{t('Add Liquidity')}</Button>
          </NextLinkFromReactRouter>
        </Box>
      </Wrapper>
        {/* {userAccountData && (
          <Box
            style={{
              background: 'white',
              border: '2px solid #80e1e6',
              padding: '10px 20px',
              borderRadius: '10px',
              marginTop: '5px',
              boxShadow: '2px 2px 4px 2px #919191',
            }}
          >
            <Text style={{ padding: '10px', marginTop: '5px', color: 'black' }}>
              Trading Reward
            </Text>
            <Text style={{ padding: '0 10px', fontSize: '24px', color: 'blue' }}>
              {userAccountData.totalBull} BULL
            </Text>
            <Button
              type="button"
              color="primary"
              style={{
                border: '2px solid #80e1e6',
                padding: '10px 20px',
                borderRadius: '10px',
                margin: '5px',
                boxShadow: '2px 2px 4px 2px #919191',
              }}
              disabled
            >
              Claim Reward
            </Button>
          </Box>
        )} */}
        <Activity />
      <AddActivity />
    </PageHeader>
  );
};


export default UserDataComponent;
