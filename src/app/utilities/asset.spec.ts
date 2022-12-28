import {
    ASSET_BUSD,
    ASSET_DAI,
    ASSET_USDC,
    ASSET_WETH,
    ETH_ADDRESS,
} from '../constants/blockchain';

import { isTheSameAsset, getAssetSymbol } from './asset';

describe('Asset Utility', () => {
    it('should check if the asset is the same', () => {
        expect(
            isTheSameAsset(ASSET_BUSD.address, ASSET_BUSD.address),
        ).toBeTruthy();

        expect(isTheSameAsset(ETH_ADDRESS, ETH_ADDRESS)).toBeTruthy();

        expect(isTheSameAsset(ASSET_WETH.address, ETH_ADDRESS)).toBeTruthy();
    });

    it('should get asset symbol', () => {
        expect(getAssetSymbol(ASSET_WETH.address)).toEqual(ASSET_WETH.symbol);

        expect(getAssetSymbol(ASSET_USDC.address)).toEqual(ASSET_USDC.symbol);

        expect(getAssetSymbol(ASSET_DAI.address)).toEqual(ASSET_DAI.symbol);
    });
});
