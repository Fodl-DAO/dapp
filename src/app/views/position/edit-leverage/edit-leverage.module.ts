import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PositionModule } from '../../../components/position/position.module';
import { PositionLoadingModule } from '../../../components/position/position-loading/position-loading.module';

import { EditLeverageRoutesModule } from './edit-leverage-routing.module';

import { EditLeverageComponent } from './edit-leverage.component';

@NgModule({
    declarations: [EditLeverageComponent],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        EditLeverageRoutesModule,
        PositionModule,
        PositionLoadingModule,
    ],
})
export class EditLeverageModule {}
