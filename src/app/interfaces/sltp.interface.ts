export interface ISLTP {
    priceTarget: number;
    fixedReward: number;
    percentageReward: number;
    unwindFactor: number;
    isTakeProfit: boolean;
}

export type IPNLSettings = Array<ISLTP>;
