import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigurationServiceMock } from '../configuration/configuration.service.mock';
import { EthereumService } from '../ethereum/ethereum.service';
import { EthereumServiceMock } from '../ethereum/ethereum.service.mock';
import { GeckoPriceService } from '../gecko-price/gecko-price.service';
import { GeckoPriceServiceMock } from '../gecko-price/gecko-price.service.mock';
import { StakingService } from '../staking/staking.service';
import { StakingServiceMock } from '../staking/staking.service.mock';

import { LPService } from './lp.service';

describe('LPService', () => {
    let service: LPService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [
                    LPService,
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
                    {
                        provide: StakingService,
                        useClass: StakingServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.get(LPService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
