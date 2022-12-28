import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PositionModule } from '../../../components/position/position.module';
import { PositionLoadingModule } from '../../../components/position/position-loading/position-loading.module';

import { ClosePositionRoutesModule } from './close-position-routing.module';

import { ClosePositionComponent } from './close-position.component';

@NgModule({
    declarations: [ClosePositionComponent],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        ClosePositionRoutesModule,
        PositionModule,
        PositionLoadingModule,
    ],
})
export class ClosePositionModule {}
