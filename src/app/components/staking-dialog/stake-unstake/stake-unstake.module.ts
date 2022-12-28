import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { FormatValuePipeModule } from '../../../pipes/format-value/format-value.pipe.module';

import { StakeUnstakeComponent } from './stake-unstake.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BigNumberInputModule } from '../../big-number-input/big-number-input.module';

@NgModule({
    declarations: [StakeUnstakeComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        FormatValuePipeModule,
        MatIconModule,
        MatProgressSpinnerModule,
        BigNumberInputModule,
    ],
    exports: [StakeUnstakeComponent],
})
export class StakeUnstakeModule {}
