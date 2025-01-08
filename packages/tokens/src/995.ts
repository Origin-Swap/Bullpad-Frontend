import { ChainId, WBNB, ERC20Token } from '@pancakeswap/sdk'

export const sireMainnet = {
  weth: WBNB[ChainId.SIRE_MAINNET],
  bull: new ERC20Token(
  ChainId.SIRE_MAINNET,
  '0xFD39ee1A6d4F5e190A994D70E501E79B4b99Cf43',
  18,
  'xBULL',
  'BabyBull Token',
  'https://bullpad.org',
),
}
