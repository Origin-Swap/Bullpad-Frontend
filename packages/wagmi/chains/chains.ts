import { rinkeby, mainnet, goerli } from 'wagmi/chains'
import { Chain } from 'wagmi'

export const vanar: Chain = {
  id: 2040,
  name: 'Vanar Mainnet',
  network: 'VanarChain',
  rpcUrls: {
    // default: 'https://rpc.vanarchain.com',
    default: 'https://rpc-partners.vanarchain.com',
  },
  nativeCurrency: { name: 'Vanguard', symbol: 'VANRY', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'VanarScan',
      url: 'https://explorer.vanarchain.com/',
    },
  },
}

export const avalandche: Chain = {
  id: 43114,
  name: 'Avalanche C-Chain',
  network: 'avalanche',
  rpcUrls: {
    default: 'https://rpc.ankr.com/avalanche',
  },
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'snowtrace',
      url: 'https://snowtrace.io/',
    },
  },
}

export const corechain: Chain = {
  id: 1116,
  name: 'Core Mainnet',
  network: 'CORE',
  rpcUrls: {
    default: 'https://rpc.coredao.org',
  },
  nativeCurrency: { name: 'CORE', symbol: 'CORE', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'Core Scan',
      url: 'https://scan.coredao.org/',
    },
  },
}

export const zeta: Chain = {
  id: 7001,
  name: 'ZetaChain Testnet',
  network: 'ZETA TESTNET',
  rpcUrls: {
    default: 'https://api.athens2.zetachain.com/evm',
  },
  nativeCurrency: { name: 'Zetachain', symbol: 'ZETA', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'ZetaScan',
      url: 'https://explorer.zetachain.com/',
    },
  },
}

export const avalandcheFuji: Chain = {
  id: 43113,
  name: 'Avalanche Fuji',
  network: 'avalanche-fuji',
  rpcUrls: {
    default: 'https://rpc.ankr.com/avalanche_fuji',
  },
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'snowtrace',
      url: 'https://testnet.snowtrace.io/',
    },
  },
  testnet: true,
}

export const fantomOpera: Chain = {
  id: 250,
  name: 'Fantom Opera',
  network: 'fantom',
  nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
  rpcUrls: {
    default: 'https://rpc.ftm.tools',
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://ftmscan.com',
    },
  },
}

export const fantomTestnet: Chain = {
  id: 4002,
  name: 'Fantom Testnet',
  network: 'fantom-testnet',
  nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
  rpcUrls: {
    default: 'https://rpc.testnet.fantom.network',
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://testnet.ftmscan.com',
    },
  },
  testnet: true,
}

const bscExplorer = { name: 'BscScan', url: 'https://bscscan.com' }

export const bsc: Chain = {
  id: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  rpcUrls: {
    public: 'https://bsc-dataseed1.binance.org',
    default: 'https://bsc-dataseed1.binance.org',
  },
  blockExplorers: {
    default: bscExplorer,
    etherscan: bscExplorer,
  },
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
  multicall: {
    address: '0x3dc18345e131a673e11401696a35e7927673eeea',
    blockCreated: 15921452,
  },
}

export const bscTest: Chain = {
  id: 97,
  name: 'BNB Smart Chain Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Binance Chain Native Token',
    symbol: 'tBNB',
  },
  rpcUrls: {
    public: 'https://data-seed-prebsc-1-s3.binance.org:8545',
    default: 'https://data-seed-prebsc-1-s3.binance.org:8545',
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  multicall: {
    address: '0x3dc18345e131a673e11401696a35e7927673eeea',
    blockCreated: 17422483,
  },
  testnet: true,
}

export { rinkeby, mainnet, goerli }
