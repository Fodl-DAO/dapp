import { formatValue } from './formatValue';
import { isStableCoin } from './stableCoin';

export const isExchangeReverseRequired = (
    amount: number,
    sourceAsset: string,
    destinationAsset: string,
): boolean => {
    //TODO: Investigate if this logic is the same as: getTooltipAssetSymbols
    if (!isStableCoin(sourceAsset) && isStableCoin(destinationAsset)) {
        return true;
    } else {
        return !isStableCoin(sourceAsset) && 1 / amount > amount;
    }
};

export const reverseExchangeRate = (
    amount: number,
    sourceAsset: string,
    destinationAsset: string,
): [number, string, string] => [1 / amount, destinationAsset, sourceAsset];

export const formatExchangeRate = (
    amount: number,
    sourceAsset: string,
    destinationAsset: string,
    format?: string,
): string => {
    if (isExchangeReverseRequired(amount, sourceAsset, destinationAsset)) {
        [amount, sourceAsset, destinationAsset] = reverseExchangeRate(
            amount,
            sourceAsset,
            destinationAsset,
        );
    }

    const formattedValue = formatValue(amount);

    switch (format) {
        case 'long':
            return `1 ${destinationAsset} = ${formattedValue} ${sourceAsset}`;

        case 'short':
            return formattedValue;

        case 'exchange':
            return `${sourceAsset}/${destinationAsset}`;

        case 'source':
            return sourceAsset;

        case 'sourceOnly':
            return `${formattedValue} ${sourceAsset}`;

        case 'destination':
            return destinationAsset;

        default:
            return `${formattedValue} ${sourceAsset}/${destinationAsset}`;
    }
};
