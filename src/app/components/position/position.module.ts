import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AssetGraphModule } from '../asset-graph/asset-graph.module';
import { PositionFormModule } from './position-form/position-form.module';

import { PositionDetailsModule } from './position-details/position-details.module';

import { PositionComponent } from './position.component';
import { StopLossSettingsModule } from '../stop-loss-settings/stop-loss-settings.module';

@NgModule({
    declarations: [PositionComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatProgressSpinnerModule,
        AssetGraphModule,
        PositionFormModule,
        PositionDetailsModule,
        StopLossSettingsModule,
    ],
    exports: [PositionComponent],
})
export class PositionModule {}
