import { ASSET_WETH, PLATFORM_COMPOUND } from '../../constants/blockchain';

import { AssetAddressPipe } from './asset-address.pipe';

describe('AssetAddressPipe Pipe', () => {
    let pipe: AssetAddressPipe;

    beforeEach(() => {
        pipe = new AssetAddressPipe();
    });

    it('should get asset address', () => {
        expect(pipe.transform('WETH', PLATFORM_COMPOUND)).toBe(
            ASSET_WETH.address,
        );
    });
});
