import { formatExchangeRate } from './formatExchangeRate';

describe('Format Exchange Rate Utility', () => {
    it('should exchange rate', () => {
        expect(formatExchangeRate(1, 'WETH', 'WBTC')).toBe('1 WETH/WBTC');

        expect(formatExchangeRate(0.1, 'WETH', 'WBTC')).toBe('10 WBTC/WETH');

        expect(formatExchangeRate(0.1, 'WETH', 'WBTC', 'long')).toBe(
            '1 WETH = 10 WBTC',
        );

        expect(formatExchangeRate(0.1, 'WETH', 'WBTC', 'short')).toBe('10');

        expect(formatExchangeRate(0.1, 'WETH', 'WBTC', 'exchange')).toBe(
            'WBTC/WETH',
        );

        expect(formatExchangeRate(0.1, 'WETH', 'WBTC', 'source')).toBe('WBTC');

        expect(formatExchangeRate(0.1, 'WETH', 'WBTC', 'sourceOnly')).toBe(
            '10 WBTC',
        );

        expect(formatExchangeRate(0.1, 'WETH', 'WBTC', 'destination')).toBe(
            'WETH',
        );

        expect(formatExchangeRate(0.1, 'BAT', 'USDC', 'long')).toBe(
            '1 BAT = 10 USDC',
        );

        expect(formatExchangeRate(0.5, 'USDC', 'BAT', 'long')).toBe(
            '1 BAT = 0.5 USDC',
        );
    });
});
