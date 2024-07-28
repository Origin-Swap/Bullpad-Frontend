import { Heading, Flex, Text, Button, Skeleton, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useAccount } from 'wagmi'
import useTheme from 'hooks/useTheme'
import { formatLocalisedCompactNumber } from '@pancakeswap/utils/formatBalance'
import useSWRImmutable from 'swr/immutable'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from './StatCardContent'
import HeaderLogo from '../HeaderLogoSvg'

const Stats = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { data: tvl } = useSWRImmutable('tvl')
  const { data: txCount } = useSWRImmutable('totalTx30Days')
  const { data: addressCount } = useSWRImmutable('addressCount30Days')
  const trades = formatLocalisedCompactNumber(txCount)
  const users = formatLocalisedCompactNumber(addressCount)
  const tvlString = tvl ? formatLocalisedCompactNumber(tvl) : '-'
  const { address: account } = useAccount()

  const tvlText = t('And those users are now entrusting the platform with over $%tvl% in funds.', { tvl: tvlString })
  const [entrusting, inFunds] = tvlText.split(tvlString)

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
    <Text textAlign="center" color="white" bold mb="32px">
      {t('')}
    </Text>
    <Text textAlign="center" color="white" bold mb="32px">
      {t('')}
    </Text>
    <Text textAlign="center" color="white" bold mb="32px">
      {t('')}
    </Text>
    <Text textAlign="center" color="white" bold mb="32px">
      {t('')}
    </Text>
      <Heading textAlign="center" color="#fff" scale="xxl" mb="32px">
        {t('LINESWAP EXCHANGE')}
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

      <Text textAlign="center" color="#fff" bold mb="32px">
        {t('The First Decentralized Exchange build on Linea Network')}
      </Text>
      <Flex>
        {!account && <ConnectWalletButton mr="8px" />}
        <NextLinkFromReactRouter to="/swap">
          <Button variant={!account ? 'secondary' : 'primary'}>{t('Trade Now')}</Button>
        </NextLinkFromReactRouter>
      </Flex>
      <Text textAlign="center" color="white" bold mb="32px">
        {t('')}
      </Text>
      <Text textAlign="center"  color="white" bold mb="32px">
        {t('')}
      </Text>
      <Text textAlign="center"  color="white" bold mb="32px">
        {t('')}
      </Text>
    </Flex>
  )
}

export default Stats
