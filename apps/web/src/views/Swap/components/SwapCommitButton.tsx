import { useTranslation } from '@pancakeswap/localization';
import axios from 'axios';
import { Button, Text, useModal } from '@pancakeswap/uikit';
import { Currency, CurrencyAmount, Trade, TradeType, NATIVE } from '@pancakeswap/sdk'; // Periksa impor NATIVE
import { GreyCard } from 'components/Card';
import { CommitButton } from 'components/CommitButton';
import ConnectWalletButton from 'components/ConnectWalletButton';
import { WrapType } from 'hooks/useWrapCallback';
import { AutoRow, RowBetween } from 'components/Layout/Row';
import { ApprovalState } from 'hooks/useApproveCallback';
import CircleLoader from 'components/Loader/CircleLoader';
import { Field } from 'state/swap/actions';
import SettingsModal, { withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal';
import { SettingsMode } from 'components/Menu/GlobalSettings/types';
import { useCallback, useEffect, useState } from 'react';
import Column from 'components/Layout/Column';
import { useUserSingleHopOnly } from 'state/user/hooks';
import { BIG_INT_ZERO } from 'config/constants/exchange';
import { BACKEND_URL } from 'config/constants/backendApi';
import { computeTradePriceBreakdown, warningSeverity } from 'utils/exchange';
import { useSwapCallback } from 'hooks/useSwapCallback';
import { useSwapCallArguments } from 'hooks/useSwapCallArguments';
import { useActiveChainId } from 'hooks/useActiveChainId';
import ConfirmSwapModal from './ConfirmSwapModal';
import ProgressSteps from './ProgressSteps';
import confirmPriceImpactWithoutFee from './confirmPriceImpactWithoutFee';
import { SwapCallbackError } from './styleds';

// Tambahkan baris kosong di sini sebelum kode lainnya
const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal);

interface SwapCommitButtonPropsType {
  swapIsUnsupported: boolean;
  account: string;
  showWrap: boolean;
  wrapInputError: string;
  onWrap: () => Promise<void>;
  wrapType: WrapType;
  approval: ApprovalState;
  approveCallback: () => Promise<void>;
  approvalSubmitted: boolean;
  currencies: {
    INPUT?: Currency;
    OUTPUT?: Currency;
  };
  isExpertMode: boolean;
  trade: Trade<Currency, Currency, TradeType>;
  swapInputError: string;
  currencyBalances: {
    INPUT?: CurrencyAmount<Currency>;
    OUTPUT?: CurrencyAmount<Currency>;
  };
  recipient: string;
  allowedSlippage: number;
  parsedIndepentFieldAmount: CurrencyAmount<Currency>;
  onUserInput: (field: Field, typedValue: string) => void;
}

export default function SwapCommitButton({
  swapIsUnsupported,
  account,
  showWrap,
  wrapInputError,
  onWrap,
  wrapType,
  approval,
  approveCallback,
  approvalSubmitted,
  currencies,
  isExpertMode,
  trade,
  swapInputError,
  currencyBalances,
  recipient,
  allowedSlippage,
  parsedIndepentFieldAmount,
  onUserInput,
}: SwapCommitButtonPropsType) {
  const { t } = useTranslation();
  const [singleHopOnly] = useUserSingleHopOnly();
  const { chainId } = useActiveChainId();
  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);
  const swapCalls = useSwapCallArguments(trade, allowedSlippage, recipient);
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    swapCalls,
  );
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade<Currency, Currency, TradeType> | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });
  function isNativeCurrency(currency) {
    if (currency && chainId && NATIVE[chainId]) {
      return currency.symbol === NATIVE[chainId].symbol;
    }
    return false;
  }
  // Fungsi untuk mencatat swap
  const recordSwap = async (swapData) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/swaps`, swapData);
      // Removed console.log statement
    } catch (error) {
      console.error('Failed to record swap:', error);
    }
  };

  const fetchPriceData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/prices`);
      return response.data.price; // Ensure response contains price
    } catch (error) {
      console.error('Failed to fetch price data:', error);
      return null; // Return null or a default value
    }
  };

  // Handlers
  const handleSwap = useCallback(async () => { // Tambahkan async di sini
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return;
    }
    if (!swapCallback) {
      return;
    }
    setSwapState((prevState) => ({ ...prevState, attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined }));

    try {
      const hash = await swapCallback(); // Tunggu hasil dari swapCallback
      setSwapState((prevState) => ({ ...prevState, attemptingTxn: false, txHash: hash }));

      // Hitung atau dapatkan nilai untuk amount2
      const amount2 = trade.outputAmount?.toExact();
      const isFromNative = isNativeCurrency(currencies[Field.INPUT]);
      const isToNative = isNativeCurrency(currencies[Field.OUTPUT]);
      const status = isFromNative ? 'Buy' : isToNative ? 'Sell' : 'Trade';

      const priceData = await fetchPriceData(); // Ambil data harga
      let calculatedPrice;

      if (isFromNative) {
        calculatedPrice = parseFloat(parsedIndepentFieldAmount.toExact()) * priceData * 2;
      } else if (isToNative) {
        calculatedPrice = parseFloat(amount2) * priceData * 2;
      }

      // Data yang dikirim ke backend harus mencakup semua field yang diperlukan
      const swapData = {
        chainId, // Shorthand property
        walletAddress: account,
        fromCurrency: currencies[Field.INPUT]?.symbol,
        toCurrency: currencies[Field.OUTPUT]?.symbol,
        amount1: parsedIndepentFieldAmount?.toExact(),
        amount2, // Shorthand property
        txhash: hash,
        status,
        price: calculatedPrice,
      };

      recordSwap(swapData);
    } catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  setSwapState((prevState) => ({
    ...prevState,
    attemptingTxn: false,
    swapErrorMessage: errorMessage,
  }));
}

  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t, setSwapState, account, chainId, currencies, parsedIndepentFieldAmount, trade]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash, setSwapState])
  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash, setSwapState])
  // End Handlers
  // Modals
  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)
  const [onPresentSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss
      customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
      mode={SettingsMode.SWAP_LIQUIDITY}
    />,
  )
  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      currencyBalances={currencyBalances}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
      openSettingModal={onPresentSettingsModal}
    />,
    true,
    true,
    'confirmSwapModal',
  )
  // End Modals
  const onSwapHandler = useCallback(() => {
    if (isExpertMode) {
      handleSwap()
    } else {
      setSwapState({
        tradeToConfirm: trade,
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: undefined,
      })
      onPresentConfirmModal()
    }
  }, [isExpertMode, handleSwap, onPresentConfirmModal, trade])
  // useEffect
  useEffect(() => {
    if (indirectlyOpenConfirmModalState) {
      setIndirectlyOpenConfirmModalState(false)
      setSwapState((state) => ({
        ...state,
        swapErrorMessage: undefined,
      }))
      onPresentConfirmModal()
    }
  }, [indirectlyOpenConfirmModalState, onPresentConfirmModal, setSwapState])
  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)
  if (swapIsUnsupported) {
    return (
      <Button width="100%" disabled>
        {t('Unsupported Asset')}
      </Button>
    )
  }
  if (!account) {
    return <ConnectWalletButton width="100%" />
  }
  if (showWrap) {
    return (
      <CommitButton width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
        {wrapInputError ?? (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
      </CommitButton>
    )
  }
  const noRoute = !trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedIndepentFieldAmount?.greaterThan(BIG_INT_ZERO),
  )
  if (noRoute && userHasSpecifiedInputOutput) {
    return (
      <GreyCard style={{ textAlign: 'center', padding: '0.75rem' }}>
        <Text color="textSubtle">{t('Insufficient liquidity for this trade.')}</Text>
        {singleHopOnly && <Text color="textSubtle">{t('Try enabling multi-hop trades.')}</Text>}
      </GreyCard>
    )
  }
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)
  const isValid = !swapInputError
  if (showApproveFlow) {
    return (
      <>
        <RowBetween>
          <CommitButton
            variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallback}
            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
            width="48%"
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                {t('Enabling')} <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
              t('Enabled')
            ) : (
              t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
            )}
          </CommitButton>
          <CommitButton
            variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
            onClick={() => {
              onSwapHandler()
            }}
            width="48%"
            id="swap-button"
            disabled={!isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)}
          >
            {priceImpactSeverity > 3 && !isExpertMode
              ? t('Price Impact High')
              : priceImpactSeverity > 2
              ? t('Swap Anyway')
              : t('Swap')}
          </CommitButton>
        </RowBetween>
        <Column style={{ marginTop: '1rem' }}>
          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
        </Column>
        {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </>
    )
  }

  return (
    <>
      <CommitButton
        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
        onClick={() => {
          onSwapHandler()
        }}
        id="swap-button"
        width="100%"
        disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
      >
        {swapInputError ||
          (priceImpactSeverity > 3 && !isExpertMode
            ? t('Price Impact Too High')
            : priceImpactSeverity > 2
            ? t('Swap Anyway')
            : t('Swap'))}
      </CommitButton>

      {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
    </>
  )
}
