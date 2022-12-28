import { TestBed } from '@angular/core/testing';

import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigurationServiceMock } from '../configuration/configuration.service.mock';

import { EthereumService } from './ethereum.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('EthereumService', () => {
    let service: EthereumService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                {
                    provide: ConfigurationService,
                    useClass: ConfigurationServiceMock,
                },
            ],
        });
        service = TestBed.inject(EthereumService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
