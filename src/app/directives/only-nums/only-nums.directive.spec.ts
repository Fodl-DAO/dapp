import { OnlyNumsDirective } from './only-nums.directive';

describe('OnlyNumsDirective', () => {
    it('should create an instance', () => {
        const elementRefMock = {
            nativeElement: document.createElement('input'),
        };
        const directive = new OnlyNumsDirective(elementRefMock);
        expect(directive).toBeTruthy();
    });
});
