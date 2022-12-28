import { formatValue } from './formatValue';

describe('Format Value Utility', () => {
    it('should format value', () => {
        expect(formatValue(NaN)).toBe('');
        expect(formatValue(undefined)).toBe('');
        expect(formatValue(null)).toBe('');
        expect(formatValue(Infinity)).toBe('');
        expect(formatValue(-Infinity)).toBe('');

        expect(formatValue(1122312.456)).toBe('1,122,312');
        expect(formatValue(-1122312.456)).toBe('-1,122,312');

        expect(formatValue(1.7)).toBe('1.7');
        expect(formatValue(1.7012)).toBe('1.7');
        expect(formatValue(1.710000012)).toBe('1.71');

        expect(formatValue(12.34564)).toBe('12.34');
        expect(formatValue(-3.6125025939024002)).toBe('-3.61');

        expect(formatValue(0.123123412)).toBe('0.12');
        expect(formatValue(0.0001234)).toBe('0.00012');
        expect(formatValue(-0.0061)).toBe('-0.0061');

        expect(formatValue(0.00000000012)).toBe('0');
        expect(formatValue(-0.00000000012)).toBe('0');

        expect(formatValue(0.0000012)).toBe('0.0000012');
        expect(formatValue(-0.0000012)).toBe('-0.0000012');

        expect(formatValue(24.00000000012)).toBe('24');
        expect(formatValue(-24.00000000012)).toBe('-24');

        expect(formatValue(24.12)).toBe('24.12');
        expect(formatValue(6.0)).toBe('6');

        expect(formatValue(0.000005001)).toBe('0.000005');
    });
});
