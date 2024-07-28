import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  ArrowForwardIcon,
  Button,
  Flex,
  Heading,
  Skeleton,
  Text,
  NextLinkFromReactRouter,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { formatLocalisedCompactNumber } from '@pancakeswap/utils/formatBalance'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { getTotalWon } from 'state/predictions/helpers'
import { useBNBBusdPrice, useCakeBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import useSWR from 'swr'
import { SLOW_INTERVAL } from 'config/constants'

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`

const PredictionCardHeader: React.FC<React.PropsWithChildren<{ preText: string; won: string }>> = ({
  preText,
  won,
}) => {
  return (
    <Heading color="#280D5F" my="8px" scale="xl" bold>
      {preText}
      {won}
    </Heading>
  )
}

const PredictionCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const bnbBusdPrice = useBNBBusdPrice({ forceMainnet: true })
  const cakePriceBusd = useCakeBusdPrice({ forceMainnet: true })

  const { data } = useSWR(loadData ? ['prediction', 'tokenWon'] : null, getTotalWon, {
    refreshInterval: SLOW_INTERVAL,
  })

  const bnbWonInUsd = multiplyPriceByAmount(bnbBusdPrice, data?.totalWonBNB || 0)
  const cakeWonInUsd = multiplyPriceByAmount(cakePriceBusd, data?.totalWonCAKE || 0)

  const localisedBnbUsdString = formatLocalisedCompactNumber(bnbWonInUsd + cakeWonInUsd)
  const bnbWonText = t('$%wonInUsd% in BNB + CAKE won so far', { wonInUsd: localisedBnbUsdString })
  const [pretext, wonSoFar] = bnbWonText.split(localisedBnbUsdString)

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="10px">
        <Text color="#280D5F" mb="15px">
          {t('Oky')}
        </Text>
        <Flex alignItems="center" justifyContent="center">
          <Text color="#280D5F" mb="15px">
            {t('TowerSwap Marketing & Parnership Staff')}
          </Text>
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="https://t.me/mailu03" id="homepage-prediction-cta">
          <Button width="100%">
            <Text bold color="invertedContrast">
              {t('Profile')}
            </Text>
            <ArrowForwardIcon ml="4px" color="invertedContrast" />
          </Button>
        </StyledLink>
      </Flex>
    </>
  )
}

export default PredictionCardContent
