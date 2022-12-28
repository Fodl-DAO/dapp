export * from './assets';

export const NETWORKS = [
    {
        name: 'ethereum',
        description: 'Ethereum',
    },
    {
        name: 'bsc',
        description: 'Binance (Beta)',
    },
    {
        name: 'polygon',
        description: 'Polygon (Beta)',
    },
];

export const WEB3_MODAL_NETWORKS = {
    ethereum: 'mainnet',
    bsc: 'binance',
    polygon: 'matic',
};

export const DEFAULT_NETWORK = 'ethereum';

export const MIN_REWARDS = 0.00001;

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const DEFAULT_ROUNDING = 8;

export const GAS_LIMIT = undefined;
export const GAS_MULTIPLIER = 1.5;
export const MAX_LEVERAGE_MODIFIER = 0.9;

export const FODL_MAX_APR = 9999;

export const DEFAULT_FODL_BOT_ADDRESS =
    '0xC07331588c85c9183B667ADd8c250CbE84C1eEaB';
