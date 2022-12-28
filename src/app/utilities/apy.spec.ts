import { aprToApy } from './apy';

describe('APR to APY conversion utility', () => {
    it('convert apr to apy', () => {
        expect(Math.floor(aprToApy(66.6))).toBe(94);

        expect(Math.floor(aprToApy(100))).toBe(171);
    });
});
