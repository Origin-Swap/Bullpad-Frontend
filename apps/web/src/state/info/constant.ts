import { BLOCKS_CLIENT, BLOCKS_CLIENT_ETH, INFO_CLIENT, INFO_CLIENT_ETH } from 'config/constants/endpoints'
import { infoClientETH, infoClient, infoStableSwapClient } from 'utils/graphql'
import { ChainId } from '@pancakeswap/sdk'
import { ETH_TOKEN_BLACKLIST, PCS_ETH_START, PCS_V2_START, TOKEN_BLACKLIST } from 'config/constants/info'

export type MultiChainName = 'SIRE' | 'ETH'

export const multiChainQueryMainToken = {
  SIRE: 'SIRE',
  ETH: 'ETH',
}

export const multiChainBlocksClient = {
  SIRE: BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT,
}

export const multiChainStartTime = {
  SIRE: 3102841,
  ETH: 14028044,
}

export const multiChainId = {
  SIRE: ChainId.SIRE_MAINNET,
  ETH: ChainId.ETHEREUM,
}

export const multiChainPaths = {
  [ChainId.SIRE_MAINNET]: '',
  [ChainId.ETHEREUM]: '/eth',
}

export const multiChainQueryClient = {
  SIRE: infoClient,
  ETH: infoClientETH,
}

export const multiChainQueryEndPoint = {
  SIRE: INFO_CLIENT,
  ETH: INFO_CLIENT_ETH,
}

export const multiChainScan = {
  SIRE: '5ireScan',
  ETH: 'EtherScan',
}

export const multiChainTokenBlackList = {
  SIRE: TOKEN_BLACKLIST,
  ETH: ETH_TOKEN_BLACKLIST,
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
