import { ChainId, WBNB, ERC20Token } from '@pancakeswap/sdk'

export const mainnetTokens = {
  weth: WBNB[ChainId.CORE],
  bull: new ERC20Token(
  ChainId.CORE,
  '0x49Ca6d0e819E83471575bD4e140ab9a9f4e954d5',
  18,
  'BULL',
  'BullPad Token',
  'https://bullpad.org',
),
}
