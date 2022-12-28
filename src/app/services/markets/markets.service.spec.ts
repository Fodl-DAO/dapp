import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigurationServiceMock } from '../configuration/configuration.service.mock';
import { FoldingMarketsService } from '../folding/foldingMarkets/foldingMarkets.service';
import { FoldingMarketsServiceMock } from '../folding/foldingMarkets/foldingMarkets.service.mock';
import { FoldingRewardsService } from '../folding/foldingRewards/foldingRewards.service';
import { FoldingRewardsServiceMock } from '../folding/foldingRewards/foldingRewards.service.mock';

import { MarketsService } from './markets.service';

describe('MarketsService', () => {
    let service: MarketsService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [
                    MarketsService,
                    {
                        provide: ConfigurationService,
                        useClass: ConfigurationServiceMock,
                    },
                    {
                        provide: FoldingMarketsService,
                        useClass: FoldingMarketsServiceMock,
                    },
                    {
                        provide: FoldingRewardsService,
                        useClass: FoldingRewardsServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.get(FoldingRewardsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
