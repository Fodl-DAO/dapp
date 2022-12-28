import { IPlatformWithAssets } from 'src/app/interfaces/platform.interface';

export const BSC = '0x38';
export const BSC_NAME = 'Binance Smart Chain Mainnet';
export const BSC_RPC_URL = 'https://bsc-dataseed1.binance.org/';
export const BSC_SYMBOL = 'BNB';
export const BSC_BLOCK_EXPLORER = 'https://bscscan.com';
export const BSC_BLOCK_EXPLORER_NAME = 'BSCScan';

export const BSC_DEFAULT_EXCHANGER = '0x11';
export const BSC_DEFAULT_EXCHANGE = `${BSC_DEFAULT_EXCHANGER}00000000000000000000000000000000000000000000000000000000000000`;

export const PANCAKESWAP_ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E';

export const MIN_CONFIRMATIONS_BSC = 2;

export const ASSET_RNG = {
    id: '',
    address: '0x3b94440c8c4f69d5c9f47bab9c5a93064df460f5',
    symbol: 'RNG',
    name: 'Ring Exchange',
};

export const ASSET_WBNB = {
    id: 'wbnb',
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    symbol: 'WBNB',
    name: 'Wrapped BNB',
    decimals: 18,
};

export const ASSET_BTCB = {
    id: 'binance-bitcoin',
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    symbol: 'BTCB',
    name: 'Binance-Peg BTCB Token',
    decimals: 18,
};

export const ASSET_BSCUSDT = {
    id: 'tether',
    address: '0x55d398326f99059fF775485246999027B3197955',
    symbol: 'USDT',
    name: 'Binance-Peg BSC-USD',
    decimals: 18,
};

export const ASSET_BSCUSDC = {
    id: 'usd-coin',
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    symbol: 'USDC',
    name: 'Binance-Peg USD Coin',
    decimals: 18,
};

export const ASSET_BSCDAI = {
    id: 'dai',
    address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    symbol: 'DAI',
    name: 'Binance-Peg Dai Token',
    decimals: 18,
};

export const ASSET_BSCBUSD = {
    id: 'binance-usd',
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    symbol: 'BUSD',
    name: 'Binance-Peg BUSD Token',
    decimals: 18,
};

export const ASSET_BSCETH = {
    id: 'ethereum',
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    symbol: 'ETH',
    name: 'Binance-Peg Ethereum Token',
    decimals: 18,
};

export const ASSET_XRP = {
    id: 'binance-peg-xrp',
    address: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
    symbol: 'XRP',
    name: 'Binance-Peg XRP Token',
    decimals: 18,
};

export const ASSET_ADA = {
    id: 'binance-peg-cardano',
    address: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
    symbol: 'ADA',
    name: 'Binance-Peg Cardano Token',
    decimals: 18,
};

export const ASSET_DOGE = {
    id: 'binance-peg-dogecoin',
    address: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    symbol: 'DOGE',
    name: 'Binance-Peg Dogecoin Token',
    decimals: 8,
};

export const ASSET_DOT = {
    id: 'binance-peg-polkadot',
    address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    symbol: 'DOT',
    name: 'Binance-Peg Polkadot Token',
    decimals: 18,
};

export const ASSET_CAKE = {
    id: 'pancakeswap-token',
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    symbol: 'Cake',
    name: 'PancakeSwap Token',
    decimals: 18,
};

export const ASSET_XVS = {
    id: 'venus',
    address: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63',
    symbol: 'XVS',
    name: 'Venus',
};

export const ASSET_VBNB = {
    id: '',
    address: '0xA07c5b74C9B40447a954e1466938b865b6BBea36',
    symbol: 'vBNB',
    name: 'Venus BNB',
    decimals: 8,
};

export const ASSET_VBUSD = {
    id: 'venus-busd',
    address: '0x95c78222B3D6e262426483D42CfA53685A67Ab9D',
    symbol: 'vBUSD',
    name: 'Venus BUSD',
    decimals: 8,
};

export const ASSET_VUSDC = {
    id: 'venus-usdc',
    address: '0xecA88125a5ADbe82614ffC12D0DB554E2e2867C8',
    symbol: 'vUSDC',
    name: 'Venus USDC',
    decimals: 8,
};

export const ASSET_VXVS = {
    id: 'venus-xvs',
    address: '0x151B1e2635A717bcDc836ECd6FbB62B674FE3E1D',
    symbol: 'vXVS',
    name: 'Venus XVS',
    decimals: 8,
};

export const ASSET_VUSDT = {
    id: 'venus-usdt',
    address: '0xfd5840cd36d94d7229439859c0112a4185bc0255',
    symbol: 'vUSDT',
    name: 'Venus USDT',
    decimals: 8,
};

export const ASSET_VDAI = {
    id: 'venus-dai',
    address: '0x334b3ecb4dca3593bccc3c7ebd1a1c1d1780fbf1',
    symbol: 'vDAI',
    name: 'Venus DAI',
    decimals: 8,
};

export const ASSET_VBTC = {
    id: 'venus-btc',
    address: '0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B',
    symbol: 'vBTC',
    name: 'Venus BTC',
    decimals: 8,
};

export const ASSET_VBETH = {
    id: 'venus-beth',
    address: '0x972207A639CC1B374B893cc33Fa251b55CEB7c07',
    symbol: 'vBETH',
    name: 'Venus BETH',
    decimals: 8,
};

export const ASSET_VXRP = {
    id: 'venus-xrp',
    address: '0xB248a295732e0225acd3337607cc01068e3b9c10',
    symbol: 'vXRP',
    name: 'Venus XRP',
    decimals: 8,
};

export const ASSET_VADA = {
    id: '',
    address: '0x9A0AF7FDb2065Ce470D72664DE73cAE409dA28Ec',
    symbol: 'vADA',
    name: 'Venus ADA',
    decimals: 8,
};

export const ASSET_VDOGE = {
    id: 'venus-doge',
    address: '0xec3422Ef92B2fb59e84c8B02Ba73F1fE84Ed8D71',
    symbol: 'vDOGE',
    name: 'Venus DOGE',
    decimals: 8,
};

export const ASSET_VDOT = {
    id: 'venus-dot',
    address: '0x1610bc33319e9398de5f57B33a5b184c806aD217',
    symbol: 'vDOT',
    name: 'Venus DOT',
    decimals: 8,
};

export const ASSET_VCAKE = {
    id: '',
    address: '0x86aC3974e2BD0d60825230fa6F355fF11409df5c',
    symbol: 'vCAKE',
    name: 'Venus CAKE',
    decimals: 8,
};

export const BSC_ASSETS = [
    ASSET_WBNB,
    ASSET_BTCB,
    ASSET_BSCUSDT,
    ASSET_BSCUSDC,
    ASSET_BSCDAI,
    ASSET_BSCBUSD,
    ASSET_BSCETH,
    ASSET_XRP,
    ASSET_ADA,
    ASSET_DOGE,
    ASSET_DOT,
    ASSET_CAKE,
    ASSET_XVS,
    ASSET_VBNB,
    ASSET_VBUSD,
    ASSET_VUSDC,
    ASSET_VXVS,
    ASSET_VUSDT,
    ASSET_VDAI,
    ASSET_VBTC,
    ASSET_VBETH,
    ASSET_VXRP,
    ASSET_VADA,
    ASSET_VDOGE,
    ASSET_VDOT,
    ASSET_VCAKE,
];

export const PLATFORM_VENUS = '0xfD36E2c2a6789Db23113685031d7F16329158384';

export const BSC_PLATFORMS: IPlatformWithAssets[] = [
    {
        name: 'Venus',
        address: PLATFORM_VENUS,
        assets: [
            ASSET_WBNB,
            ASSET_BTCB,
            ASSET_BSCUSDT,
            ASSET_BSCUSDC,
            ASSET_BSCDAI,
            ASSET_BSCBUSD,
            ASSET_BSCETH,
            ASSET_XRP,
            ASSET_ADA,
            ASSET_DOGE,
            ASSET_DOT,
            ASSET_CAKE,
        ],
    },
];
