import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { Block, ProtocolData } from 'state/info/types'
import { getChangeForPeriod } from 'utils/getChangeForPeriod'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getPercentChange } from 'views/Info/utils/infoDataHelpers'
import { checkIsStableSwap, getMultiChainQueryEndPointWithStableSwap, MultiChainName } from '../../constant'
import { useGetChainName } from '../../hooks'

interface UniswapFactory {
  txCount: string
  totalVolumeUSD: string
  totalLiquidityUSD: string
}

interface OverviewResponse {
  uniswapFactories: UniswapFactory[]
  factories?: UniswapFactory[]
}
/**
 * Latest Liquidity, Volume and Transaction count
 */
const getOverviewData = async (
  chainName: MultiChainName,
  block?: number,
): Promise<{ data?: OverviewResponse; error: boolean }> => {
  const factoryString = checkIsStableSwap() ? `factories` : `uniswapFactories`
  try {
    const query = gql`query overview {
      ${factoryString}(
        ${block ? `block: { number: ${block}}` : ``}
        first: 1) {
        txCount
        totalVolumeUSD
        totalLiquidityUSD
      }
    }`
    const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<OverviewResponse>(query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch info overview', error)
    return { data: null, error: true }
  }
}

const formatUniswapFactoryResponse = (rawUniswapFactory?: UniswapFactory) => {
  if (rawUniswapFactory) {
    return {
      txCount: parseFloat(rawUniswapFactory.txCount),
      totalVolumeUSD: parseFloat(rawUniswapFactory.totalVolumeUSD),
      totalLiquidityUSD: parseFloat(rawUniswapFactory.totalLiquidityUSD),
    }
  }
  return null
}

interface ProtocolFetchState {
  error: boolean
  data?: ProtocolData
}

const useFetchProtocolData = (): ProtocolFetchState => {
  const [fetchState, setFetchState] = useState<ProtocolFetchState>({
    error: false,
  })
  const [t24, t48] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48])
  const [block24, block48] = blocks ?? []
  const chainName = useGetChainName()

  useEffect(() => {
    const fetchData = async () => {
      const [{ error, data }, { error: error24, data: data24 }, { error: error48, data: data48 }] = await Promise.all([
        getOverviewData(chainName),
        getOverviewData(chainName, block24?.number ?? undefined),
        getOverviewData(chainName, block48?.number ?? undefined),
      ])
      const anyError = error || error24 || error48
      const overviewData = formatUniswapFactoryResponse(data?.uniswapFactories?.[0])
      const overviewData24 = formatUniswapFactoryResponse(data24?.uniswapFactories?.[0])
      const overviewData48 = formatUniswapFactoryResponse(data48?.uniswapFactories?.[0])
      const allDataAvailable = overviewData && overviewData24 && overviewData48
      if (anyError || !allDataAvailable) {
        setFetchState({
          error: true,
        })
      } else {
        const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
          overviewData.totalVolumeUSD,
          overviewData24.totalVolumeUSD,
          overviewData48.totalVolumeUSD,
        )
        const liquidityUSDChange = getPercentChange(overviewData.totalLiquidityUSD, overviewData24.totalLiquidityUSD)
        // 24H transactions
        const [txCount, txCountChange] = getChangeForPeriod(
          overviewData.txCount,
          overviewData24.txCount,
          overviewData48.txCount,
        )
        const protocolData: ProtocolData = {
          volumeUSD,
          volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
          liquidityUSD: overviewData.totalLiquidityUSD,
          liquidityUSDChange,
          txCount,
          txCountChange,
        }
        setFetchState({
          error: false,
          data: protocolData,
        })
      }
    }

    const allBlocksAvailable = block24?.number && block48?.number
    if (allBlocksAvailable && !blockError && !fetchState.data) {
      fetchData()
    }
  }, [block24, block48, blockError, fetchState, chainName])

  return fetchState
}

export const fetchProtocolData = async (chainName: MultiChainName, block24: Block, block48: Block) => {
  const [{ data }, { data: data24 }, { data: data48 }] = await Promise.all([
    getOverviewData(chainName),
    getOverviewData(chainName, block24?.number ?? undefined),
    getOverviewData(chainName, block48?.number ?? undefined),
  ])
  if (data.factories && data.factories.length > 0) data.uniswapFactories = data.factories
  if (data24.factories && data24.factories.length > 0) data24.uniswapFactories = data24.factories
  if (data48.factories && data48.factories.length > 0) data48.uniswapFactories = data48.factories

  // const anyError = error || error24 || error48
  const overviewData = formatUniswapFactoryResponse(data?.uniswapFactories?.[0])
  const overviewData24 = formatUniswapFactoryResponse(data24?.uniswapFactories?.[0])
  const overviewData48 = formatUniswapFactoryResponse(data48?.uniswapFactories?.[0])
  // const allDataAvailable = overviewData && overviewData24 && overviewData48

  const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
    overviewData.totalVolumeUSD,
    overviewData24.totalVolumeUSD,
    overviewData48.totalVolumeUSD,
  )
  const liquidityUSDChange = getPercentChange(overviewData.totalLiquidityUSD, overviewData24.totalLiquidityUSD)
  // 24H transactions
  const [txCount, txCountChange] = getChangeForPeriod(
    overviewData.txCount,
    overviewData24.txCount,
    overviewData48.txCount,
  )
  const protocolData: ProtocolData = {
    volumeUSD,
    volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
    liquidityUSD: overviewData.totalLiquidityUSD,
    liquidityUSDChange,
    txCount,
    txCountChange,
  }
  return protocolData
}

export default useFetchProtocolData
