import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FoldingRewardsService } from '../../services/folding/foldingRewards/foldingRewards.service';
import { FoldingRewardsServiceMock } from '../../services/folding/foldingRewards/foldingRewards.service.mock';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { ConfigurationServiceMock } from '../../services/configuration/configuration.service.mock';
import { EthereumService } from '../../services/ethereum/ethereum.service';
import { EthereumServiceMock } from '../../services/ethereum/ethereum.service.mock';

import { RewardsComponent } from './rewards.component';

describe('RewardsComponent', async () => {
    let fixture: ComponentFixture<RewardsComponent>;
    let component: RewardsComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [RewardsComponent],
                imports: [
                    FormsModule,
                    MatButtonModule,
                    MatDialogModule,
                    MatIconModule,
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
                        provide: FoldingRewardsService,
                        useClass: FoldingRewardsServiceMock,
                    },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(RewardsComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
