import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigurationService } from '../../configuration/configuration.service';
import { ConfigurationServiceMock } from '../../configuration/configuration.service.mock';
import { EthereumService } from '../../ethereum/ethereum.service';
import { EthereumServiceMock } from '../../ethereum/ethereum.service.mock';

import { FoldingRewardsService } from './foldingRewards.service';

describe('FoldingRewardsService', () => {
    let service: FoldingRewardsService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [
                    FoldingRewardsService,
                    {
                        provide: ConfigurationService,
                        useClass: ConfigurationServiceMock,
                    },
                    {
                        provide: EthereumService,
                        useClass: EthereumServiceMock,
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
