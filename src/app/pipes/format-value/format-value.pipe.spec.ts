import { FormatValuePipe } from './format-value.pipe';

describe('FormatValue Pipe', () => {
    let pipe: FormatValuePipe;

    beforeEach(() => {
        pipe = new FormatValuePipe();
    });

    it('should return a formatted value', () => {
        expect(pipe.transform(1500000000000)).toBe('1,500,000,000,000');
    });
});
