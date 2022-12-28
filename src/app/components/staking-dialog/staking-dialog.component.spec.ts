import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';

import {
    MatDialogModule,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LPService } from '../../services/lp/lp.service';
import { LPServiceMock } from '../../services/lp/lp.service.mock';

import { StakingService } from '../../services/staking/staking.service';
import { StakingServiceMock } from '../../services/staking/staking.service.mock';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { StakingDialogComponent } from './staking-dialog.component';

describe('StakingDialogComponent', async () => {
    let fixture: ComponentFixture<StakingDialogComponent>;
    let component: StakingDialogComponent;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [StakingDialogComponent],
                imports: [
                    MatDialogModule,
                    MatProgressSpinnerModule,
                    FormatValuePipeModule,
                ],
                providers: [
                    {
                        provide: MAT_DIALOG_DATA,
                        useValue: {},
                    },
                    {
                        provide: MatDialogRef,
                        useValue: {},
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
        fixture = TestBed.createComponent(StakingDialogComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });
});
