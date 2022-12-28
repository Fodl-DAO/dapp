import { numberWithCommas } from './numberWithCommas';

describe('Number with commas utility', () => {
    it('should format number (or numeric string) to string with thousand separator', () => {
        expect(numberWithCommas(NaN)).toBe('');
        expect(numberWithCommas(10000)).toBe('10,000');
        expect(numberWithCommas(1000.2323232)).toBe('1,000.2323232');
        expect(numberWithCommas(1000.003)).toBe('1,000.003');
        expect(numberWithCommas('')).toBe('');
        expect(numberWithCommas('0.23676767')).toBe('0.23676767');
        expect(numberWithCommas('sfsafwe')).toBe('');
        expect(numberWithCommas('1000')).toBe('1,000');
        expect(numberWithCommas('100000.23232323')).toBe('100,000.23232323');
        expect(numberWithCommas('666777888.23')).toBe('666,777,888.23');
    });
});
