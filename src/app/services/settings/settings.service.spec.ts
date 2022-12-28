import { TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigurationService } from '../configuration/configuration.service';
import { ConfigurationServiceMock } from '../configuration/configuration.service.mock';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
    let service: SettingsService;
    let configuration: ConfigurationService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                providers: [
                    SettingsService,
                    {
                        provide: ConfigurationService,
                        useClass: ConfigurationServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});

        service = TestBed.get(SettingsService);
        configuration = TestBed.get(ConfigurationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
