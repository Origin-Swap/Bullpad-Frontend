import { ChainId, WBNB, ERC20Token } from '@pancakeswap/sdk'

export const sireMainnet = {
  weth: WBNB[ChainId.SIRE_MAINNET],
  bull: new ERC20Token(
  ChainId.SIRE_MAINNET,
  '0xc6460D248CF1B085069C5663D2123539aE6a1E0d',
  18,
  'BULL',
  'BullPad Token',
  'https://bullpad.org',
),
}
