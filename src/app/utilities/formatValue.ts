import { numberWithCommas } from './numberWithCommas';

export const formatValue = (value: number): string => {
    const toFixedWithoutRound = (num: number, fixed: number): string => {
        const regExp = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
        return num.toFixed(fixed + 1).match(regExp)[0];
    };

    if (
        isNaN(value) ||
        !isFinite(value) ||
        value === null ||
        value === undefined
    ) {
        return '';
    }

    const absoluteValue = Math.abs(value);

    // Bigger than a thousand
    if (absoluteValue >= 1000) {
        const fixed = toFixedWithoutRound(value, 0);
        return numberWithCommas(fixed);
    }

    // Lower than a thousand
    if (absoluteValue >= 1 && absoluteValue < 1000) {
        const decimalPart = ((absoluteValue * 10) % 10) / 10;
        return decimalPart > -0.01 && decimalPart < 0
            ? toFixedWithoutRound(value, 0)
            : Number(toFixedWithoutRound(value, 2)).toString();
    }

    // Non integers
    if (absoluteValue > 0 && absoluteValue < 1) {
        const regExp = new RegExp(/^-?\d*\.?0*[1-9]{0,2}/);
        return absoluteValue <= 0.0000001 && absoluteValue > 0
            ? '0'
            : toFixedWithoutRound(value, 20).match(regExp)[0];
    }

    return value.toString();
};

export const formatNumber = (num: number) => {
    return parseFloat(formatValue(num).replace(',', ''));
};
