import '@pancakeswap/ui/css/reset.css';
import { ResetCSS, ToastListener, ScrollToTopButtonV2 } from '@pancakeswap/uikit';
import BigNumber from 'bignumber.js';
import GlobalCheckClaimStatus from 'components/GlobalCheckClaimStatus';
import { NetworkModal } from 'components/NetworkModal';
import { FixedSubgraphHealthIndicator } from 'components/SubgraphHealthIndicator/FixedSubgraphHealthIndicator';
import { useAccountEventListener } from 'hooks/useAccountEventListener';
import useEagerConnect from 'hooks/useEagerConnect';
import useEagerConnectMP from 'hooks/useEagerConnect.bmp';
import useSentryUser from 'hooks/useSentryUser';
import useThemeCookie from 'hooks/useThemeCookie';
import useUserAgent from 'hooks/useUserAgent';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Script from 'next/script';
import { Fragment } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, useStore } from 'state';
import { usePollBlockNumber } from 'state/block/hooks';
import TransactionsDetailModal from 'components/TransactionDetailModal';
import { Blocklist, Updaters } from '..';
import { SentryErrorBoundary } from '../components/ErrorBoundary';
import Menu from '../components/Menu';
import Providers from '../Providers';
import GlobalStyle from '../style/Global';
import 'style/Global.css';

const EasterEgg = dynamic(() => import('components/EasterEgg'), { ssr: false });

// Konfigurasi BigNumber
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

// Komponen Global Hooks
function GlobalHooks() {
  usePollBlockNumber();
  useEagerConnect();
  useUserAgent();
  useAccountEventListener();
  useSentryUser();
  useThemeCookie();
  return null;
}

// Komponen MP Global Hooks
function MPGlobalHooks() {
  usePollBlockNumber();
  useEagerConnectMP();
  useUserAgent();
  useAccountEventListener();
  useSentryUser();
  return null;
}

// Komponen utama aplikasi
function MyApp(props: AppProps<{ initialReduxState: any }>) {
  const { pageProps, Component } = props;
  const store = useStore(pageProps.initialReduxState);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover" />
        <meta name="description" content="BullEx, the leading DEX on 5ire Chain with the best farms in DeFi and a lottery for BULL." />
        <meta name="theme-color" content="#1FC7D4" />
        <meta name="twitter:image" content="/images/bannerbg.png" />
        <meta name="twitter:description" content="MULTICHAIN DEFI WEB 3.0 ECOSYSTEM!" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BullEx - MULTICHAIN DEFI WEB 3.0 ECOSYSTEM" />
        <title>BullEx</title>

        {(Component as NextPageWithLayout).mp && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src="https://public.bnbstatic.com/static/js/mp-webview-sdk/webview-v1.0.0.min.js" id="mp-webview" />
        )}
      </Head>
      <Providers store={store}>
        <Blocklist>
          {(Component as NextPageWithLayout).mp ? <MPGlobalHooks /> : <GlobalHooks />}
          <ResetCSS />
          <GlobalStyle />
          <GlobalCheckClaimStatus excludeLocations={[]} />
          <PersistGate loading={null} persistor={persistor}>
            <Updaters />
            <App {...props} />
          </PersistGate>
        </Blocklist>
      </Providers>
      {/* <Script */}
      {/*   strategy="afterInteractive" */}
      {/*   id="google-tag" */}
      {/*   dangerouslySetInnerHTML={{ */}
      {/*     __html: ` */}
      {/*       (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': */}
      {/*       new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], */}
      {/*       j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= */}
      {/*       'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); */}
      {/*       })(window,document,'script','dataLayer', '${process.env.NEXT_PUBLIC_GTAG}'); */}
      {/*     `, */}
      {/*   }} */}
      {/* /> */}
    </>
  );
}

// Tipe NextPage dengan layout
type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>;
  pure?: true;
  mp?: boolean;
  chains?: number[];
  isShowScrollToTopButton?: true;
};

// Tipe AppProps dengan layout
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const ProductionErrorBoundary = process.env.NODE_ENV === 'production' ? SentryErrorBoundary : Fragment;

// Komponen utama aplikasi
const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  if (Component.pure) {
    return <Component {...pageProps} />;
  }

  const Layout = Component.Layout || Fragment;
  const ShowMenu = Component.mp ? Fragment : Menu;
  const isShowScrollToTopButton = Component.isShowScrollToTopButton || true;

  return (
    <ProductionErrorBoundary>
      <ShowMenu>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ShowMenu>
      <EasterEgg iterations={2} />
      <ToastListener />
      <FixedSubgraphHealthIndicator />
      <NetworkModal pageSupportedChains={Component.chains} />
      <TransactionsDetailModal />
      {isShowScrollToTopButton && <ScrollToTopButtonV2 />}
    </ProductionErrorBoundary>
  );
};

export default MyApp;
