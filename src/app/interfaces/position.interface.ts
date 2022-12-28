import { ethers } from 'ethers';

import { IFoldingMarket, IMarket } from './market.interface';

export interface IPosition {
    positionAddress: string;
    platformAddress: string;
    supplyTokenAddress: string;
    borrowTokenAddress: string;
    supplyAmount?: number;
    supplyAmountBigNumber: ethers.BigNumber;
    borrowAmount?: number;
    borrowAmountBigNumber: ethers.BigNumber;
    collateralUsageFactor: number;
    supplyAmountUsd?: number;
    borrowAmountUsd?: number;
    principalValueUsd?: number;
    principalValue: number;
    principalValueBigNumber: ethers.BigNumber;
    positionValueUsd?: number;
    positionValue: number;
    positionValueBigNumber: ethers.BigNumber;
    leverage?: number;
    leverageBigNumber?: ethers.BigNumber;
    apr?: number;
    foldingMarket?: IFoldingMarket;
    borrowMarket?: IMarket;
    supplyMarket?: IMarket;
    pnl?: number;
    rewardsPnl?: number;
    currentPrice?: number;
}
