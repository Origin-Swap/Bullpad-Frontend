import { Currency, Pair, Token } from '@pancakeswap/sdk';
import { Button, ChevronDownIcon, Text, useModal, Flex, Box, NumericalInput, CopyButton } from '@pancakeswap/uikit';
import styled, { css } from 'styled-components';
import { isAddress } from 'utils';
import { useTranslation } from '@pancakeswap/localization';
import { WrappedTokenInfo } from '@pancakeswap/token-lists';

import { useBUSDCurrencyAmount } from 'hooks/useBUSDPrice';
import { formatNumber } from '@pancakeswap/utils/formatBalance';
import { StablePair } from 'views/AddLiquidity/AddStableLiquidity/hooks/useStableLPDerivedMintInfo';

import { useAccount } from 'wagmi';
import { useCurrencyBalance } from '../../state/wallet/hooks';
import CurrencySearchModal from '../SearchModal/CurrencySearchModal';
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo';

import AddToWalletButton from '../AddToWallet/AddToWalletButton';

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`;

const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })<{ zapStyle?: ZapStyle }>`
  padding: 0 0.5rem;
  ${({ zapStyle, theme }) =>
    zapStyle &&
    css`
      padding: 8px;
      height: auto;
    `};
`;

const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  width: 100%;
`;

const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  width: 100%;
  position: relative;
  flex-flow: column;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  z-index: 1;
`;

const Container = styled.div<{ zapStyle?: ZapStyle; error?: boolean }>`
  border-radius: 15px;
  padding: 0 30px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme, error }) => theme.shadows[error ? 'warning' : 'inset']};
  ${({ zapStyle }) =>
    !!zapStyle &&
    css`
      border-radius: 16px 16px 16px 16px;
    `};
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`;

type ZapStyle = 'noZap' | 'zap';

interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onInputBlur?: () => void;
  onPercentInput?: (percent: number) => void;
  onMax?: () => void;
  showQuickInputButton?: boolean;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | StablePair | null;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
  commonBasesType?: string;
  showSearchInput?: boolean;
  zapStyle?: ZapStyle;
  beforeButton?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  showBUSD?: boolean;
  tokensToShow?: Token[];
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  onPercentInput,
  onMax,
  showQuickInputButton = false,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  zapStyle,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  commonBasesType,
  showSearchInput,
  disabled,
  error,
  showBUSD,
  tokensToShow,
}: CurrencyInputPanelProps) {
  const { address: account } = useAccount();
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined);
  // console.log('useCurrencyBalance:', selectedCurrencyBalance)
  const { t } = useTranslation();

  const token = pair ? pair.liquidityToken : currency?.isToken ? currency : null;
  const tokenAddress = token ? isAddress(token.address) : null;
  // console.log('token:', token)
  // console.log('tokenAddress:', tokenAddress)

  const amountInDollar = useBUSDCurrencyAmount(
    showBUSD ? currency : undefined,
    Number.isFinite(+value) ? +value : undefined,
  );

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
      showSearchInput={showSearchInput}
      tokensToShow={tokensToShow}
    />,
  );

  return (
    <Box position="relative" id={id} style={{ background: '#1D1D1', border: '1px solid #2272FF', borderRadius: '10px', padding: '5px'}}>
      {account && (
        <Text
          onClick={!disabled && onMax}
          color="textSubtle"
          fontSize="12px"
          style={{ display: 'inline', cursor: 'pointer', paddingLeft: '10px', paddingTop: '10px'}}
        >
          Balance
          {!hideBalance && !!currency
            ? t(': $%balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
            : ' -'}
        </Text>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Flex>
          {beforeButton}
          <CurrencySelectButton
            zapStyle={zapStyle}
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal();
              }
            }}
          >
            <Flex alignItems="center" justifyContent="space-between">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={32} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="32px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text id="pair" bold>
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair" bold>
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || t('Select Token')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Flex>
          </CurrencySelectButton>
        </Flex>
        <InputPanel>
          <LabelRow>
            <NumericalInput
              error={error}
              disabled={disabled}
              className="token-amount-input"
              value={value}
              onBlur={onInputBlur}
              onUserInput={(val) => {
                onUserInput(val);
              }}
              style={{ width: '100%' }}
            />
          </LabelRow>
            <Flex justifyContent="flex-end" mr="1rem">
              <Flex maxWidth="200px">
              {!!currency && showBUSD && Number.isFinite(amountInDollar) && (
                <Text fontSize="12px" color="textSubtle">
                  ~${formatNumber(amountInDollar)}
                </Text>
                )}
              </Flex>
            </Flex>
        </InputPanel>
      </Flex>
      <InputRow selected={disableCurrencySelect}>
        {account && currency && selectedCurrencyBalance?.greaterThan(0) && !disabled && label !== 'To' && (
          <Flex>
            {showQuickInputButton &&
              onPercentInput &&
              [25, 50, 75].map((percent) => (
                <Button
                  key={`btn_quickCurrency${percent}`}
                  onClick={() => {
                    onPercentInput(percent);
                  }}
                  scale="xs"
                  mr="5px"
                  style={{ textTransform: 'uppercase' }}
                >
                  {percent}%
                </Button>
              ))}
            {showMaxButton && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onMax?.();
                }}
                scale="xs"
                style={{ textTransform: 'uppercase' }}
              >
                {t('Max')}
              </Button>
            )}
          </Flex>
        )}
      </InputRow>
    </Box>
  );
}
