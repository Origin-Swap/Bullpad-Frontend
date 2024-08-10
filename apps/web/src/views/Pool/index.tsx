import React, { useMemo, useContext } from 'react'
import styled from 'styled-components'
import {
  Text,
  Flex,
  CardBody,
  CardFooter,
  Button,
  AddIcon,
  Modal,
  ModalV2,
  HotIcon,
  IconButton,
  HotDisableIcon,
  Box,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSwapHotTokenDisplay } from 'hooks/useSwapHotTokenDisplay'
import { useLPTokensWithBalanceByAccount } from 'views/Swap/StableSwap/hooks/useStableConfig'
import FullPositionCard, { StableFullPositionCard } from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs, PairState } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'
import HotTokenList from './HotTokenList'
import { SwapFeaturesContext } from '../Swap/SwapFeaturesContext'

const StyledSwapContainer = styled(Flex)`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 40px;
  }
`

const StyledInputCurrencyWrapper = styled(Box)`
  width: 360px;
`

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.dropdownDeep};
`

const ColoredIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textSubtle};
`

// Tambahkan media query untuk HotTokenList
const HotTokenListContainer = styled.div`

  @media (min-width: 768px) {
    // Untuk desktop, tampilkan di samping
    display: flex;
    flex-direction: row;
  }

  @media (max-width: 767px) {
    // Untuk mobile, tampilkan di bawah
    display: flex;
    flex-direction: column;
  }
`

const table = [ChainId.CORE]

export default function Pool() {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { isChartExpanded, isChartDisplayed, setIsChartDisplayed, isChartSupported } =
    useContext(SwapFeaturesContext)

  const toggleChartDisplayed = () => {
    setIsChartDisplayed((currentIsChartDisplayed) => !currentIsChartDisplayed)
  }

  const [isSwapHotTokenDisplay, setIsSwapHotTokenDisplay] = useSwapHotTokenDisplay()

  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  const stablePairs = useLPTokensWithBalanceByAccount(account)

  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))
  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair))
    .map(([, pair]) => pair)

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }

    let positionCards = []

    if (allV2PairsWithLiquidity?.length > 0) {
      positionCards = allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={Boolean(stablePairs?.length) || index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }

    if (stablePairs?.length > 0) {
      positionCards = [
        ...positionCards,
        ...stablePairs?.map((stablePair, index) => (
          <StableFullPositionCard
            key={`stable-${stablePair.liquidityToken.address}`}
            pair={stablePair}
            mb={index < stablePairs.length - 1 ? '16px' : 0}
          />
        )),
      ]
    }

    if (positionCards?.length > 0) {
      return positionCards
    }

    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      <HotTokenListContainer>
        <Flex flexDirection="column" mb="20px">
          <StyledSwapContainer>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AppBody>
                <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
                {isChartSupported && (
                  <ColoredIconButton
                    variant="text"
                    scale="sm"
                    onClick={() => {
                      if (!isSwapHotTokenDisplay && isChartDisplayed) {
                        toggleChartDisplayed()
                      }
                      setIsSwapHotTokenDisplay(!isSwapHotTokenDisplay)
                    }}
                  >
                    {isSwapHotTokenDisplay ? (
                      <HotDisableIcon color="textSubtle" width="24px" />
                    ) : (
                      <HotIcon color="textSubtle" width="24px" />
                    )}
                  </ColoredIconButton>
                )}
                <Body>
                  {renderBody()}
                  {account && !v2IsLoading && (
                    <Flex flexDirection="column" alignItems="center" mt="24px">
                      <Text color="textSubtle" mb="8px">
                        {t("Don't see a pair you joined?")}
                      </Text>
                      <Link href="/find" passHref>
                        <Button id="import-pool-link" variant="secondary" scale="sm" as="a">
                          {t('Find other LP tokens')}
                        </Button>
                      </Link>
                    </Flex>
                  )}
                </Body>
                <CardFooter style={{ textAlign: 'center' }}>
                  <Link href="/add" passHref>
                    <Button id="join-pool-button" width="100%" startIcon={<AddIcon color="invertedContrast" />}>
                      {t('Add Liquidity')}
                    </Button>
                  </Link>
                </CardFooter>
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
        {chainId === ChainId.CORE && <HotTokenList />}
      </HotTokenListContainer>
    </Page>
  )
}
