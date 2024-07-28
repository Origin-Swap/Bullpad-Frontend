import { BLOCKS_CLIENT, BLOCKS_CLIENT_ETH, INFO_CLIENT, INFO_CLIENT_ETH } from 'config/constants/endpoints'
import { infoClientETH, infoClient, infoStableSwapClient } from 'utils/graphql'
import { ChainId } from '@pancakeswap/sdk'
import { ETH_TOKEN_BLACKLIST, PCS_ETH_START, PCS_V2_START, TOKEN_BLACKLIST } from 'config/constants/info'

export type MultiChainName = 'CORE' | 'ETH'

export const multiChainQueryMainToken = {
  CORE: 'ETH',
  ETH: 'ETH',
}

export const multiChainBlocksClient = {
  CORE: BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT,
}

export const multiChainStartTime = {
  CORE: 14028044,
  ETH: 14028044,
}

export const multiChainId = {
  CORE: ChainId.CORE,
  ETH: ChainId.ETHEREUM,
}

export const multiChainPaths = {
  [ChainId.CORE]: '',
  [ChainId.ETHEREUM]: '/eth',
}

export const multiChainQueryClient = {
  CORE: infoClient,
  ETH: infoClientETH,
}

export const multiChainQueryEndPoint = {
  CORE: INFO_CLIENT,
  ETH: INFO_CLIENT_ETH,
}

export const multiChainScan = {
  CORE: 'CoreScan',
  ETH: 'EtherScan',
}

export const multiChainTokenBlackList = {
  CORE: TOKEN_BLACKLIST,
  ETH: ETH_TOKEN_BLACKLIST,
}

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainName) => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')
