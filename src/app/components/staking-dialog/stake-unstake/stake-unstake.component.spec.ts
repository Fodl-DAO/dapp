import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeUnstakeComponent } from './stake-unstake.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormatValuePipeModule } from '../../../pipes/format-value/format-value.pipe.module';

import { EthereumService } from '../../../services/ethereum/ethereum.service';
import { EthereumServiceMock } from '../../../services/ethereum/ethereum.service.mock';

import { StakingService } from '../../../services/staking/staking.service';
import { StakingServiceMock } from '../../../services/staking/staking.service.mock';

import { LPService } from '../../../services/lp/lp.service';
import { LPServiceMock } from '../../../services/lp/lp.service.mock';

describe('StakeUnstakeComponent', () => {
    let component: StakeUnstakeComponent;
    let fixture: ComponentFixture<StakeUnstakeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StakeUnstakeComponent],
            imports: [MatButtonModule, MatDialogModule, FormatValuePipeModule],
            providers: [
                {
                    provide: EthereumService,
                    useClass: EthereumServiceMock,
                },
                {
                    provide: StakingService,
                    useClass: StakingServiceMock,
                },
                {
                    provide: LPService,
                    useClass: LPServiceMock,
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StakeUnstakeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
