import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { DialogModule } from '../../dialog/dialog.module';

import { WalletDialogComponent } from './wallet-dialog.component';

@NgModule({
    declarations: [WalletDialogComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        DialogModule,
    ],
    exports: [WalletDialogComponent],
})
export class WalletDialogModule {}
