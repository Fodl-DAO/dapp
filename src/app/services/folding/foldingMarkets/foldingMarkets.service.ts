import { Injectable } from '@angular/core';

import {
    LendingPlatformLens,
    LendingPlatformLens__factory,
} from '@0xb1/fodl-typechain';

import { IMarket } from '../../../interfaces/market.interface';
import { IAssetPlatform } from '../../../interfaces/platform.interface';

import { parseBigNumber } from '../../../utilities/bigNumber';

import { EthereumService } from '../../ethereum/ethereum.service';
import { GeckoPriceService } from '../../gecko-price/gecko-price.service';

import { FoldingMarket } from './FoldingMarket';

import { getSpotPriceFromOracle } from '@0xfodl/sdk';

@Injectable({
    providedIn: 'root',
})
export class FoldingMarketsService {
    lendingPlatformLens: LendingPlatformLens;

    constructor(
        private ethereumService: EthereumService,
        private geckoPriceService: GeckoPriceService,
    ) {}

    connect() {
        const lendingPlatformLens =
            this.ethereumService.getNetworkLendingLens();

        this.lendingPlatformLens = LendingPlatformLens__factory.connect(
            lendingPlatformLens,
            this.ethereumService.getBaseProvider(),
        );
    }

    async getMarketData(): Promise<IMarket[]> {
        this.connect();

        const network_platforms = this.ethereumService.getNetworkPlatforms();

        const platformAssets: IAssetPlatform[] = network_platforms.flatMap(
            (platform) =>
                platform.assets.map((asset) => ({
                    asset: asset.address,
                    platform: platform.address,
                    platformName: platform.name,
                })),
        );

        try {
            return this.queryMarketData(platformAssets);
        } catch (err) {
            console.error('Getting assets metadata and prices', err);
            return [];
        }
    }

    async queryMarketData(
        platformAssets: IAssetPlatform[],
    ): Promise<IMarket[]> {
        const assetsMetadata = (
            await this.lendingPlatformLens.callStatic.getAssetMetadata(
                platformAssets.map((platformAsset) => platformAsset.platform),
                platformAssets.map((platformAsset) => platformAsset.asset),
            )
        ).map((assetMetadata, index) => ({
            ...assetMetadata,
            totalBorrowBigNumber: assetMetadata.totalBorrow,
            totalSupplyBigNumber: assetMetadata.totalSupply,
            borrowAPR: parseBigNumber(assetMetadata.borrowAPR),
            collateralFactor: parseBigNumber(assetMetadata.collateralFactor),
            liquidationFactor: parseBigNumber(assetMetadata.liquidationFactor),
            supplyAPR: parseBigNumber(assetMetadata.supplyAPR),
            totalLiquidity: parseBigNumber(
                assetMetadata.totalLiquidity,
                assetMetadata.assetDecimals,
            ),
            platform: {
                address: platformAssets[index].platform,
                name: platformAssets[index].platformName,
            },
        }));
        const usdcAddress =
            this.ethereumService.getNetworkSpecificUSDC().address;

        const updateUsdValue = async (
            assetAddress: string,
        ): Promise<number> => {
            if (assetAddress.toLowerCase() !== usdcAddress.toLowerCase()) {
                return (
                    await getSpotPriceFromOracle(
                        this.ethereumService.getBaseProvider().network.chainId,
                        usdcAddress,
                        assetAddress,
                        this.ethereumService.getBaseProvider(),
                    )
                ).float;
            }
            return 1;
        };

        return await Promise.all(
            assetsMetadata.map(async (assetMetadata) => {
                const assetUsdValue = await updateUsdValue(
                    assetMetadata.assetAddress,
                );

                let borrowRewardsAPR = 0;
                let supplyRewardsAPR = 0;

                const isAave = assetMetadata.platform.name
                    .toLowerCase()
                    .includes('aave');

                if (!isAave) {
                    const rewardTokenUsdPrice = await this.geckoPriceService
                        .getERC20Price(
                            assetMetadata.rewardTokenAddress,
                            this.ethereumService.getNetwork(),
                        )
                        .toPromise();

                    borrowRewardsAPR =
                        (parseBigNumber(
                            assetMetadata.estimatedBorrowRewardsPerYear,
                            assetMetadata.rewardTokenDecimals,
                        ) *
                            rewardTokenUsdPrice) /
                            (parseBigNumber(
                                assetMetadata.totalBorrowBigNumber,
                                assetMetadata.assetDecimals,
                            ) *
                                assetUsdValue) || 0;

                    supplyRewardsAPR =
                        (parseBigNumber(
                            assetMetadata.estimatedSupplyRewardsPerYear,
                            assetMetadata.rewardTokenDecimals,
                        ) *
                            rewardTokenUsdPrice) /
                            (parseBigNumber(
                                assetMetadata.totalSupplyBigNumber,
                                assetMetadata.assetDecimals,
                            ) *
                                assetUsdValue) || 0;
                }

                return new FoldingMarket(
                    {
                        ...assetMetadata,
                        assetUsdValue,
                        borrowRewardsAPR,
                        supplyRewardsAPR,
                    },
                    updateUsdValue,
                );
            }),
        );
    }
}
