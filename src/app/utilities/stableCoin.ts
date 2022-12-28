import { STABLECOINS } from '../constants/blockchain';

export const isStableCoin = (asset: string): boolean =>
    STABLECOINS.map((asset) => asset.symbol.toLowerCase()).includes(
        asset.toLowerCase(),
    ) ||
    STABLECOINS.map((asset) => asset.address.toLowerCase()).includes(
        asset.toLowerCase(),
    );
