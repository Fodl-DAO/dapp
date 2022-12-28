import { TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigurationServiceMock } from '../configuration/configuration.service.mock';

import { ERC20Service } from '../erc20/erc20.service';
import { ERC20ServiceMock } from '../erc20/erc20.service.mock';

import { EthereumService } from '../ethereum/ethereum.service';
import { EthereumServiceMock } from '../ethereum/ethereum.service.mock';

import { FoldingMarketsService } from './foldingMarkets/foldingMarkets.service';
import { FoldingMarketsServiceMock } from './foldingMarkets/foldingMarkets.service.mock';

import { FoldingPositionsService } from './foldingPositions/foldingPositions.service';
import { FoldingPositionsServiceMock } from './foldingPositions/foldingPositions.service.mock';

import { FoldingRegistryService } from './foldingRegistry/foldingRegistry.service';
import { FoldingRegistryServiceMock } from './foldingRegistry/foldingRegistry.service.mock';

import { FoldingRewardsService } from './foldingRewards/foldingRewards.service';
import { FoldingRewardsServiceMock } from './foldingRewards/foldingRewards.service.mock';

import { GeckoPriceService } from '../gecko-price/gecko-price.service';
import { GeckoPriceServiceMock } from '../gecko-price/gecko-price.service.mock';

import { MarketsService } from '../markets/markets.service';
import { MarketsServiceMock } from '../markets/markets.service.mock';

import { FoldingService } from './folding.service';

describe('FoldingService', () => {
    let service: FoldingService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                providers: [
                    FoldingService,
                    {
                        provide: ConfigurationService,
                        useClass: ConfigurationServiceMock,
                    },
                    {
                        provide: ERC20Service,
                        useClass: ERC20ServiceMock,
                    },
                    {
                        provide: EthereumService,
                        useClass: EthereumServiceMock,
                    },
                    {
                        provide: FoldingRegistryService,
                        useClass: FoldingRegistryServiceMock,
                    },
                    {
                        provide: FoldingMarketsService,
                        useClass: FoldingMarketsServiceMock,
                    },
                    {
                        provide: FoldingPositionsService,
                        useClass: FoldingPositionsServiceMock,
                    },
                    {
                        provide: FoldingRewardsService,
                        useClass: FoldingRewardsServiceMock,
                    },
                    {
                        provide: GeckoPriceService,
                        useClass: GeckoPriceServiceMock,
                    },
                    {
                        provide: MarketsService,
                        useClass: MarketsServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.get(FoldingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
