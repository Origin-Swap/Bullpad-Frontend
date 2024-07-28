import { useTranslation } from '@pancakeswap/localization'
import { ButtonMenu, ButtonMenuItem, Heading, useMatchBreakpoints } from '@pancakeswap/uikit'
import { memo, useState, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { selectorByUrlsAtom } from 'state/lists/hooks'
import { PANCAKE_EXTENDED } from 'config/constants/lists'
import { useProtocolTransactionsSWR, useTokenDatasSWR } from 'state/info/hooks'
import styled from 'styled-components'
import TransactionTable from 'views/Info/components/InfoTables/addRemoveLiq'
import TokenTable from './SwapTokenTable'

const Wrapper = styled.div`
  padding-top: 10px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 725px;
    padding: 20px 10px 10px 10px;
    box-sizing: border-box;
    background: ${({ theme }) => (theme.isDark ? 'rgba(39, 38, 44, 0.5)' : 'rgba(255, 255, 255, 0.5)')};
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    border-radius: 10px;
  }
`
const MenuWrapper = styled.div`
  padding: 0px 24px 12px;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 24px;
  }
`

const HotTokenList: React.FC = () => {
  const listsByUrl = useAtomValue(selectorByUrlsAtom)
  const { current: list } = listsByUrl[PANCAKE_EXTENDED]
  const whiteList = useMemo(() => {
    return list ? list.tokens.map((t) => t.address.toLowerCase()) : []
  }, [list])
  const allTokens = useTokenDatasSWR(whiteList, false)
  const [index, setIndex] = useState(0)
  const { isMobile } = useMatchBreakpoints()
  const formattedTokens = useMemo(
    () => allTokens.filter((t) => t.priceUSD !== 0 && t.priceUSDChange !== 0 && t.volumeUSD !== 0),
    [allTokens],
  )
  const transactions = useProtocolTransactionsSWR()

  const { t } = useTranslation()
  return (
    <Wrapper style={{ boxShadow: '2px 2px 4px 2px black'}}>
    <Heading scale="lg" mb="16px">
      {t('Transactions History')}
    </Heading>
    <TransactionTable transactions={transactions} />
    </Wrapper>
  )
}

export default memo(HotTokenList)
