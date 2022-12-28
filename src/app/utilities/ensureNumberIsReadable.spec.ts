import { ensureNumberIsReadable } from './ensureNumberIsReadable';

describe('Ensure Number Is Readable Utility', () => {
    it('should ensure number is readable', () => {
        expect(ensureNumberIsReadable(1)).toBe(1);
        expect(ensureNumberIsReadable(0.0001)).not.toBeDefined;
        expect(ensureNumberIsReadable(0.0001, 4)).toBe(0.0001);
        expect(ensureNumberIsReadable(0.0000001, 4)).not.toBeDefined;
    });
});
