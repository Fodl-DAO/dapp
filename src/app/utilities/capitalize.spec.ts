import { capitalizeFirstLetter } from './capitalize';

describe('Capitalize Utility', () => {
    it('should capitalize first letter', () => {
        expect(capitalizeFirstLetter('some text')).toBe('Some text');
    });
});
