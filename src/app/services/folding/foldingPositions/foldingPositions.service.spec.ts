import { TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigurationService } from '../../configuration/configuration.service';
import { ConfigurationServiceMock } from '../../configuration/configuration.service.mock';
import { ERC20Service } from '../../erc20/erc20.service';
import { ERC20ServiceMock } from '../../erc20/erc20.service.mock';
import { EthereumService } from '../../ethereum/ethereum.service';
import { EthereumServiceMock } from '../../ethereum/ethereum.service.mock';
import { FoldingRegistryService } from '../foldingRegistry/foldingRegistry.service';
import { FoldingMarketsService } from '../foldingMarkets/foldingMarkets.service';
import { FoldingMarketsServiceMock } from '../foldingMarkets/foldingMarkets.service.mock';
import { GeckoPriceService } from '../../gecko-price/gecko-price.service';
import { GeckoPriceServiceMock } from '../../gecko-price/gecko-price.service.mock';
import { SettingsService } from '../../settings/settings.service';

import { FoldingPositionsService } from './foldingPositions.service';

describe('FoldingPositionsService', () => {
    let service: FoldingPositionsService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                providers: [
                    FoldingPositionsService,
                    FoldingRegistryService,
                    SettingsService,
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
                        provide: GeckoPriceService,
                        useClass: GeckoPriceServiceMock,
                    },
                    {
                        provide: FoldingMarketsService,
                        useClass: FoldingMarketsServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.get(FoldingPositionsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
