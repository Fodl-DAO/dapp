import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { NavigationModule } from '../navigation/navigation.module';
import { NetworkSelectModule } from '../network-select/network-select.model';
import { SettingsDialogModule } from '../settings-dialog/settings-dialog.module';
import { WalletModule } from '../wallet/wallet.module';

import { FodlPriceComponent } from './fodl-price.component';

@NgModule({
    declarations: [FodlPriceComponent],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        FormatValuePipeModule,
        NavigationModule,
        NetworkSelectModule,
        SettingsDialogModule,
        WalletModule,
    ],
    exports: [FodlPriceComponent],
})
export class FodlPriceModule {}
