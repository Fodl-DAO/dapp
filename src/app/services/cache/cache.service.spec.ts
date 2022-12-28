import { TestBed } from '@angular/core/testing';

import { CacheService } from './cache.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigurationServiceMock } from '../configuration/configuration.service.mock';
import { CacheStorageService } from '../cache-storage/cache-storage.service';
import { PendingService } from '../pending/pending.service';

describe('CacheService', () => {
    let service: CacheService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ConfigurationService,
                    useClass: ConfigurationServiceMock,
                },
                {
                    provide: PendingService,
                },
                {
                    provide: CacheStorageService,
                },
            ],
        });
        service = TestBed.inject(CacheService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
