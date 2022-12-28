import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { ConfigurationServiceMock } from '../../services/configuration/configuration.service.mock';
import { EthereumService } from '../../services/ethereum/ethereum.service';
import { EthereumServiceMock } from '../../services/ethereum/ethereum.service.mock';
import { GeckoPriceService } from '../../services/gecko-price/gecko-price.service';
import { GeckoPriceServiceMock } from '../../services/gecko-price/gecko-price.service.mock';
import { LPService } from '../../services/lp/lp.service';
import { LPServiceMock } from '../../services/lp/lp.service.mock';
import { StakingService } from '../../services/staking/staking.service';
import { StakingServiceMock } from '../../services/staking/staking.service.mock';
import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { LpInfoComponent } from './lp-info.component';

describe('LpInfoComponent', async () => {
    let fixture: ComponentFixture<LpInfoComponent>;
    let component: LpInfoComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [LpInfoComponent],
                imports: [
                    MatDialogModule,
                    MatProgressSpinnerModule,
                    FormatValuePipeModule,
                ],
                providers: [
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
                        provide: LPService,
                        useClass: LPServiceMock,
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
        fixture = TestBed.createComponent(LpInfoComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
