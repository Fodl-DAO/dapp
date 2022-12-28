import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { FoldingRewardsService } from '../../services/folding/foldingRewards/foldingRewards.service';

import { RewardsRoutesModule } from './rewards-routing.module';

import { BigNumberInputModule } from '../../components/big-number-input/big-number-input.module';

import { RewardsComponent } from './rewards.component';

@NgModule({
    declarations: [RewardsComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RewardsRoutesModule,
        FormatValuePipeModule,
        BigNumberInputModule,
    ],
    providers: [FoldingRewardsService],
})
export class RewardsModule {}
