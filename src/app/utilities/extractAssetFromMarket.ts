import { IMarket } from '../interfaces/market.interface';
import { IAsset } from '../interfaces/asset.interface';

export const extractAssetFromMarket = (market: IMarket): IAsset => ({
    name: market.assetSymbol,
    address: market.assetAddress,
    decimals: market.assetDecimals,
    platformAddress: market.platform.address,
    platformName: market.platform.name,
});
