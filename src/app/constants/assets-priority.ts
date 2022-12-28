import { ASSET_WMATIC } from './networks/polygon';

import {
    ASSET_ADA,
    ASSET_BSCETH,
    ASSET_BTCB,
    ASSET_CAKE,
    ASSET_DOGE,
    ASSET_DOT,
    ASSET_WBNB,
    ASSET_XRP,
} from './networks/bsc';

import {
    ASSET_BAT,
    ASSET_BUSD,
    ASSET_COMP,
    ASSET_DAI,
    ASSET_LINK,
    ASSET_TUSD,
    ASSET_UNI,
    ASSET_USDC,
    ASSET_USDT,
    ASSET_WBTC,
    ASSET_WETH,
    ASSET_ZRX,
} from './networks/ethereum';

export const assetsPriority = {
    [ASSET_WBTC.symbol]: 100,
    [ASSET_BTCB.symbol]: 90,
    [ASSET_WETH.symbol]: 80,
    [ASSET_BSCETH.symbol]: 75,
    [ASSET_DAI.symbol]: 58,
    [ASSET_USDC.symbol]: 60,
    [ASSET_USDT.symbol]: 59,
    [ASSET_WMATIC.symbol]: 56,
    [ASSET_WBNB.symbol]: 55,
    [ASSET_TUSD.symbol]: 54,
    [ASSET_BUSD.symbol]: 53,
    [ASSET_LINK.symbol]: 40,
    [ASSET_XRP.symbol]: 35,
    [ASSET_ADA.symbol]: 34,
    [ASSET_DOGE.symbol]: 33,
    [ASSET_DOT.symbol]: 32,
    [ASSET_CAKE.symbol]: 31,
    [ASSET_UNI.symbol]: 30,
    [ASSET_BAT.symbol]: 25,
    [ASSET_COMP.symbol]: 20,
    [ASSET_ZRX.symbol]: 15,
};
