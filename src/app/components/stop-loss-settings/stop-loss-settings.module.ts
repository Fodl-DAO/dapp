import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';

import { AssetSymbolPipeModule } from '../../pipes/asset-symbol/asset-symbol.pipe.module';
import { FormatExchangeRatePipeModule } from '../../pipes/format-exchange-rate/format-exchange-rate.pipe.module';
import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { AprTooltipModule } from '../apr-tooltip/apr-tooltip.module';
import { BorrowLimitModule } from '../borrow-limit/borrow-limit.module';
import { IconPairPlatformModule } from '../icon-pair-platform/icon-pair-platform.module';
import { DialogModule } from '../dialog/dialog.module';

import { StopLossSettingsComponent } from './stop-loss-settings.component';
import { SliderModule } from '../slider/slider.module';

@NgModule({
    declarations: [StopLossSettingsComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule,
        MatSliderModule,
        AssetSymbolPipeModule,
        FormatExchangeRatePipeModule,
        FormatValuePipeModule,
        AprTooltipModule,
        BorrowLimitModule,
        DialogModule,
        IconPairPlatformModule,
        SliderModule,
    ],
    exports: [StopLossSettingsComponent],
})
export class StopLossSettingsModule {}
