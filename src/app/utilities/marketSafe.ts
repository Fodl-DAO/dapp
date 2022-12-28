import { isStableCoin } from './stableCoin';

export const isMarketSafe = (
    supplyAsset: string,
    borrowAsset: string,
): boolean =>
    supplyAsset === borrowAsset ||
    (isStableCoin(supplyAsset) && isStableCoin(borrowAsset));
