export interface IPlatform {
    address: string;
    name: string;
}

export interface IAssetPlatform {
    asset: string;
    platform: string;
    platformName: string;
}

export interface IPlatformWithAssets {
    name: string;
    address: string;
    assets: IHardcodedAsset[];
}

export interface IHardcodedAsset {
    id: string;
    address: string;
    symbol: string;
    name: string;
}
