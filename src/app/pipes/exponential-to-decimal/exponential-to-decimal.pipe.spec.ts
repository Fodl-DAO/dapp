import { ExponentialToDecimalPipe } from './exponential-to-decimal.pipe';

describe('Exponential To Decimal Pipe', () => {
    let pipe: ExponentialToDecimalPipe;

    beforeEach(() => {
        pipe = new ExponentialToDecimalPipe();
    });

    it('should return a formatted value', () => {
        expect(pipe.transform(1500000000000)).toBe('$1,500,000,000,000');
    });
});
