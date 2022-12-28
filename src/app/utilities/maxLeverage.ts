import { MAX_LEVERAGE_MODIFIER } from '../constants/blockchain';

export const getMaxLeverage = (collateralFactor: number): number => {
    return parseFloat(
        (
            (collateralFactor / (1 - collateralFactor)) *
            MAX_LEVERAGE_MODIFIER
        ).toFixed(2),
    );
};
