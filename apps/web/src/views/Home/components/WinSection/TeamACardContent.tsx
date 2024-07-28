import { useState, useEffect } from 'react'
import {
  Flex,
  Text,
  Skeleton,
  Button,
  ArrowForwardIcon,
  Balance,
  NextLinkFromReactRouter,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { usePriceCakeBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import { fetchLottery, fetchCurrentLotteryId } from 'state/lottery/helpers'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { SLOW_INTERVAL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`

const StyledBalance = styled(Balance)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const LotteryCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const cakePriceBusd = usePriceCakeBusd({ forceMainnet: true })
  const { data: currentLotteryId } = useSWRImmutable(loadData ? ['currentLotteryId'] : null, fetchCurrentLotteryId, {
    refreshInterval: SLOW_INTERVAL,
  })
  const { data: currentLottery } = useSWRImmutable(
    currentLotteryId ? ['currentLottery'] : null,
    async () => fetchLottery(currentLotteryId.toString()),
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  const cakePrizesText = t('%cakePrizeInUsd% in CAKE prizes this round', { cakePrizeInUsd: cakePriceBusd.toString() })
  const [pretext, prizesThisRound] = cakePrizesText.split(cakePriceBusd.toString())
  const amountCollectedInCake = currentLottery ? parseFloat(currentLottery.amountCollectedInCake) : null
  const currentLotteryPrize = amountCollectedInCake ? cakePriceBusd.times(amountCollectedInCake) : null

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" mt="10px">
        <Text color="black" mb="15px">
          {t('Na Ra')}
        </Text>
        <Text color="#280D5F" mb="15px">
          {t('Towerswap Owner & Head Of Developer')}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="https://www.linkedin.com/in/nandayusra/" id="homepage-prediction-cta">
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

export default LotteryCardContent
