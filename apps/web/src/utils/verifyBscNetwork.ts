import { ChainId } from '@pancakeswap/sdk'

export const verifyBscNetwork = (chainId: number) => {
  return chainId === ChainId.VANAR || chainId === ChainId.SIRE_MAINNET
}
