import { Component, Input, OnChanges } from '@angular/core';
import { getChartOptions } from './asset-chart.options';
import { TimeRange } from '../asset-graph.component';

import * as Highcharts from 'highcharts/highstock';
import { IMarket } from '../../../interfaces/market.interface';

@Component({
    selector: 'app-asset-chart',
    templateUrl: './asset-chart.component.html',
})
export class AssetChartComponent implements OnChanges {
    @Input() borrowMarket: IMarket;
    @Input() supplyMarket: IMarket;
    @Input() filterDays: TimeRange;
    @Input() chartData: number[];

    Highcharts: typeof Highcharts = Highcharts;
    chartOptions: Highcharts.Options;

    ngOnChanges(): void {
        this.updateChart();
    }

    updateChart(): void {
        this.chartOptions = getChartOptions(
            this.chartData,
            this.filterDays,
            this.borrowMarket,
            this.supplyMarket,
        );
    }
}
