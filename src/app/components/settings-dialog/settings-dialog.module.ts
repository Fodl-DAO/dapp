import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { DialogModule } from '../dialog/dialog.module';

import { SettingsModule } from '../settings/settings.module';

import { SettingsDialogComponent } from './settings-dialog.component';

@NgModule({
    declarations: [SettingsDialogComponent],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        DialogModule,
        SettingsModule,
    ],
    exports: [SettingsDialogComponent],
})
export class SettingsDialogModule {}
