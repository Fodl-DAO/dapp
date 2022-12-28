import { ASSET_DAI, ASSET_USDC, ASSET_WBTC } from '../../constants/blockchain';

import { AssetSymbolPipe } from './asset-symbol.pipe';

describe('AssetSymbol Pipe', () => {
    let pipe: AssetSymbolPipe;

    beforeEach(() => {
        pipe = new AssetSymbolPipe();
    });

    it('should get asset symbol', () => {
        expect(pipe.transform(ASSET_DAI.address)).toBe(ASSET_DAI.symbol);
        expect(pipe.transform(ASSET_USDC.address)).toBe(ASSET_USDC.symbol);
        expect(pipe.transform(ASSET_WBTC.address)).toBe(ASSET_WBTC.symbol);
    });
});
