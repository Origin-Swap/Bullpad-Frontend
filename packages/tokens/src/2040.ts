import { ChainId, WBNB, ERC20Token } from '@pancakeswap/sdk'

export const testnetTokens = {
  weth: WBNB[ChainId.VANAR],
  bull: new ERC20Token(
    ChainId.VANAR,
    '0xbDda3DC688cF63C3cA7C76d2432A3b6B636c9ca0',
    18,
    'Syrup',
    'SyrupBar Token',
    'https://Lineswap.Exchange',
  ),
  syrup: new ERC20Token(
    ChainId.VANAR,
    '0xbDda3DC688cF63C3cA7C76d2432A3b6B636c9ca0',
    18,
    'Syrup',
    'SyrupBar Token',
    'https://Lineswap.Exchange',
  ),
}
