import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetGraphComponent } from './asset-graph.component';
import { AssetPriceModule } from './asset-price/asset-price.module';
import { AssetChartModule } from './asset-chart/asset-chart.module';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
    declarations: [AssetGraphComponent],
    imports: [
        CommonModule,
        AssetPriceModule,
        AssetChartModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
    ],
    exports: [AssetGraphComponent],
})
export class AssetGraphModule {}
