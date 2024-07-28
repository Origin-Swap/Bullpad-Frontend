import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import {
  checkIsStableSwap,
  getMultiChainQueryEndPointWithStableSwap,
  MultiChainName,
  multiChainTokenBlackList,
} from '../../constant'
import { useGetChainName } from '../../hooks'

interface TopPoolsResponse {
  pairDayDatas: {
    id: string
  }[]
}

/**
 * Initial pools to display on the home page
 */
const fetchTopPools = async (chainName: MultiChainName, timestamp24hAgo: number): Promise<string[]> => {
  const isStableSwap = checkIsStableSwap()
  const firstCount = isStableSwap ? 100 : 30
  let whereCondition =
    chainName === 'ETH'
      ? `where: { dailyTxns_gt: 300, date_gt: ${timestamp24hAgo} }`
      : `where: { date_gt: ${timestamp24hAgo}, dailyVolumeUSD_gt: 2000 }`
  if (isStableSwap) whereCondition = ''
  try {
    const query = gql`
      query topPools {
        pairDayDatas(
          first: ${firstCount}
          orderBy: dailyVolumeUSD
          orderDirection: desc
        ) {
          id
        }
      }
    `
    console.log('Sending query with', { chainName, timestamp24hAgo, whereCondition })
    const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<TopPoolsResponse>(query, {
      blacklist: multiChainTokenBlackList[chainName],
    })
    // console.log('Fetched data:', data)
    return data.pairDayDatas.map((p) => p.id.split('-')[0])
  } catch (error) {
    console.error('Failed to fetch top pools', error)
    return []
  }
}

/**
 * Fetch top addresses by volume
 */
const useTopPoolAddresses = (): string[] => {
  const [topPoolAddresses, setTopPoolAddresses] = useState([])
  // console.log('Initial topPoolAddresses:', topPoolAddresses)
  const [timestamp24hAgo] = getDeltaTimestamps()
  const chainName = useGetChainName()

  useEffect(() => {
    const fetch = async () => {
      // console.log('Fetching top pools for', chainName, timestamp24hAgo)
      const addresses = await fetchTopPools(chainName, timestamp24hAgo)
      // console.log('Fetched pool addresses:', addresses)
      setTopPoolAddresses(addresses)
    }
    if (topPoolAddresses.length === 0) {
      fetch()
    }
  }, [topPoolAddresses, timestamp24hAgo, chainName])

  // console.log('Final topPoolAddresses:', topPoolAddresses)
  return topPoolAddresses
}

export const fetchTopPoolAddresses = async (chainName: MultiChainName) => {
  const [timestamp24hAgo] = getDeltaTimestamps()

  const addresses = await fetchTopPools(chainName, timestamp24hAgo)
  return addresses
}

export default useTopPoolAddresses
