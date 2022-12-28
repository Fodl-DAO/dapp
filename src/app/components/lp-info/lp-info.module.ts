import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { IconPairModule } from '../icon-pair/icon-pair.module';

import { StakingDialogModule } from '../staking-dialog/staking-dialog.module';

import { LpInfoComponent } from './lp-info.component';

@NgModule({
    declarations: [LpInfoComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        IconPairModule,
        StakingDialogModule,
        FormatValuePipeModule,
    ],
    exports: [LpInfoComponent],
})
export class LpInfoModule {}
