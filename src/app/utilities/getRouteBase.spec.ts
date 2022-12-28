import { getRouteBase } from './getRouteBase';

describe('Route Base Utility', () => {
    it('should get base', () => {
        expect(
            getRouteBase('/new-position;platform=compound;supply=weth'),
        ).toBe('/new-position');

        expect(getRouteBase('/view-position')).toBe('/view-position');
    });
});
