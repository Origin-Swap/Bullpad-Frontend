import { ChainId, WBNB, ERC20Token } from '@pancakeswap/sdk'

export const sireTokens = {
  weth: WBNB[ChainId.SIRE_TESTNET],
  bull: new ERC20Token(
  ChainId.SIRE_TESTNET,
  '0xc6460D248CF1B085069C5663D2123539aE6a1E0d',
  18,
  'BULL',
  'BullPad Token',
  'https://bullpad.org',
),
}
