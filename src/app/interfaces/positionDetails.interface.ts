export interface IPositionDetails {
    principalValue: number;
    principalValueUsd: number;
    positionValue: number;
    positionValueUsd: number;
    pnl: number;
    executionPrice: number;
    supplyAmount: number;
    supplyAmountUsd: number;
    borrowAmount: number;
    borrowAmountUsd: number;
    borrowLimitUsage: number;
    nativeApr: number;
    apr: number;
    distributionApr: number;
}
