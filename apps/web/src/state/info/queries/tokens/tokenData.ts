/* eslint-disable no-param-reassign */
import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { TokenData, Block } from 'state/info/types'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { getChangeForPeriod } from 'utils/getChangeForPeriod'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'
import { getAmountChange, getPercentChange } from 'views/Info/utils/infoDataHelpers'
import { getMultiChainQueryEndPointWithStableSwap, MultiChainName, multiChainQueryMainToken } from '../../constant'
import { fetchTokenAddresses } from './topTokens'

interface TokenFields {
  id: string
  symbol: string
  name: string
  derivedETH: string // Price in ETH per token
  // derivedUSD: string // Price in USD per token
  tradeVolumeUSD: string
  txCount: string
  totalLiquidity: string
}

interface FormattedTokenFields
  extends Omit<
    TokenFields,
    'derivedETH' | 'tradeVolumeUSD' | 'txCount' | 'totalLiquidity'
  > {
  derivedETH: number
  // derivedUSD: number
  tradeVolumeUSD: number
  txCount: number
  totalLiquidity: number
}

interface TokenQueryResponse {
  now: TokenFields[]
  oneDayAgo: TokenFields[]
  twoDaysAgo: TokenFields[]
  oneWeekAgo: TokenFields[]
  twoWeeksAgo: TokenFields[]
}

/**
 * Main token data to display on Token page
 */
const TOKEN_AT_BLOCK = (chainName: MultiChainName, block: number | undefined, tokens: string[]) => {
  const addressesString = `["${tokens.join('","')}"]`
  const blockString = block ? `block: {number: ${block}}` : ``
  return `tokens(
      where: {id_in: ${addressesString}}
      ${blockString}
      orderBy: tradeVolumeUSD
      orderDirection: desc
    ) {
      id
      symbol
      name
      derivedETH
      tradeVolumeUSD
      txCount
      totalLiquidity
    }
  `
}

const fetchTokenData = async (
  chainName: MultiChainName,
  block24h: number,
  block48h: number,
  block7d: number,
  block14d: number,
  tokenAddresses: string[],
) => {
  try {
    const query = gql`
      query tokens {
        now: ${TOKEN_AT_BLOCK(chainName, null, tokenAddresses)}
        oneDayAgo: ${TOKEN_AT_BLOCK(chainName, block24h, tokenAddresses)}
        twoDaysAgo: ${TOKEN_AT_BLOCK(chainName, block48h, tokenAddresses)}
        oneWeekAgo: ${TOKEN_AT_BLOCK(chainName, block7d, tokenAddresses)}
        twoWeeksAgo: ${TOKEN_AT_BLOCK(chainName, block14d, tokenAddresses)}
      }
    `
    const data = await getMultiChainQueryEndPointWithStableSwap(chainName).request<TokenQueryResponse>(query)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch token data', error)
    return { error: true }
  }
}

// Transforms tokens into "0xADDRESS: { ...TokenFields }" format and cast strings to numbers
const parseTokenData = (tokens?: TokenFields[]) => {
  if (!tokens) {
    return {}
  }
  return tokens.reduce((accum: { [address: string]: FormattedTokenFields }, tokenData) => {
    const { tradeVolumeUSD, txCount, totalLiquidity, derivedETH } = tokenData
    accum[tokenData.id.toLowerCase()] = {
      ...tokenData,
      derivedETH: derivedETH ? parseFloat(derivedETH) : 0,
      // derivedUSD: parseFloat(derivedUSD),
      tradeVolumeUSD: parseFloat(tradeVolumeUSD),
      txCount: parseFloat(txCount),
      totalLiquidity: parseFloat(totalLiquidity),
    }
    return accum
  }, {})
}

interface TokenDatas {
  error: boolean
  data?: {
    [address: string]: TokenData
  }
}

/**
 * Fetch top addresses by volume
 */
const useFetchedTokenDatas = (chainName: MultiChainName, tokenAddresses: string[]): TokenDatas => {
  const [fetchState, setFetchState] = useState<TokenDatas>({ error: false })
  const [t24h, t48h, t7d, t14d] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24h, t48h, t7d, t14d])
  const [block24h, block48h, block7d, block14d] = blocks ?? []

  useEffect(() => {
    const fetch = async () => {
      const { error, data } = await fetchTokenData(
        chainName,
        block24h.number,
        block48h.number,
        block7d.number,
        block14d.number,
        tokenAddresses,
      )

      if (error) {
        setFetchState({ error: true })
      } else {
        const parsed = parseTokenData(data?.now)
        const parsed24 = parseTokenData(data?.oneDayAgo)
        const parsed48 = parseTokenData(data?.twoDaysAgo)
        const parsed7d = parseTokenData(data?.oneWeekAgo)
        const parsed14d = parseTokenData(data?.twoWeeksAgo)

        // Calculate data and format
        const formatted = tokenAddresses.reduce((accum: { [address: string]: TokenData }, address) => {
          const current: FormattedTokenFields | undefined = parsed[address]
          const oneDay: FormattedTokenFields | undefined = parsed24[address]
          const twoDays: FormattedTokenFields | undefined = parsed48[address]
          const week: FormattedTokenFields | undefined = parsed7d[address]
          const twoWeeks: FormattedTokenFields | undefined = parsed14d[address]

          const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
            current?.tradeVolumeUSD,
            oneDay?.tradeVolumeUSD,
            twoDays?.tradeVolumeUSD,
          )
          const [volumeUSDWeek] = getChangeForPeriod(
            current?.tradeVolumeUSD,
            week?.tradeVolumeUSD,
            twoWeeks?.tradeVolumeUSD,
          )
          const liquidityUSD = current ? current.totalLiquidity * current.derivedETH : 0
          const liquidityUSDOneDayAgo = oneDay ? oneDay.totalLiquidity * oneDay.derivedETH : 0
          const liquidityUSDChange = getPercentChange(liquidityUSD, liquidityUSDOneDayAgo)
          const liquidityToken = current ? current.totalLiquidity : 0
          // Prices of tokens for now, 24h ago and 7d ago
          const priceUSD = current ? current.derivedETH : 0
          const priceUSDOneDay = oneDay ? oneDay.derivedETH : 0
          const priceUSDWeek = week ? week.derivedETH : 0
          const priceUSDChange = getPercentChange(priceUSD, priceUSDOneDay)
          const priceUSDChangeWeek = getPercentChange(priceUSD, priceUSDWeek)
          const txCount = getAmountChange(current?.txCount, oneDay?.txCount)

          accum[address] = {
            exists: !!current,
            address,
            name: current ? current.name : '',
            symbol: current ? current.symbol : '',
            volumeUSD,
            volumeUSDChange,
            volumeUSDWeek,
            txCount,
            liquidityUSD,
            liquidityUSDChange,
            liquidityToken,
            priceUSD,
            priceUSDChange,
            priceUSDChangeWeek,
          }

          return accum
        }, {})
        setFetchState({ data: formatted, error: false })
      }
    }
    const allBlocksAvailable = block24h?.number && block48h?.number && block7d?.number && block14d?.number
    if (tokenAddresses.length > 0 && allBlocksAvailable && !blockError) {
      fetch()
    }
  }, [tokenAddresses, block24h, block48h, block7d, block14d, blockError, chainName])

  return fetchState
}

export const fetchAllTokenDataByAddresses = async (
  chainName: MultiChainName,
  blocks: Block[],
  tokenAddresses: string[],
) => {
  const [block24h, block48h, block7d, block14d] = blocks ?? []

  const { data } = await fetchTokenData(
    chainName,
    block24h.number,
    block48h.number,
    block7d.number,
    block14d.number,
    tokenAddresses,
  )

  const parsed = parseTokenData(data?.now)
  const parsed24 = parseTokenData(data?.oneDayAgo)
  const parsed48 = parseTokenData(data?.twoDaysAgo)
  const parsed7d = parseTokenData(data?.oneWeekAgo)
  const parsed14d = parseTokenData(data?.twoWeeksAgo)

  // Calculate data and format
  const formatted = tokenAddresses.reduce((accum: { [address: string]: { data: TokenData } }, address) => {
    const current: FormattedTokenFields | undefined = parsed[address]
    const oneDay: FormattedTokenFields | undefined = parsed24[address]
    const twoDays: FormattedTokenFields | undefined = parsed48[address]
    const week: FormattedTokenFields | undefined = parsed7d[address]
    const twoWeeks: FormattedTokenFields | undefined = parsed14d[address]

    const [volumeUSD, volumeUSDChange] = getChangeForPeriod(
      current?.tradeVolumeUSD,
      oneDay?.tradeVolumeUSD,
      twoDays?.tradeVolumeUSD,
    )
    const [volumeUSDWeek] = getChangeForPeriod(current?.tradeVolumeUSD, week?.tradeVolumeUSD, twoWeeks?.tradeVolumeUSD)
    const liquidityUSD = current ? current.totalLiquidity * current.derivedETH : 0
    const liquidityUSDOneDayAgo = oneDay ? oneDay.totalLiquidity * oneDay.derivedETH : 0
    const liquidityUSDChange = getPercentChange(liquidityUSD, liquidityUSDOneDayAgo)
    const liquidityToken = current ? current.totalLiquidity : 0
    // Prices of tokens for now, 24h ago and 7d ago
    const priceUSD = current ? current.derivedETH : 0
    const priceUSDOneDay = oneDay ? oneDay.derivedETH : 0
    const priceUSDWeek = week ? week.derivedETH : 0
    const priceUSDChange = getPercentChange(priceUSD, priceUSDOneDay)
    const priceUSDChangeWeek = getPercentChange(priceUSD, priceUSDWeek)
    const txCount = getAmountChange(current?.txCount, oneDay?.txCount)

    accum[address] = {
      data: {
        exists: !!current,
        address,
        name: current ? current.name : '',
        symbol: current ? current.symbol : '',
        volumeUSD,
        volumeUSDChange,
        volumeUSDWeek,
        txCount,
        liquidityUSD,
        liquidityUSDChange,
        liquidityToken,
        priceUSD,
        priceUSDChange,
        priceUSDChangeWeek,
      },
    }
    return accum
  }, {})

  return formatted
}

export const fetchAllTokenData = async (chainName: MultiChainName, blocks: Block[]) => {
  const tokenAddresses = await fetchTokenAddresses(chainName)
  const data = await fetchAllTokenDataByAddresses(chainName, blocks, tokenAddresses)
  return data
}

export default useFetchedTokenDatas
