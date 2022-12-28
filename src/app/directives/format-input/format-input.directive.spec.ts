import { FormatInputDirective } from './format-input.directive';

describe('FormatInputDirective', () => {
    it('should create an instance', () => {
        const elementRefMock = {
            nativeElement: document.createElement('input'),
        };
        const directive = new FormatInputDirective(elementRefMock);
        expect(directive).toBeTruthy();
    });
});
