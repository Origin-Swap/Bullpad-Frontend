export const MINIMUM_SEARCH_CHARACTERS = 2

export const WEEKS_IN_YEAR = 52.1429

export const TOTAL_FEE = 0.0025
export const LP_HOLDERS_FEE = 0.0017
export const TREASURY_FEE = 0.000225
export const BUYBACK_FEE = 0.000575

export const PCS_V2_START = 1619136000 // April 23, 2021, 12:00:00 AM
export const PCS_ETH_START = 1664130827 // Sep 23, 2022, 02:33:47 AM
export const ONE_DAY_UNIX = 86400 // 24h * 60m * 60s
export const ONE_HOUR_SECONDS = 3600

export const ITEMS_PER_INFO_TABLE_PAGE = 10

// These tokens are either incorrectly priced or have some other issues that spoil the query data
// None of them present any interest as they have almost 0 daily trade volume
export const TOKEN_BLACKLIST = [
  // These ones are copied from v1 info
  '0x495c7f3a713870f68f8b418b355c085dfdc412c3',
]

export const ETH_TOKEN_BLACKLIST = ['0x72b169ad8af6c4fb53056b6a2a85602ad6863864']
