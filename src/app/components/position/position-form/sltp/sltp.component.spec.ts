import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';

import { ConfigurationService } from '../../../../services/configuration/configuration.service';
import { ConfigurationServiceMock } from '../../../../services/configuration/configuration.service.mock';
import { EthereumService } from '../../../../services/ethereum/ethereum.service';
import { EthereumServiceMock } from '../../../../services/ethereum/ethereum.service.mock';
import { FoldingService } from '../../../../services/folding/folding.service';
import { FoldingServiceMock } from '../../../../services/folding/folding.service.mock';
import { MarketsService } from '../../../../services/markets/markets.service';
import { MarketsServiceMock } from '../../../../services/markets/markets.service.mock';
import { SettingsService } from '../../../../services/settings/settings.service';

import { SLTPComponent } from './sltp.component';

describe('SLTPComponent', async () => {
    let fixture: ComponentFixture<SLTPComponent>;
    let component: SLTPComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [SLTPComponent],
                imports: [
                    RouterTestingModule,
                    MatDialogModule,
                    MatProgressSpinnerModule,
                ],
                providers: [
                    SettingsService,
                    {
                        provide: ConfigurationService,
                        useClass: ConfigurationServiceMock,
                    },
                    {
                        provide: EthereumService,
                        useClass: EthereumServiceMock,
                    },
                    {
                        provide: FoldingService,
                        useClass: FoldingServiceMock,
                    },
                    {
                        provide: MarketsService,
                        useClass: MarketsServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SLTPComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
