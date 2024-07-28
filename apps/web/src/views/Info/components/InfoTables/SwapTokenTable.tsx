// TODO PCS refactor ternaries
/* eslint-disable no-nested-ternary */
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { ArrowBackIcon, ArrowForwardIcon, Box, Flex, LinkExternal, Radio, Skeleton, Text } from '@pancakeswap/uikit'
import { ITEMS_PER_INFO_TABLE_PAGE } from 'config/constants/info'
import { formatDistanceToNowStrict } from 'date-fns'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useGetChainName } from 'state/info/hooks'
import { Transaction, TransactionType } from 'state/info/types'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { formatAmount } from 'utils/formatInfoNumbers'
import { Arrow, ClickableColumnHeader, PageButtons, TableWrapper } from './shared'

const Wrapper = styled.div`
  width: 100%;
`

export const Break = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  grid-template-columns: 2fr 0.8fr repeat(4, 1fr);
  padding: 0 24px;
  @media screen and (max-width: 940px) {
    grid-template-columns: 2fr repeat(4, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
  }
  @media screen and (max-width: 800px) {
    grid-template-columns: 2fr repeat(2, 1fr);
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
  }
  @media screen and (max-width: 500px) {
    grid-template-columns: 2fr 1fr;
    & > *:nth-child(5) {
      display: none;
    }
    & > *:nth-child(3) {
      display: none;
    }
    & > *:nth-child(4) {
      display: none;
    }
    & > *:nth-child(2) {
      display: none;
    }
  }
`

const RadioGroup = styled(Flex)`
  align-items: center;
  margin-right: 16px;
  margin-top: 8px;
  cursor: pointer;
`

const SORT_FIELD = {
  amountUSD: 'amountUSD',
  timestamp: 'timestamp',
  sender: 'sender',
  amountToken0: 'amountToken0',
  amountToken1: 'amountToken1',
}

const TableLoader: React.FC<React.PropsWithChildren> = () => {
  const loadingRow = (
    <ResponsiveGrid>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </ResponsiveGrid>
  )
  return (
    <>
      {loadingRow}
      {loadingRow}
      {loadingRow}
    </>
  )
}

const DataRow: React.FC<React.PropsWithChildren<{ transaction: Transaction }>> = ({ transaction }) => {
  const { t } = useTranslation()
  const abs0 = Math.abs(transaction.amountToken0)
  const abs1 = Math.abs(transaction.amountToken1)
  const outputTokenSymbol = transaction.amountToken0 < 0 ? transaction.token0Symbol : transaction.token1Symbol
  const inputTokenSymbol = transaction.amountToken1 < 0 ? transaction.token0Symbol : transaction.token1Symbol
  const chainName = useGetChainName()
  return (
    <ResponsiveGrid>
      <LinkExternal
        href={getBlockExploreLink(transaction.hash, 'transaction', chainName === 'CORE' && ChainId.CORE)}
      >
        <Text fontSize="14px">
          {t('Swap %token0%/%token1%', { token0: inputTokenSymbol, token1: outputTokenSymbol })}
        </Text>
      </LinkExternal>
      <Text fontSize="14px">${formatAmount(transaction.amountUSD)}</Text>
      <Text>
        <Text fontSize="14px">{`${formatAmount(abs0)}`}</Text>
      </Text>
      <Text>
        <Text fontSize="14px">{`${formatAmount(abs1)}`}</Text>
      </Text>
      <LinkExternal fontSize="14px" href={getBlockExploreLink(transaction.sender, 'address', chainName === 'CORE' && ChainId.CORE)}>
        {truncateHash(transaction.sender)}
      </LinkExternal>
      <Text fontSize="14px">{formatDistanceToNowStrict(parseInt(transaction.timestamp, 10) * 1000)}</Text>
    </ResponsiveGrid>
  )
}

const SwapTokenTable: React.FC<
  React.PropsWithChildren<{
    transactions: Transaction[]
  }>
> = ({ transactions }) => {
  const [sortField, setSortField] = useState(SORT_FIELD.timestamp)
  const [sortDirection, setSortDirection] = useState<boolean>(true)

  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  const [txFilter, setTxFilter] = useState<TransactionType | undefined>(undefined)

  const sortedTransactions = useMemo(() => {
    const toBeAbsList = [SORT_FIELD.amountToken0, SORT_FIELD.amountToken1]
    return transactions
      ? transactions
          .slice()
          .sort((a, b) => {
            if (a && b) {
              const firstField = a[sortField as keyof Transaction]
              const secondField = b[sortField as keyof Transaction]
              const [first, second] = toBeAbsList.includes(sortField)
                ? [Math.abs(firstField as number), Math.abs(secondField as number)]
                : [firstField, secondField]
              return first > second ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
            }
            return -1
          })
          .filter((x) => {
            return x.type === TransactionType.SWAP
          })
          .slice(ITEMS_PER_INFO_TABLE_PAGE * (page - 1), page * ITEMS_PER_INFO_TABLE_PAGE)
      : []
  }, [transactions, page, sortField, sortDirection])

  // Update maxPage based on amount of items & applied filtering
  useEffect(() => {
    if (transactions) {
      const filteredTransactions = transactions.filter((tx) => {
        return tx.type === TransactionType.SWAP
      })
      if (filteredTransactions.length % ITEMS_PER_INFO_TABLE_PAGE === 0) {
        setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_INFO_TABLE_PAGE))
      } else {
        setMaxPage(Math.floor(filteredTransactions.length / ITEMS_PER_INFO_TABLE_PAGE) + 1)
      }
    }
  }, [transactions])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  return (
    <Wrapper>
      <TableWrapper>
        <ResponsiveGrid>
          <Text color="secondary" fontSize="12px" bold textTransform="uppercase">
            {t('Action')}
          </Text>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amountUSD)}
            textTransform="uppercase"
          >
            {t('Total Value')} {arrow(SORT_FIELD.amountUSD)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amountToken0)}
            textTransform="uppercase"
          >
            {t('Token Amount')} {arrow(SORT_FIELD.amountToken0)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.amountToken1)}
            textTransform="uppercase"
          >
            {t('Token Amount')} {arrow(SORT_FIELD.amountToken1)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.sender)}
            textTransform="uppercase"
          >
            {t('Account')} {arrow(SORT_FIELD.sender)}
          </ClickableColumnHeader>
          <ClickableColumnHeader
            color="secondary"
            fontSize="12px"
            bold
            onClick={() => handleSort(SORT_FIELD.timestamp)}
            textTransform="uppercase"
          >
            {t('Time')} {arrow(SORT_FIELD.timestamp)}
          </ClickableColumnHeader>
        </ResponsiveGrid>
        <Break />

        {transactions ? (
          <>
            {sortedTransactions.map((transaction, index) => {
              if (transaction) {
                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Fragment key={index}>
                    <DataRow transaction={transaction} />
                  </Fragment>
                )
              }
              return null
            })}
            {sortedTransactions.length === 0 ? (
              <Flex justifyContent="center">
                <Text>{t('No Transactions')}</Text>
              </Flex>
            ) : undefined}
            <PageButtons>
              <Arrow
                onClick={() => {
                  setPage(page === 1 ? page : page - 1)
                }}
              >
                <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>

              <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
              <Arrow
                onClick={() => {
                  setPage(page === maxPage ? page : page + 1)
                }}
              >
                <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
              </Arrow>
            </PageButtons>
          </>
        ) : (
          <>
            <TableLoader />
            {/* spacer */}
            <Box />
          </>
        )}
      </TableWrapper>
    </Wrapper>
  )
}

export default SwapTokenTable
