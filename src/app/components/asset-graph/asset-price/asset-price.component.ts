import { Component, EventEmitter, Input, Output } from '@angular/core';

import { formatExchangeRate } from '../../../utilities/formatExchangeRate';

import { IMarket } from '../../../interfaces/market.interface';

import { TimeRange } from '../asset-graph.component';

@Component({
    selector: 'app-asset-price',
    templateUrl: './asset-price.component.html',
})
export class AssetPriceComponent {
    @Output() filterDaysEvent = new EventEmitter<TimeRange>();

    @Input() oraclePrice: number;
    @Input() borrowMarket: IMarket;
    @Input() supplyMarket: IMarket;
    @Input() filterDays: TimeRange;

    timeRange = TimeRange;

    changeFilterDays(days: TimeRange) {
        this.filterDaysEvent.emit(days);
    }

    get oraclePriceString() {
        return formatExchangeRate(
            this.oraclePrice,
            this.supplyMarket.assetSymbol,
            this.borrowMarket.assetSymbol,
            'sourceOnly',
        );
    }

    get quoteSymbol() {
        return formatExchangeRate(
            this.oraclePrice,
            this.supplyMarket.assetSymbol,
            this.borrowMarket.assetSymbol,
            'destination',
        );
    }

    get priceSymbol() {
        return formatExchangeRate(
            this.oraclePrice,
            this.supplyMarket.assetSymbol,
            this.borrowMarket.assetSymbol,
            'source',
        );
    }
}
