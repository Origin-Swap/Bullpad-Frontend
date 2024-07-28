import { Token } from '@pancakeswap/sdk'
import { testnetTokens } from '@pancakeswap/tokens'
import { bscWarningTokens } from 'config/constants/warningTokens'

// const { bondly, itam, ccar, bttold, abnbc } = testnetTokens
// const { pokemoney, free, safemoon, gala } = bscWarningTokens

interface WarningTokenList {
  [key: string]: Token
}

const SwapWarningTokens = <WarningTokenList>{}

export default SwapWarningTokens
