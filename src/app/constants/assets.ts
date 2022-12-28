import {
    ASSET_BSCUSDT,
    ASSET_BSCUSDC,
    ASSET_BSCDAI,
    ASSET_BSCBUSD,
    ASSET_WBNB,
    ASSET_BTCB,
    ASSET_BSCETH,
    ASSET_XRP,
    ASSET_ADA,
    ASSET_DOGE,
    ASSET_DOT,
    ASSET_CAKE,
    ASSET_XVS,
} from './networks/bsc';

import {
    ASSET_USDT,
    ASSET_USDC,
    ASSET_BUSD,
    ASSET_DAI,
    ASSET_UST,
    ASSET_TUSD,
    ASSET_HUSD,
    ASSET_WETH,
    ASSET_WBTC,
    ASSET_LINK,
} from './networks/ethereum';

import {
    ASSET_POLYUSDC,
    ASSET_POLYUSDT,
    ASSET_POLYDAI,
    ASSET_WMATIC,
    ASSET_POLYWBTC,
    ASSET_POLYWETH,
} from './networks/polygon';

export * from './networks/bsc';
export * from './networks/ethereum';
export * from './networks/polygon';

export const STABLECOINS = [
    ASSET_USDT,
    ASSET_USDC,
    ASSET_BUSD,
    ASSET_DAI,
    ASSET_UST,
    ASSET_TUSD,
    ASSET_HUSD,
    ASSET_BSCUSDT,
    ASSET_BSCUSDC,
    ASSET_BSCDAI,
    ASSET_BSCBUSD,
    ASSET_POLYUSDC,
    ASSET_POLYUSDT,
    ASSET_POLYDAI,
];

export const LONGABLE = [
    ASSET_WETH,
    ASSET_WBTC,
    ASSET_LINK,
    ASSET_WBNB,
    ASSET_BTCB,
    ASSET_BSCETH,
    ASSET_XRP,
    ASSET_ADA,
    ASSET_DOGE,
    ASSET_DOT,
    ASSET_CAKE,
    ASSET_XVS,
    ASSET_WMATIC,
    ASSET_POLYWBTC,
    ASSET_POLYWETH,
];

export const FLASH_LOANABLE = [ASSET_DAI, ASSET_WETH, ASSET_USDC];
