export const toFixedString = (value: string, precision: number = 6): string => {
    const isNumericStringValid = (str: string) => {
        return !isNaN(str as any) && !isNaN(parseFloat(str));
    };

    if (!value || !isNumericStringValid(value)) {
        console.error('Input value does not exist or is invalid!');
        return '';
    }

    const dotIndex = value.indexOf('.');

    if (dotIndex) {
        return value
            .slice(0, dotIndex + 1 + precision) // Cut to selected precision
            .replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1'); // Remove trailing zeros
    }

    return value;
};
