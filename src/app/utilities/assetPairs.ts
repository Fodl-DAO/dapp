import { IAssetPair } from '../interfaces/assetPair.interface';

import {
    BSC_PLATFORMS,
    PLATFORMS,
    POLYGON_PLATFORMS,
} from '../constants/blockchain';

export const getNetworkPlatforms = (network: string) => {
    switch (network) {
        case 'bsc':
            return BSC_PLATFORMS;

        case 'polygon':
            return POLYGON_PLATFORMS;

        default:
            return PLATFORMS;
    }
};

export const getPlatformAssetPairs = (
    platformAddress: string,
    network: string,
): IAssetPair[] => {
    const platform = getNetworkPlatforms(network).find(
        (platform) =>
            platform.address.toLowerCase() === platformAddress.toLowerCase(),
    );

    let pairs = [];

    for (const supplyAsset of platform.assets) {
        for (const borrowAsset of platform.assets) {
            pairs.push({
                supplyAsset: {
                    name: supplyAsset.name,
                    address: supplyAsset.address,
                    platformAddress: platform.address,
                    platformName: platform.name,
                },
                borrowAsset: {
                    name: borrowAsset.name,
                    address: borrowAsset.address,
                    platformAddress: platform.address,
                    platformName: platform.name,
                },
            });
        }
    }

    return pairs;
};

export const getAssetPairs = (network = 'ethereum'): IAssetPair[] =>
    getNetworkPlatforms(network).flatMap((platform) =>
        getPlatformAssetPairs(platform.address, network),
    );
