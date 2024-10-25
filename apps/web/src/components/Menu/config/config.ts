import {
  MenuItemsType,
  DropdownMenuItemType,
  SwapIcon,
  SwapFillIcon,
  DashboardIcon,
  DashFillIcon,
  EarnFillIcon,
  LiquidityIcon,
  LiqFillIcon,
  EarnIcon,
  TrophyIcon,
  ShareIcon,
  TrophyFillIcon,
  NftIcon,
  NftFillIcon,
  MoreIcon,
  RocketIcon,
  StakingIcon,
  DropdownMenuItems,
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { nftsBaseUrl } from 'views/Nft/market/constants'

// import { perpLangMap } from 'utils/getPerpetualLanguageCode'
import { perpTheme } from 'utils/getPerpetualTheme'
// import { SUPPORT_ONLY_BSC } from 'config/constants/supportChains'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('DASHBOARD'),
      icon: DashboardIcon,
      fillIcon: DashFillIcon,
      href: '/dashboard',
      showItemsOnMobile: false,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('SOCIALFI'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/socialfi',
      showItemsOnMobile: false,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('EXCHANGE'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      showItemsOnMobile: true,
      items: [
        {
          label: t('Swap'),
          href: '/swap',
        },
        {
          label: t('Liquidity'),
          href: '/liquidity',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: 'LAUNCHPAD',
      href: 'https://bullpad.org/pools',
      type: DropdownMenuItemType.EXTERNAL_LINK,
      icon: RocketIcon,
      showItemsOnMobile: true,
      hideSubNav: true,
      items: [
        {
          label: t('Launchpad List'),
          href: 'https://bullpad.org/pools',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          label: t('Create Sale'),
          href: 'https://bullpad.org/create-sale',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
