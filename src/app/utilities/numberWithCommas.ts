export const numberWithCommas = (val: number | string): string => {
    const isNumericStringValid = (str: string) => {
        return !isNaN(str as any) && !isNaN(parseFloat(str));
    };

    if (!val || (typeof val === 'string' && !isNumericStringValid(val))) {
        return '';
    }

    if (typeof val === 'number') {
        val = val.toString();
    }

    // Divide number to two parts: integer & decimal
    const parts = val.split('.');
    // Find 3 digits in couple
    const thousandSearch = new RegExp(/\B(?=(\d{3})+(?!\d))/g);

    return (
        // Set comma with search & if decimal part exist then add a dot
        parts[0].replace(thousandSearch, ',') + (parts[1] ? '.' + parts[1] : '')
    );
};
