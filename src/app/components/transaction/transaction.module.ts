import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { DialogModule } from '../dialog/dialog.module';

import { TransactionComponent } from './transaction.component';

@NgModule({
    declarations: [TransactionComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FormatValuePipeModule,
        DialogModule,
    ],
    exports: [TransactionComponent],
})
export class TransactionModule {}
