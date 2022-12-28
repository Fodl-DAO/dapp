const MARKETDATA = require('../../../../fixtures/market.json');

export class FoldingMarketsServiceMock {
    getMarketData = async () => [MARKETDATA];
    getFodlDistributionPerBlock = async () => [];
}
