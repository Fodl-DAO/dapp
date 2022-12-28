import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetChartComponent } from './asset-chart.component';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
    declarations: [AssetChartComponent],
    imports: [CommonModule, HighchartsChartModule],
    exports: [AssetChartComponent],
})
export class AssetChartModule {}
