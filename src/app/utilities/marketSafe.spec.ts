import {
    ASSET_DAI,
    ASSET_FODL,
    ASSET_USDC,
    ASSET_USDT,
} from '../constants/blockchain';

import { isMarketSafe } from './marketSafe';

describe('Market Safe Utility', () => {
    it('should check that market is safe when 2 assets are the same', () => {
        expect(isMarketSafe(ASSET_FODL.address, ASSET_FODL.address)).toBeTrue();
        expect(isMarketSafe(ASSET_USDC.address, ASSET_USDC.address)).toBeTrue();
    });

    it('should check that market is safe when 2 assets are stable coins', () => {
        expect(isMarketSafe(ASSET_USDC.address, ASSET_DAI.address)).toBeTrue();
        expect(isMarketSafe(ASSET_USDC.address, ASSET_USDT.address)).toBeTrue();
    });

    it('should check that market is not safe when 2 assets are not the same or stable coins', () => {
        expect(
            isMarketSafe(ASSET_FODL.address, ASSET_USDT.address),
        ).toBeFalse();
    });
});
