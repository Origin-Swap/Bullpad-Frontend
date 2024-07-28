import { ContextApi } from '@pancakeswap/localization'

type FAQsType = {
  t: ContextApi['t']
}

const config = ({ t }: FAQsType) => [
  {
    title: t('what is BULL SWAP?'),
    description: [t('Line Swap is a decentralized exchange built on the Linea network.')],
  },
  {
    title: t('How can i use BULL SWAP'),
    description: [t('follow the tutorial to get some gETH faucets on linea network: https://docs.linea.build/use-linea/fund after you get it you can use lineswap')],
  },
  {
    title: t('Is BULL SWAP safe?'),
    description: [
      t(
        'yes, we will audit smart contracts',
      ),
    ],
  },
]
export default config
