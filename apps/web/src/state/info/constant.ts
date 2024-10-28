import { BLOCKS_CLIENT, BLOCKS_CLIENT_ETH, INFO_CLIENT, INFO_CLIENT_ETH } from 'config/constants/endpoints'
import { infoClientETH, infoClient, infoStableSwapClient } from 'utils/graphql'
import { ChainId } from '@pancakeswap/sdk'
import { ETH_TOKEN_BLACKLIST, PCS_ETH_START, PCS_V2_START, TOKEN_BLACKLIST } from 'config/constants/info'

export type MultiChainName = '5IRE' | 'ETH'

export const multiChainQueryMainToken = {
  '5IRE': '5IRE',
  ETH: 'ETH',
}

export const multiChainBlocksClient = {
  '5IRE': BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT,
}

export const multiChainStartTime = {
  '5IRE': 2427588,
  ETH: 14028044,
}

export const multiChainId = {
  '5IRE': ChainId.SIRE_MAINNET,
  ETH: ChainId.ETHEREUM,
}

export const multiChainPaths = {
  [ChainId.SIRE_MAINNET]: '',
  [ChainId.ETHEREUM]: '/eth',
}

export const multiChainQueryClient = {
  '5IRE': infoClient,
  ETH: infoClientETH,
}

export const multiChainQueryEndPoint = {
  '5IRE': INFO_CLIENT,
  ETH: INFO_CLIENT_ETH,
}

export const multiChainScan = {
  '5IRE': 'CoreScan',
  ETH: 'EtherScan',
}

export const multiChainTokenBlackList = {
  '5IRE': TOKEN_BLACKLIST,
  ETH: ETH_TOKEN_BLACKLIST,
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
