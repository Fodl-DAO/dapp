import { extractAssetFromMarket } from './extractAssetFromMarket';

const MARKETDATA = require('../../fixtures/market.json');

describe('Convert Market Asset Utility', () => {
    it('should convert folding market to market asset', async () => {
        expect(await extractAssetFromMarket(MARKETDATA)).toEqual({
            name: 'assetSymbol',
            address: 'assetAddress',
            decimals: 18,
            platformAddress: 'address',
            platformName: 'name',
        });
    });
});
