import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';

import { FormatExchangeRatePipeModule } from '../../../pipes/format-exchange-rate/format-exchange-rate.pipe.module';
import { FormatValuePipeModule } from '../../../pipes/format-value/format-value.pipe.module';

import { AssetModule } from '../../asset/asset.module';
import { AssetSelectModule } from '../../asset-select/asset-select.module';
import { IconAssetModule } from '../../icon-asset/icon-asset.module';
import { InputModule } from '../../input/input.module';
import { SliderModule } from '../../slider/slider.module';
import { TransactionModule } from '../../transaction/transaction.module';
import { SLTPModule } from './sltp/sltp.module';
import { BigNumberInputModule } from '../../big-number-input/big-number-input.module';

import { PositionFormComponent } from './position-form.component';

@NgModule({
    declarations: [PositionFormComponent],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatSliderModule,
        FormatExchangeRatePipeModule,
        FormatValuePipeModule,
        AssetModule,
        AssetSelectModule,
        IconAssetModule,
        TransactionModule,
        InputModule,
        SliderModule,
        SLTPModule,
        BigNumberInputModule,
    ],
    exports: [PositionFormComponent],
})
export class PositionFormModule {}
