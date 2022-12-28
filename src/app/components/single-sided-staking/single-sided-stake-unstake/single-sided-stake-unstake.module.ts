import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSidedStakeUnstakeComponent } from './single-sided-stake-unstake.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FormatValuePipeModule } from '../../../pipes/format-value/format-value.pipe.module';
import { MatButtonModule } from '@angular/material/button';
import { BigNumberInputModule } from '../../big-number-input/big-number-input.module';

@NgModule({
    declarations: [SingleSidedStakeUnstakeComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        FormatValuePipeModule,
        MatButtonModule,
        BigNumberInputModule,
    ],
    exports: [SingleSidedStakeUnstakeComponent],
})
export class SingleSidedStakeUnstakeModule {}
