import { testnetTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
   /*
  {
    pid: 0,
    lpSymbol: 'LINE',
    lpAddress: '0x2b184fac05306115f21ee7b8ea04ea2b2ffcb3b0',
    token: testnetTokens.syrup,
    quoteToken: testnetTokens.weth,
  },
  {
    pid: 1,
    lpSymbol: 'LINE-WETH LP',
    lpAddress: '0x4C54292950FA4170f99c5D34f6133275752939e5',
    token: testnetTokens.line,
    quoteToken: testnetTokens.weth,
  },

  {
    pid: 2,
    v1pid: 2,
    lpSymbol: 'TW-BUSD LP',
    lpAddress: '0xa4B690F4F53caC099549e57e6309A11c79C6Bf56',
    token: testnetTokens.tw,
    quoteToken: testnetTokens.busd,
  },
  {
    pid: 3,
    v1pid: 3,
    lpSymbol: 'BUSD_WCMP LP',
    lpAddress: '0x6b9dB0B7504e04E2a4E5C4B6B22bD84E9a8710fd',
    token: testnetTokens.usdt,
    quoteToken: testnetTokens.wcmp,
  },
  */
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
