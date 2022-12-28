import { isStableCoin } from './stableCoin';

describe('Stable Coin Utility', () => {
    it('should check asset as stable by symbol', () => {
        expect(isStableCoin('DAI')).toBeTrue();
        expect(isStableCoin('USDC')).toBeTrue();
        expect(isStableCoin('USDT')).toBeTrue();
    });

    it('should check asset as not stable by symbol', () => {
        expect(isStableCoin('WETH')).toBeFalse();
        expect(isStableCoin('WBTC')).toBeFalse();
        expect(isStableCoin('LINK')).toBeFalse();
    });

    it('should check asset as stable by address', () => {
        expect(
            isStableCoin('0x6b175474e89094c44da98b954eedeac495271d0f'),
        ).toBeTrue();
        expect(
            isStableCoin('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
        ).toBeTrue();
        expect(
            isStableCoin('0xdac17f958d2ee523a2206206994597c13d831ec7'),
        ).toBeTrue();
    });

    it('should check asset as not stable by address', () => {
        expect(
            isStableCoin('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
        ).toBeFalse();
        expect(
            isStableCoin('0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'),
        ).toBeFalse();
        expect(
            isStableCoin('0x514910771af9ca656af840dff83e8264ecf986ca'),
        ).toBeFalse();
    });
});
