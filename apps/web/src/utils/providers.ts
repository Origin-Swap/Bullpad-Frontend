import { StaticJsonRpcProvider } from '@ethersproject/providers'

export const BSC_PROD_NODE = 'https://rpc-partners.vanarchain.com'

export const CORE_PROD_NODE = 'https://rpc.coredao.org'

export const bscRpcProvider = new StaticJsonRpcProvider(BSC_PROD_NODE)

export const cmpRpcProvider = new StaticJsonRpcProvider(CORE_PROD_NODE)

export default null
