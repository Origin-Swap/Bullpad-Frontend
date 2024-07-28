import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { infoClient } from 'utils/graphql'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'

export interface BnbPrices {
  current: number
  oneDay: number
  twoDay: number
  week: number
}

const BNB_PRICES = gql`
  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {
    current: bundle(id: "1") {
      ethPrice
    }
    oneDay: bundle(id: "1", block: { number: $block24 }) {
      ethPrice
    }
    twoDay: bundle(id: "1", block: { number: $block48 }) {
      ethPrice
    }
    oneWeek: bundle(id: "1", block: { number: $blockWeek }) {
      ethPrice
    }
  }
`

interface PricesResponse {
  current: {
    ethPrice: string
  }
  oneDay: {
    ethPrice: string
  }
  twoDay: {
    ethPrice: string
  }
  oneWeek: {
    ethPrice: string
  }
}

const fetchBnbPrices = async (
  block24: number,
  block48: number,
  blockWeek: number,
): Promise<{ ethPrices: BnbPrices | undefined; error: boolean }> => {
  try {
    const data = await infoClient.request<PricesResponse>(BNB_PRICES, {
      block24,
      block48,
      blockWeek,
    })
    return {
      error: false,
      ethPrices: {
        current: parseFloat(data.current?.ethPrice ?? '0'),
        oneDay: parseFloat(data.oneDay?.ethPrice ?? '0'),
        twoDay: parseFloat(data.twoDay?.ethPrice ?? '0'),
        week: parseFloat(data.oneWeek?.ethPrice ?? '0'),
      },
    }
  } catch (error) {
    console.error('Failed to fetch BNB prices', error)
    return {
      error: true,
      ethPrices: undefined,
    }
  }
}

/**
 * Returns BNB prices at current, 24h, 48h, and 7d intervals
 */
export const useBnbPrices = (): BnbPrices | undefined => {
  const [prices, setPrices] = useState<BnbPrices | undefined>()
  const [error, setError] = useState(false)

  const [t24, t48, tWeek] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])

  useEffect(() => {
    const fetch = async () => {
      const [block24, block48, blockWeek] = blocks
      const { ethPrices, error: fetchError } = await fetchBnbPrices(block24.number, block48.number, blockWeek.number)
      if (fetchError) {
        setError(true)
      } else {
        setPrices(ethPrices)
      }
    }
    if (!prices && !error && blocks && !blockError) {
      fetch()
    }
  }, [error, prices, blocks, blockError])

  return prices
}
