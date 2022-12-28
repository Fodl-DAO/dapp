import { IPlatformWithAssets } from 'src/app/interfaces/platform.interface';

export const MAINNET = '0x1';
export const MAINNET_RPC = 'https://cloudflare-eth.com';
export const BLOCK_EXPLORER = 'https://etherscan.io';
export const BLOCK_EXPLORER_NAME = 'Etherscan';

export const MIN_CONFIRMATIONS_ETHEREUM = 1;

export const ASSET_FODL = {
    id: 'fodl-finance',
    address: '0x4c2e59d098df7b6cbae0848d66de2f8a4889b9c3',
    symbol: 'FODL',
    name: 'FODL Finance',
};

export const ASSET_BAT = {
    id: 'basic-attention-token',
    address: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    symbol: 'BAT',
    name: 'Basic Attention Token',
};

export const ASSET_DAI = {
    id: 'dai',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    symbol: 'DAI',
    name: 'Dai',
};

export const ASSET_WETH = {
    id: 'weth',
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
};

export const ASSET_USDC = {
    id: 'usd-coin',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
};

export const ASSET_USDT = {
    id: 'tether',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    name: 'Tether',
};

export const ASSET_ZRX = {
    id: '0x',
    address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
    symbol: 'ZRX',
    name: '0x',
};

export const ASSET_UNI = {
    id: 'uniswap',
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    symbol: 'UNI',
    name: 'Uniswap',
};

export const ASSET_COMP = {
    id: 'compound-governance-token',
    address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    symbol: 'COMP',
    name: 'Compound',
};

export const ASSET_WBTC = {
    id: 'wrapped-bitcoin',
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
};

export const ASSET_TUSD = {
    id: 'true-usd',
    address: '0x0000000000085d4780b73119b644ae5ecd22b376',
    symbol: 'TUSD',
    name: 'TrueUSD',
};

export const ASSET_LINK = {
    id: 'chainlink',
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    symbol: 'LINK',
    name: 'ChainLink Token',
};

export const ASSET_BUSD = {
    id: 'binance-usd',
    address: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    symbol: 'BUSD',
    name: 'Binance USD',
};

export const ASSET_UST = {
    id: 'terra-usd',
    address: '0xa47c8bf37f92abed4a126bda807a7b7498661acd',
    symbol: 'UST',
    name: 'TerraUSD',
};

export const ASSET_HUSD = {
    id: 'husd',
    address: '0xdf574c24545e5ffecb9a659c229253d4111d87e1',
    symbol: 'HUSD',
    name: 'HUSD',
};

export const ASSET_USDN = {
    id: 'neutrino',
    address: '0x674c6ad92fd080e4004b2312b45f796a192d27a0',
    symbol: 'USDN',
    name: 'Neutrino USD',
};

export const ASSET_AAVE = {
    id: 'aave',
    address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
    symbol: 'AAVE',
    name: 'Aave',
};

export const ASSET_STKAAVE = {
    id: '',
    address: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
    symbol: 'stkAAVE',
    name: 'Staked Aave',
};

export const ASSET_SUSHI = {
    id: 'sushi',
    address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
    symbol: 'SUSHI',
    name: 'Sushi',
};

export const ASSET_STETH = {
    id: 'staked-ether',
    address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
    symbol: 'stETH',
    name: 'stETH',
};

export const ASSETS = [
    ASSET_FODL,
    ASSET_BAT,
    ASSET_DAI,
    ASSET_WETH,
    ASSET_USDC,
    ASSET_USDT,
    ASSET_ZRX,
    ASSET_UNI,
    ASSET_COMP,
    ASSET_WBTC,
    ASSET_TUSD,
    ASSET_LINK,
    ASSET_BUSD,
    ASSET_UST,
    ASSET_HUSD,
    ASSET_USDN,
    ASSET_STKAAVE,
    ASSET_SUSHI,
    ASSET_STETH,
];

export const PLATFORM_AAVE = '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5';
export const PLATFORM_COMPOUND = '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b';

export const PLATFORMS: IPlatformWithAssets[] = [
    {
        name: 'Aave',
        address: PLATFORM_AAVE,
        assets: [
            ASSET_DAI,
            ASSET_WETH,
            ASSET_USDC,
            ASSET_USDT,
            ASSET_WBTC,
            ASSET_LINK,
            ASSET_UNI,
            // ASSET_STETH,
        ],
    },
    {
        name: 'Compound',
        address: PLATFORM_COMPOUND,
        assets: [
            ASSET_BAT,
            ASSET_DAI,
            ASSET_WETH,
            ASSET_USDC,
            ASSET_USDT,
            ASSET_ZRX,
            ASSET_UNI,
            ASSET_COMP,
            ASSET_WBTC,
            ASSET_TUSD,
            ASSET_LINK,
        ],
    },
];

export const LP_FODL_USDC = '0xa5c475167f03b1556c054e0da78192cd2779087f';
export const LP_FODL_ETH = '0xce7e98d4da6ebda6af474ea618c6b175729cd366';

export const LPs = [
    {
        name: 'FODL / USDC',
        icon: 'assets/sushi.png',
        lp: LP_FODL_USDC,
        assets: [ASSET_FODL, ASSET_USDC],
    },
    {
        name: 'FODL / ETH',
        icon: 'assets/sushi.png',
        lp: LP_FODL_ETH,
        assets: [ASSET_FODL, ASSET_WETH],
    },
];

export const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
export const ETH_DECIMALS = 18;
export const WETH_ADDRESS = ASSET_WETH.address;

export const UNISWAP_V3_FACTORY = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
export const UNISWAP_V3_QUOTER = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';
