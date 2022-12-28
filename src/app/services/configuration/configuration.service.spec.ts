import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ConfigurationService } from './configuration.service';

describe('ConfigurationService', () => {
    let service: ConfigurationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ConfigurationService],
        });

        service = TestBed.inject(ConfigurationService);
    });

    it('should load config', () => {
        expect(service).toBeTruthy();
    });
});
