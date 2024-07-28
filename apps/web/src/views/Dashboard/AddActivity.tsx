import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {
  Flex,
  Text,
  Skeleton,
  ArrowBackIcon,
  ArrowForwardIcon,
} from '@pancakeswap/uikit';
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info';
import { useTranslation } from '@pancakeswap/localization';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`;

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 20px 2.5fr repeat(3, 1fr);
  padding: 0 24px;
  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 1 repeat(3, 1fr);
    & :nth-child(4),
    & :nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 20px 1.5fr repeat(3, 1fr);
    & :nth-child(4),
    & :nth-child(5),
    & :nth-child(6),
    & :nth-child(7) {
      display: none;
    }
  }
  @media screen and (max-width: 480px) {
    grid-template-columns: 1fr repeat(2, 1fr);
    > *:nth-child(1) {
      display: none;
    }
  }
`;

export const TableWrapper = styled(Flex)`
  width: 100%;
  padding-top: 16px;
  flex-direction: column;
  gap: 16px;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii[0]};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: ${({ theme }) => theme.radii.card};
  }
`;

export const ClickableColumnHeader = styled(Text)`
  cursor: pointer;
`;

export const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`;

const LoadingRow: React.FC = () => (
  <ResponsiveGrid>
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </ResponsiveGrid>
);

const TableLoader: React.FC = () => (
  <>
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </>
);

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

interface UserResponse {
  [account: string]: {
    adds: Add[];
  };
}

const DataRow = ({ add, index }: { add: Add; index: number }) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <ResponsiveGrid>
      <Text>{index + 1}</Text>
      <Text>{formatDate(add.timestamp)}</Text>
      <Text>{add.amountA.toFixed(4)} {add.currencyA}</Text>
      <Text>{add.amountB.toFixed(4)} {add.currencyB}</Text>
      <Text>{add.status}</Text>
    </ResponsiveGrid>
  );
};

const UserDataComponent: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const [adds, setAdds] = useState<Add[]>([]);
  const [sortDirection, setSortDirection] = useState<boolean>(true);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    let extraPages = 1;
    if (adds.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
      extraPages = 0;
    }
    setMaxPage(Math.floor(adds.length / ITEMS_PER_INFO_TABLE_PAGE) + extraPages);
  }, [adds]);

  const sortedPools = useMemo(() => {
    return adds
      ? adds
          .sort((a, b) => {
            if (a && b) {
              return a[sortField as keyof Add] > b[sortField as keyof Add]
                ? (sortDirection ? -1 : 1) * 1
                : (sortDirection ? -1 : 1) * -1;
            }
            return -1;
          })
          .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : [];
  }, [page, adds, sortDirection, sortField]);

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField);
      setSortDirection(sortField !== newField ? true : !sortDirection);
    },
    [sortDirection, sortField]
  );

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓';
      return sortField === field ? directionArrow : '';
    },
    [sortDirection, sortField]
  );

  const maxItemsPerPage = 3;
  const API_BASE_URL = 'https://swapback.vercel.app';

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/adds/user-Add`);
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
        setUserData(data.userAddData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
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

  const startIndex = (page - 1) * maxItemsPerPage;
  const endIndex = startIndex + maxItemsPerPage;

  const userAccountData = userData?.[account] || { adds: [] };
  const sortedAdds = userAccountData.adds.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <TableWrapper mt="10px">
      <Text color="secondary" fontSize="18px" bold textAlign="center" style={{ borderBottom: "2px solid blue", padding: '5px' }}>
        Add Liquidity History
      </Text>
      <ResponsiveGrid style={{ background: 'white' }}>
        <Text color="secondary" fontSize="12px" bold>#</Text>
        <ClickableColumnHeader color="secondary" fontSize="12px" bold textTransform="uppercase" onClick={() => handleSort('timestamp')}>
          {t('Time')} {arrow('timestamp')}
        </ClickableColumnHeader>
        <ClickableColumnHeader color="secondary" fontSize="12px" bold textTransform="uppercase" onClick={() => handleSort('amountA')}>
          {t('Token Amount')} {arrow('amountA')}
        </ClickableColumnHeader>
        <ClickableColumnHeader color="secondary" fontSize="12px" bold textTransform="uppercase" onClick={() => handleSort('amountB')}>
          {t('Token Amount')} {arrow('amountB')}
        </ClickableColumnHeader>
        <ClickableColumnHeader color="secondary" fontSize="12px" bold textTransform="uppercase" onClick={() => handleSort('status')}>
          {t('Type')} {arrow('status')}
        </ClickableColumnHeader>
      </ResponsiveGrid>
      {sortedAdds.slice(startIndex, endIndex).map((add, i) => (
        <Fragment key={add._id}>
          <DataRow index={startIndex + i} add={add} />
        </Fragment>
      ))}
      <PageButtons>
        <Arrow
          onClick={() => {
            setPage(page === 1 ? page : page - 1);
          }}
        >
          <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
        </Arrow>
        <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
        <Arrow
          onClick={() => {
            setPage(page === maxPage ? page : page + 1);
          }}
        >
          <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
        </Arrow>
      </PageButtons>
    </TableWrapper>
  );
};

export default UserDataComponent;
