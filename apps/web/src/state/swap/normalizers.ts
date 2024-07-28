import { fromUnixTime } from 'date-fns'
import fromPairs from 'lodash/fromPairs'
import { PairDayDatasResponse, PairHoursDatasResponse } from './fetch/types'
import { DerivedPairDataNormalized, PairDataNormalized, PairDataTimeWindowEnum, PairPricesNormalized } from './types'

export const normalizeChartData = (
  data: PairHoursDatasResponse | PairDayDatasResponse | null,
  token0Address: string,
  token1Address: string,
  timeWindow: PairDataTimeWindowEnum,
) => {
  switch (timeWindow) {
    case PairDataTimeWindowEnum.DAY:
    case PairDataTimeWindowEnum.WEEK:
      return (data as PairHoursDatasResponse)?.pairHourDatas?.map((fetchPairEntry) => ({
        time: fetchPairEntry.hourStartUnix,
        token0Id: token0Address,
        token1Id: token1Address,
        reserve0: parseFloat(fetchPairEntry.reserve0),
        reserve1: parseFloat(fetchPairEntry.reserve1),
      }))
    case PairDataTimeWindowEnum.MONTH:
    case PairDataTimeWindowEnum.YEAR:
      return (data as PairDayDatasResponse)?.pairDayDatas?.map((fetchPairEntry) => ({
        time: fetchPairEntry.date,
        token0Id: token0Address,
        token1Id: token1Address,
        reserve0: parseFloat(fetchPairEntry.reserve0),
        reserve1: parseFloat(fetchPairEntry.reserve1),
      }))
    default:
      return null
  }
}

export const normalizeDerivedChartData = (data: any) => {
  if (!data?.token0DerivedEth || data?.token0DerivedEth.length === 0) {
    return []
  }

  const token1DerivedEthEntryMap: any = fromPairs(
    data?.token1DerivedEth?.map((entry) => [entry.timestamp, entry]) ?? [],
  )

  return data?.token0DerivedEth.reduce((acc, token0DerivedEthEntry) => {
    const token1DerivedEthEntry = token1DerivedEthEntryMap[token0DerivedEthEntry.timestamp]
    if (token1DerivedEthEntry) {
      acc.push({
        time: parseInt(token0DerivedEthEntry.timestamp, 10),
        token0Id: token0DerivedEthEntry.tokenAddress,
        token1Id: token1DerivedEthEntry.tokenAddress,
        token0DerivedETH: token0DerivedEthEntry.derivedETH,
        token1DerivedETH: token1DerivedEthEntry.derivedETH,
      })
    }
    return acc
  }, [])
}

type normalizePairDataByActiveTokenParams = {
  pairData: PairDataNormalized
  activeToken: string
}

export const normalizePairDataByActiveToken = ({
  pairData,
  activeToken,
}: normalizePairDataByActiveTokenParams): PairPricesNormalized =>
  pairData
    ?.map((pairPrice) => ({
      time: fromUnixTime(pairPrice.time),
      value:
        activeToken === pairPrice?.token0Id
          ? pairPrice.reserve1 / pairPrice.reserve0
          : pairPrice.reserve0 / pairPrice.reserve1,
    }))
    .reverse()

type normalizeDerivedPairDataByActiveTokenParams = {
  pairData: DerivedPairDataNormalized
  activeToken: string
}

export const normalizeDerivedPairDataByActiveToken = ({
  pairData,
  activeToken,
}: normalizeDerivedPairDataByActiveTokenParams): PairPricesNormalized =>
  pairData?.map((pairPrice) => ({
    time: fromUnixTime(pairPrice.time),
    value:
      activeToken === pairPrice?.token0Id
        ? pairPrice.token0DerivedETH / pairPrice.token1DerivedETH
        : pairPrice.token1DerivedETH/ pairPrice.token0DerivedETH,
  }))
