import { getAddress } from '@ethersproject/address'
import memoize from 'lodash/memoize'
import { ChainId, Token } from '@pancakeswap/sdk'

const mapping = {
  [ChainId.BSC]: 'smartchain',
  [ChainId.CORE]: 'core',
  [ChainId.VANAR]: 'vanar',
}

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && mapping[token.chainId]) {
      return `https://raw.githubusercontent.com/smartdev1990/trustwallet-assets/master/blockchains/${mapping[
        token.chainId
      ].toLowerCase()}/assets/${getAddress(token.address)}/logo.svg`
    }
    return null
  },
  (t) => `${t.chainId}#${t.address}`,
)

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && mapping[chainId]) {
      return `https://raw.githubusercontent.com/smartdev1990/trustwallet-assets/master/blockchains/${
        mapping[chainId]
      }/assets/${getAddress(address)}/logo.svg`
    }
    return null
  },
  (address, chainId) => `${chainId}#${address}`,
)

export default getTokenLogoURL
