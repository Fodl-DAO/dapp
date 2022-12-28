import { toFixedString } from './toFixedString';

describe('ToFixedString Utility', () => {
    it('should format numeric string', () => {
        expect(toFixedString('2323sdf1')).toBe('');
        expect(toFixedString('12.234asds')).toBe('');

        expect(toFixedString('0.0')).toBe('0');
        expect(toFixedString('0.000000000')).toBe('0');

        expect(toFixedString('200.00')).toBe('200');
        expect(toFixedString('344.00000000000')).toBe('344');

        expect(toFixedString('166.1234567890')).toBe('166.123456');
        expect(toFixedString('781.1234567890')).toBe('781.123456');

        expect(toFixedString('781.1234000000')).toBe('781.1234');
        expect(toFixedString('781.5461200000')).toBe('781.54612');

        expect(toFixedString('781.1000001111')).toBe('781.1');
        expect(toFixedString('781.560000003442')).toBe('781.56');

        expect(toFixedString('781.560034232345')).toBe('781.560034');
        expect(toFixedString('781.560010003442')).toBe('781.56001');
    });
});
