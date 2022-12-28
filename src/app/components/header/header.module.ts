import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { FodlPriceModule } from '../fodl-price/fodl-price.module';

import { NavigationModule } from '../navigation/navigation.module';
import { NetworkSelectModule } from '../network-select/network-select.model';
import { WalletModule } from '../wallet/wallet.module';

import { HeaderComponent } from './header.component';

@NgModule({
    declarations: [HeaderComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FormatValuePipeModule,
        FodlPriceModule,
        NavigationModule,
        NetworkSelectModule,
        WalletModule,
    ],
    exports: [HeaderComponent],
})
export class HeaderModule {}
