export const ensureNumberIsReadable = (number: number, decimals = 2) =>
    Math.abs(parseFloat(number.toFixed(decimals))) > 0 &&
    Math.abs(number) !== Infinity
        ? number
        : undefined;
