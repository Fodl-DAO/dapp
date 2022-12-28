import {
    ASSETS,
    BSC_ASSETS,
    BSC_PLATFORMS,
    ETH_ADDRESS,
    PLATFORMS,
    POLYGON_ASSETS,
    POLYGON_PLATFORMS,
    WETH_ADDRESS,
    ZERO_ADDRESS,
} from '../constants/blockchain';

export const isTheSameAsset = (asset1: string, asset2: string): boolean =>
    asset1.toLowerCase() === asset2.toLowerCase() ||
    (asset1.toLowerCase() === ETH_ADDRESS &&
        asset2.toLowerCase() === WETH_ADDRESS) ||
    (asset1.toLowerCase() === WETH_ADDRESS &&
        asset2.toLowerCase() === ETH_ADDRESS);

export const getAssetSymbol = (address: string): string =>
    address && address !== ZERO_ADDRESS
        ? [...ASSETS, ...BSC_ASSETS, ...POLYGON_ASSETS].find(
              (asset) => asset.address.toLowerCase() === address.toLowerCase(),
          )?.symbol
        : '';

export const getAssetName = (address: string): string =>
    address && address !== ZERO_ADDRESS
        ? [...ASSETS, ...BSC_ASSETS, ...POLYGON_ASSETS].find(
              (asset) => asset.address.toLowerCase() === address.toLowerCase(),
          ).name
        : '';

export const getAssetAddress = (
    symbol: string,
    platformAddress: string,
): string =>
    [...PLATFORMS, ...BSC_PLATFORMS, ...POLYGON_PLATFORMS]
        .find(
            (platform) =>
                platform.address.toLowerCase() ===
                platformAddress.toLowerCase(),
        )
        .assets.find(
            (asset) => asset.symbol.toLowerCase() === symbol.toLowerCase(),
        ).address;
