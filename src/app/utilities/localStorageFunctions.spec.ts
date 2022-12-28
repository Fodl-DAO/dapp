import {
    saveToLocalStorage,
    getFromLocalStorage,
} from './localStorageFunctions';

describe('Local Storage Functions', () => {
    it('Save to Local Storage', () => {
        window.localStorage.setItem = jasmine.createSpy();
        saveToLocalStorage('test', 'test2');
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
            'test',
            'test2',
        );
    });
    it('Get from Local Storage', () => {
        window.localStorage.getItem = jasmine.createSpy();
        getFromLocalStorage('test');
        expect(window.localStorage.getItem).toHaveBeenCalledWith('test');
    });
});
