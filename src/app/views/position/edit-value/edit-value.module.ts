import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PositionModule } from '../../../components/position/position.module';
import { PositionLoadingModule } from '../../../components/position/position-loading/position-loading.module';

import { EditValueRoutesModule } from './edit-value-routing.module';

import { EditValueComponent } from './edit-value.component';

@NgModule({
    declarations: [EditValueComponent],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        EditValueRoutesModule,
        PositionModule,
        PositionLoadingModule,
    ],
})
export class EditValueModule {}
