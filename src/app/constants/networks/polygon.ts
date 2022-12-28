import { IPlatformWithAssets } from 'src/app/interfaces/platform.interface';

export const POLYGON = '0x89';
export const POLYGON_NAME = 'Polygon Mainnet';
export const POLYGON_RPC_URL = 'https://polygon-rpc.com';
export const POLYGON_SYMBOL = 'MATIC';
export const POLYGON_BLOCK_EXPLORER = 'https://polygonscan.com/';
export const POLYGON_BLOCK_EXPLORER_NAME = 'PolygonScan';

export const POLYGON_DEFAULT_EXCHANGER = '0x20';
export const POLYGON_DEFAULT_EXCHANGE = `${POLYGON_DEFAULT_EXCHANGER}00000000000000000000000000000000000000000000000000000000000000`;

export const QUICKSWAP_ROUTER = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff';

export const MIN_CONFIRMATIONS_POLYGON = 2;

export const ASSET_WMATIC = {
    id: 'wmatic',
    address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    symbol: 'WMATIC',
    name: 'Wrapped Matic',
    decimals: 18,
};

export const ASSET_POLYWBTC = {
    id: 'wrapped-bitcoin',
    address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
};

export const ASSET_POLYWETH = {
    id: 'weth',
    address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
};

export const ASSET_POLYUSDC = {
    id: 'usd-coin',
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
};

export const ASSET_POLYUSDT = {
    id: 'tether',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
};

export const ASSET_POLYDAI = {
    id: 'dai',
    address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    symbol: 'DAI',
    name: 'DAI Stablecoin',
    decimals: 18,
};

export const ASSET_POLYFODL = {
    id: 'fodl-finance',
    address: '0x5314ba045a459f63906aa7c76d9f337dcb7d6995',
    symbol: 'FODL',
    name: 'FODL Finance',
};

export const POLYGON_ASSETS = [
    ASSET_WMATIC,
    ASSET_POLYWBTC,
    ASSET_POLYWETH,
    ASSET_POLYUSDC,
    ASSET_POLYUSDT,
    ASSET_POLYDAI,
];

export const PLATFORM_POLYAAVE = '0xd05e3E715d945B59290df0ae8eF85c1BdB684744';

export const POLYGON_PLATFORMS: IPlatformWithAssets[] = [
    {
        name: 'Aave (Polygon)',
        address: PLATFORM_POLYAAVE,
        assets: [
            ASSET_WMATIC,
            ASSET_POLYWBTC,
            ASSET_POLYWETH,
            ASSET_POLYUSDC,
            ASSET_POLYUSDT,
            ASSET_POLYDAI,
        ],
    },
];

export const LP_FODL_WMATIC = '0x2Fc4DFCEe8C331D54341f5668a6d9BCdd86F8e2f';
export const POLYGON_LPs = [
    {
        name: 'WMATIC / FODL',
        icon: 'assets/quickSwap.png',
        lp: LP_FODL_WMATIC,
        assets: [ASSET_WMATIC, ASSET_POLYFODL],
    },
];
