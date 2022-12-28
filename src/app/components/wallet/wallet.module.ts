import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { WalletComponent } from './wallet.component';
import { MatDialogModule } from '@angular/material/dialog';
import { WalletDialogModule } from './wallet-dialog/wallet-dialog.module';

@NgModule({
    declarations: [WalletComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatTooltipModule,
        WalletDialogModule,
    ],
    exports: [WalletComponent],
})
export class WalletModule {}
