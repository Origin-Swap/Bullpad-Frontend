import { ERC20Token, ChainId } from '@pancakeswap/sdk'
import { testnetTokens } from '@pancakeswap/tokens'
import { CAKE_BNB_LP_MAINNET } from './lp'
import { Ifo } from './types'

export const cakeBnbLpToken = new ERC20Token(ChainId.VANAR, CAKE_BNB_LP_MAINNET, 18, 'CAKE-BNB LP')

const ifos: Ifo[] = [
  /*
  {
    id: 'towertest',
    address: '0x0f06d6d0a4f4c8b85ba271e74b2060f7320639fa',
    isActive: true,
    name: 'TST',
    plannedStartTime: 12562958, // Mon Jan 16 2023 12:00:00 UTC
    poolBasic: {
      raiseAmount: '$350,000',
    },
    poolUnlimited: {
      raiseAmount: '$1,050,000',
    },
    currency: testnetTokens.tw,
    token: testnetTokens.arena,
    campaignId: '512100000',
    articleUrl:
      'https://pancakeswap.finance/voting/proposal/0x06598b682d9f33ec5ea0c2acf8eba13dea7c63fa08dd2c4dfd7bc7af16920d51',
    tokenOfferingPrice: 0.04,
    version: 3.2,
    twitterUrl: 'https://twitter.com/ESPL_GLOBAL',
    description:
      'The Esports Players League (ESPL) Arena is a platform that hosts global Esports tournaments and coordinates different aspects such as setting of tournament parameters, score-keeping, prize pool payouts via crypto and more.',
    vestingTitle: 'Use $ARENA to enjoy premium features on ESPL’s Esports tournament platform',
  },
  */
]

export default ifos
