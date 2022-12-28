import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigurationService } from '../../configuration/configuration.service';
import { ConfigurationServiceMock } from '../../configuration/configuration.service.mock';
import { EthereumService } from '../../ethereum/ethereum.service';
import { EthereumServiceMock } from '../../ethereum/ethereum.service.mock';
import { GeckoPriceService } from '../../gecko-price/gecko-price.service';
import { GeckoPriceServiceMock } from '../../gecko-price/gecko-price.service.mock';

import { FoldingMarketsService } from './foldingMarkets.service';

describe('FoldingMarketsService', () => {
    let service: FoldingMarketsService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [
                    FoldingMarketsService,
                    {
                        provide: ConfigurationService,
                        useClass: ConfigurationServiceMock,
                    },
                    {
                        provide: EthereumService,
                        useClass: EthereumServiceMock,
                    },
                    {
                        provide: GeckoPriceService,
                        useClass: GeckoPriceServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.get(FoldingMarketsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
