import { BigNumber, ethers } from 'ethers';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

import { IPlatform } from './platform.interface';

export interface IMarket {
    assetAddress: string;
    assetDecimals: number;
    assetSymbol: string;
    platform: IPlatform;
    referencePrice: ethers.BigNumber;
    assetUsdValue: number; // This value is updated from time to time in order to refresh the price. All other values are only updated on refresh
    totalBorrowBigNumber: ethers.BigNumber;
    borrowAPR: number;
    totalSupplyBigNumber: ethers.BigNumber;
    supplyAPR: number;
    totalLiquidity: number;
    collateralFactor: number;
    liquidationFactor: number;
    rewardTokenAddress: string;
    rewardTokenSymbol: string;
    rewardTokenDecimals: number;
    borrowRewardsAPR?: number;
    supplyRewardsAPR?: number;
    walletBalance?: BigNumber;
    getAssetUsdValueObservable?: () => Observable<number>;
    updateAssetUsdValue?: () => Promise<void>;
}
export interface IFoldingMarket {
    supplyMarket: IMarket;
    borrowMarket: IMarket;
    maxLeverage: number;
}

export interface IFoldingMarketApr extends IFoldingMarket {
    marketMaxApr: number;
    marketMaxDistributionApr: number;
}
