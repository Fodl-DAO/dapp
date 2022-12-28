import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigurationServiceMock } from '../configuration/configuration.service.mock';
import { ERC20Service } from '../erc20/erc20.service';
import { ERC20ServiceMock } from '../erc20/erc20.service.mock';
import { EthereumService } from '../ethereum/ethereum.service';
import { EthereumServiceMock } from '../ethereum/ethereum.service.mock';
import { GeckoPriceService } from '../gecko-price/gecko-price.service';
import { GeckoPriceServiceMock } from '../gecko-price/gecko-price.service.mock';

import { SingleSidedStakingService } from './single-sided-staking.service';

describe('SingleSidedStakingService', () => {
    let service: SingleSidedStakingService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [
                    SingleSidedStakingService,
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
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.get(SingleSidedStakingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
