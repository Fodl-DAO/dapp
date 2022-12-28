import { FormatExchangeRatePipe } from './format-exchange-rate.pipe';

describe('FormatExchangeRate Pipe', () => {
    let pipe: FormatExchangeRatePipe;

    beforeEach(() => {
        pipe = new FormatExchangeRatePipe();
    });

    it('should return a formatted value', () => {
        expect(pipe.transform(1, 'WETH', 'WBTC')).toBe('1 WETH/WBTC');

        expect(pipe.transform(1, 'WETH', 'WBTC', 'long')).toBe(
            '1 WBTC = 1 WETH',
        );
    });
});
