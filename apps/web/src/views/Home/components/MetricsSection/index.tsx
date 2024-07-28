import { Heading, Flex, Text,  Skeleton, ChartIcon, CommunityIcon, SwapIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { formatLocalisedCompactNumber } from '@pancakeswap/utils/formatBalance'
import useSWRImmutable from 'swr/immutable'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from './StatCardContent'
import GradientLogo from '../GradientLogoSvg'

const Stats = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { data: tvl } = useSWRImmutable('tvl')
  const { data: txCount } = useSWRImmutable('totalTx30Days')
  const { data: addressCount } = useSWRImmutable('addressCount30Days')
  const trades = formatLocalisedCompactNumber(txCount)
  const users = formatLocalisedCompactNumber(addressCount)
  const tvlString = tvl ? formatLocalisedCompactNumber(tvl) : '-'

  const tvlText = t('And those users are now entrusting the platform with over $%tvl% in funds.', { tvl: tvlString })
  const [entrusting, inFunds] = tvlText.split(tvlString)

  const UsersCardData: IconCardData = {
    icon: <CommunityIcon color="secondary" width="0px" />,
  }

  const TradesCardData: IconCardData = {
    icon: <SwapIcon color="primary" width="0px" />,
  }

  const StakedCardData: IconCardData = {
    icon: <ChartIcon color="failure" width="0px" />,
  }

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <Heading textAlign="center" color="white" scale="xl" mb="32px">
        {t('Tokenomics')}
      </Heading>
      {/* <GradientLogo height="350x" width="350px" mb="24px" /> */}
      {/* <Heading textAlign="center" scale="xl" mb="32px"> */}
      {/*   {t('Trusted with billions.')} */}
      {/* </Heading> */}
      {/*
      <Flex flexWrap="wrap">
        <Text display="inline" textAlign="center" color="textSubtle" mb="20px">
          {entrusting}
          <>{tvl ? <>{tvlString}</> : <Skeleton display="inline-block" height={16} width={70} mt="2px" />}</>
          {inFunds}
        </Text>
      </Flex>
      */}

      <Text textAlign="center" color="textSubtle" bold mb="32px">
        {t('LineSwap Tokenomic will publish on Mainnet')}
      </Text>

      <Flex flexDirection={['column', null, null, 'row']}>
        <IconCard {...UsersCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '16px']}>
          <StatCardContent
            headingText={t('Name')}
            bodyText={t('BULL Token')}
            highlightColor={theme.colors.secondary}
          />
        </IconCard>
        <IconCard {...TradesCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent headingText={t('Symbol')} bodyText={t('BULL')} highlightColor={theme.colors.primary} />
        </IconCard>
        <IconCard {...StakedCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('Supply')}
            bodyText={t('-.---.---- BULL')}
            highlightColor={theme.colors.failure}
          />
        </IconCard>
        <IconCard {...StakedCardData}>
          <StatCardContent
            headingText={t('Decimal')}
            bodyText={t('18')}
            highlightColor={theme.colors.failure}
          />
        </IconCard>

        <Text textAlign="center" color="textSubtle" bold mb="32px">
          {t('')}
        </Text>
      </Flex>
    </Flex>
  )
}

export default Stats
