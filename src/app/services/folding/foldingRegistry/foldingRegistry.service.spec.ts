import { TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigurationService } from '../../configuration/configuration.service';
import { ConfigurationServiceMock } from '../../configuration/configuration.service.mock';
import { EthereumService } from '../../ethereum/ethereum.service';
import { EthereumServiceMock } from '../../ethereum/ethereum.service.mock';

import { FoldingRegistryService } from './foldingRegistry.service';

describe('FoldingRegistryService', () => {
    let service: FoldingRegistryService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                providers: [
                    FoldingRegistryService,
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

        service = TestBed.get(FoldingRegistryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
