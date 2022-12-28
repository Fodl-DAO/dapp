import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

import { FormatExchangeRatePipeModule } from '../../../../pipes/format-exchange-rate/format-exchange-rate.pipe.module';
import { FormatValuePipeModule } from '../../../../pipes/format-value/format-value.pipe.module';

import { IconAssetModule } from '../../../icon-asset/icon-asset.module';
import { InputModule } from '../../../input/input.module';
import { SliderModule } from '../../../slider/slider.module';
import { TransactionModule } from '../../../transaction/transaction.module';

import { SLTPComponent } from './sltp.component';

@NgModule({
    declarations: [SLTPComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatSliderModule,
        FormatExchangeRatePipeModule,
        FormatValuePipeModule,
        IconAssetModule,
        TransactionModule,
        InputModule,
        SliderModule,
    ],
    exports: [SLTPComponent],
})
export class SLTPModule {}
