import { Component, Input } from '@angular/core';

import { HOURS_IN_YEAR } from '../../constants/commons';

import { getMarketApr, getMarketDistributionApr } from '../../utilities/apy';

import { IFoldingMarket } from '../../interfaces/market.interface';

@Component({
    selector: 'app-apr-tooltip',
    templateUrl: './apr-tooltip.component.html',
})
export class AprTooltipComponent {
    @Input() foldingMarket: IFoldingMarket;
    @Input() leverage?: number;
    @Input() interestRateTimeframe?: number;

    getLeverage(): number {
        return this.leverage ? this.leverage : this.foldingMarket.maxLeverage;
    }

    getInterestRateTimeframe(): number {
        return this.interestRateTimeframe
            ? this.interestRateTimeframe
            : HOURS_IN_YEAR;
    }

    get marketApr(): number {
        return getMarketApr(
            this.getLeverage(),
            this.foldingMarket.supplyMarket,
            this.foldingMarket.borrowMarket,
            this.getInterestRateTimeframe(),
        );
    }

    get marketDistributionApr(): number {
        return getMarketDistributionApr(
            this.getLeverage(),
            this.foldingMarket.supplyMarket,
            this.foldingMarket.borrowMarket,
            this.getInterestRateTimeframe(),
        );
    }

    get netApr(): number {
        return this.marketApr + this.marketDistributionApr;
    }
}
