import { HOURS_IN_YEAR } from '../constants/commons';

import { IMarket } from '../interfaces/market.interface';

export const aprToApy = (apr: number): number =>
    (Math.pow(1 + apr / 100 / 365, 365) - 1) * 100;

export const getMarketApr = (
    leverage: number,
    supplyMarket: IMarket,
    borrowMarket: IMarket,
    timeframe: number = HOURS_IN_YEAR,
): number => {
    return (
        (((leverage + 1) * supplyMarket.supplyAPR -
            leverage * borrowMarket.borrowAPR) *
            100 *
            timeframe) /
        HOURS_IN_YEAR
    );
};

export const getMarketDistributionApr = (
    leverage: number,
    supplyMarket: IMarket,
    borrowMarket: IMarket,
    timeframe: number = HOURS_IN_YEAR,
): number => {
    return (
        (((leverage + 1) * supplyMarket.supplyRewardsAPR -
            leverage * -borrowMarket.borrowRewardsAPR) *
            100 *
            timeframe) /
        HOURS_IN_YEAR
    );
};
