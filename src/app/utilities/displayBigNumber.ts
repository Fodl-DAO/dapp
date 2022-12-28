import { toFixedString } from './toFixedString';

import { numberWithCommas } from './numberWithCommas';

import { ethers } from 'ethers';

export const displayBigNumber = (
    value: ethers.BigNumber,
    decimals: number,
    precision = 6,
    format: boolean = false,
) => {
    if (!value) {
        return '0';
    }

    let parseBalance;

    try {
        parseBalance = ethers.utils.formatUnits(value, decimals);
    } catch (error: any) {
        console.error('Cannot parse bignumber value', value, error);
        return '0';
    }

    const fixed = toFixedString(parseBalance, precision);
    return format ? numberWithCommas(fixed) : fixed;
};
