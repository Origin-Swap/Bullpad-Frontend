import { ChainId } from '@pancakeswap/sdk'
import FarmsBscPriceHelper from './56'
import FarmsBscTestnetPriceHelper from './97'
import FarmsCorePriceHelper from './1116'
import FarmsVanarPriceHelper from './2040'
import FarmsEthereumPriceHelper from './1'
import FarmsGoerliPriceHelper from './5'

export const getFarmsPriceHelperLpFiles = (chainId: ChainId) => {
  switch (chainId) {
    case ChainId.BSC:
      return FarmsBscPriceHelper
    case ChainId.BSC_TESTNET:
      return FarmsBscTestnetPriceHelper
    case ChainId.CORE:
      return FarmsCorePriceHelper
    case ChainId.VANAR:
      return FarmsVanarPriceHelper
    case ChainId.ETHEREUM:
      return FarmsEthereumPriceHelper
    case ChainId.GOERLI:
      return FarmsGoerliPriceHelper
    default:
      return []
  }
}
