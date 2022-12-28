import { BSC_PLATFORMS, PLATFORMS } from '../constants/blockchain';
import {
    getAssetPairs,
    getNetworkPlatforms,
    getPlatformAssetPairs,
} from './assetPairs';

describe('Asset Pairs Utility', () => {
    it('should get proper platfroms for given network', () => {
        expect(getNetworkPlatforms('ethereum')).toEqual(PLATFORMS);

        expect(getNetworkPlatforms('bsc')).toEqual(BSC_PLATFORMS);
    });

    it('should return all pairs for given platform on Ethereum', () => {
        for (const platform of PLATFORMS) {
            expect(
                getPlatformAssetPairs(platform.address, 'ethereum').length,
            ).toEqual(platform.assets.length ** 2);
        }
    });

    it('should return all pairs for given platform on BSC', () => {
        for (const platform of BSC_PLATFORMS) {
            expect(
                getPlatformAssetPairs(platform.address, 'bsc').length,
            ).toEqual(platform.assets.length ** 2);
        }
    });

    it('should get all asset pairs for given network', () => {
        expect(getAssetPairs('ethereum').length).toEqual(
            PLATFORMS.reduce((a, c) => (a += c.assets.length ** 2), 0),
        );

        expect(getAssetPairs('bsc').length).toEqual(
            BSC_PLATFORMS.reduce((a, c) => (a += c.assets.length ** 2), 0),
        );
    });
});
