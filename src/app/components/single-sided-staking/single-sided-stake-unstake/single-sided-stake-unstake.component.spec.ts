import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSidedStakeUnstakeComponent } from './single-sided-stake-unstake.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SingleSidedStakingService } from '../../../services/single-sided-staking/single-sided-staking.service';
import { SingleSidedStakingServiceMock } from '../../../services/single-sided-staking/single-sided-staking.service.mock';
import { FormatValuePipeModule } from '../../../pipes/format-value/format-value.pipe.module';

describe('SingleSidedStakeUnstakeComponent', () => {
    let component: SingleSidedStakeUnstakeComponent;
    let fixture: ComponentFixture<SingleSidedStakeUnstakeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SingleSidedStakeUnstakeComponent],
            imports: [
                MatButtonModule,
                MatIconModule,
                MatDialogModule,
                FormatValuePipeModule,
            ],
            providers: [
                {
                    provide: SingleSidedStakingService,
                    useClass: SingleSidedStakingServiceMock,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SingleSidedStakeUnstakeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
