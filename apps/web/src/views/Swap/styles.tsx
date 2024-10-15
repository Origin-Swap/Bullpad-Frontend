import { Box, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledSwapContainer = styled(Flex)<{ $isChartExpanded: boolean }>`
  flex-shrink: 0;
  height: fit-content;

  ${({ theme }) => theme.mediaQueries.lg} {
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    ${({ $isChartExpanded }) => ($isChartExpanded ? 'padding: 0px' : 'padding: 0 20px')};
  }
`

export const StyledInputCurrencyWrapper = styled(Box)`
  width: 380px;
  @media (min-width: 768px) {
    // Untuk desktop, tampilkan di samping
    width: 380px;
  }

  @media (max-width: 767px) {
    // Untuk mobile, tampilkan di bawah
  width: 360px;
  }
`
