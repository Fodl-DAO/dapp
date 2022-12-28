import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

import { SingleSidedStakeUnstakeModule } from './single-sided-stake-unstake/single-sided-stake-unstake.module';
import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';
import { DialogModule } from '../dialog/dialog.module';

import { SingleSidedStakingService } from '../../services/single-sided-staking/single-sided-staking.service';

import { SingleSidedStakingComponent } from './single-sided-staking.component';

@NgModule({
    declarations: [SingleSidedStakingComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        FormatValuePipeModule,
        DialogModule,
        FormsModule,
        SingleSidedStakeUnstakeModule,
    ],
    providers: [SingleSidedStakingService],
    exports: [SingleSidedStakingComponent],
})
export class SingleSidedStakingModule {}
