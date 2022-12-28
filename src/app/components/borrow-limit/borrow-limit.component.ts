import { Component, Input } from '@angular/core';

import { IPosition } from '../../interfaces/position.interface';

import { getAssetSymbol } from '../../utilities/asset';
import { formatExchangeRate } from '../../utilities/formatExchangeRate';

const LIMIT_RATIO = 0.95;

@Component({
    selector: 'app-borrow-limit',
    templateUrl: './borrow-limit.component.html',
})
export class BorrowLimitComponent {
    @Input() position: IPosition;
    /**
     * Important to note: this input-property based on pre-defined
     * SCSS tooltip positions class names that are located
     * inside src/styles/components/tooltip.scss
     */
    @Input() tooltipPosition: string;

    collateralUsageFactorLeftOffset: string;
    collateralUsageLimitLeftOffset: string;
    currentPrice: string;
    currentPriceExchange: string;
    liquidationPrice: string;
    liquidationExchange: string;

    ngOnInit() {
        if (this.position) {
            const supplyToken = getAssetSymbol(
                this.position.supplyTokenAddress,
            );
            const borrowToken = getAssetSymbol(
                this.position.borrowTokenAddress,
            );

            [this.currentPrice, this.currentPriceExchange] = formatExchangeRate(
                this.position.currentPrice,
                supplyToken,
                borrowToken,
            ).split(' ');

            this.collateralUsageFactorLeftOffset = `${Math.floor(
                100 - this.position.collateralUsageFactor * LIMIT_RATIO,
            )}%`;

            [this.liquidationPrice, this.liquidationExchange] =
                formatExchangeRate(
                    (this.position.supplyAmount *
                        this.position.supplyMarket.liquidationFactor) /
                        this.position.borrowAmount,
                    supplyToken,
                    borrowToken,
                ).split(' ');
        }
    }
}
