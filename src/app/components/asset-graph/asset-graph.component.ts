import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from '@angular/core';

import { EthereumService } from '../../services/ethereum/ethereum.service';
import { GeckoPriceService } from '../../services/gecko-price/gecko-price.service';

import { combineLatest, Subscription } from 'rxjs';
import {
    delay,
    distinctUntilChanged,
    finalize,
    first,
    map,
} from 'rxjs/operators';

import { IPosition } from '../../interfaces/position.interface';

import { isExchangeReverseRequired } from '../../utilities/formatExchangeRate';

export enum TimeRange {
    DAY = '1',
    WEEK = '7',
    MONTH = '30',
    THREE_MONTH = '90',
    YEAR = '365',
}

@Component({
    selector: 'app-asset-graph',
    templateUrl: './asset-graph.component.html',
})
export class AssetGraphComponent implements OnChanges, OnDestroy {
    @Input() position: IPosition;
    @Input() strategy: string;

    supplyCoinId: string;
    borrowCoinId: string;

    filterDays: TimeRange = TimeRange.DAY;

    oraclePrice: number;
    updateOraclePriceSubscription: Subscription;

    isChartLoading = false;
    chartData: number[];

    constructor(
        private geckoService: GeckoPriceService,
        private ethereumService: EthereumService,
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        this.supplyCoinId = this.getCoinId(
            this.position.borrowMarket.assetAddress,
        );
        this.borrowCoinId = this.getCoinId(
            this.position.supplyMarket.assetAddress,
        );

        if (this.isAssetAddrChanged(changes)) {
            this.resetFilterDays();
            this.loadOraclePrice();
        }

        this.loadChartData$();
    }

    ngOnDestroy() {
        this.updateOraclePriceSubscription?.unsubscribe();
    }

    loadOraclePrice() {
        this.updateOraclePrice(
            this.position.borrowMarket.assetUsdValue,
            this.position.supplyMarket.assetUsdValue,
        );

        // Unsubscribe from previous assets pair
        this.updateOraclePriceSubscription?.unsubscribe();

        this.updateOraclePriceSubscription = combineLatest([
            this.position.borrowMarket.getAssetUsdValueObservable(),
            this.position.supplyMarket.getAssetUsdValueObservable(),
        ])
            .pipe(
                map(([borrowAssetUsdValue, supplyAssetUsdValue]) => {
                    this.updateOraclePrice(
                        borrowAssetUsdValue,
                        supplyAssetUsdValue,
                    );
                }),
            )
            .subscribe();
    }

    loadChartData$() {
        this.isChartLoading = true;

        combineLatest([
            this.geckoService.getMarketChart(
                this.supplyCoinId,
                this.filterDays,
            ),
            this.geckoService.getMarketChart(
                this.borrowCoinId,
                this.filterDays,
            ),
        ])
            .pipe(
                delay(250), // Remove flickering
                distinctUntilChanged(),
                first(),
                map(([supplyData, borrowData]) => {
                    if (supplyData.length > borrowData.length) {
                        supplyData = supplyData.slice(0, borrowData.length);
                    }
                    if (borrowData.length < supplyData.length) {
                        borrowData = borrowData.slice(0, supplyData.length);
                    }
                    return supplyData.map((supply, index) => {
                        const borrow = borrowData[index];
                        const value =
                            supply && borrow ? supply[1] / borrow[1] : 0;

                        const x = supply[0];
                        const y = isExchangeReverseRequired(
                            value,
                            this.position.supplyMarket.assetSymbol,
                            this.position.borrowMarket.assetSymbol,
                        )
                            ? 1 / value
                            : value;

                        return [x, y];
                    });
                }),
                finalize(() => (this.isChartLoading = false)),
            )
            .subscribe((data: number[]) => (this.chartData = data));
    }

    isAssetAddrChanged(changes: SimpleChanges): boolean {
        const borrowAddress =
            changes.position.currentValue?.borrowMarket?.assetAddress;
        const borrowPrevAddress =
            changes.position.previousValue?.borrowMarket?.assetAddress;

        const supplyAddress =
            changes.position.currentValue?.supplyMarket?.assetAddress;
        const supplyPrevAddress =
            changes.position.previousValue?.supplyMarket?.assetAddress;

        return (
            borrowAddress !== borrowPrevAddress ||
            supplyAddress !== supplyPrevAddress
        );
    }

    resetFilterDays(): void {
        this.filterDays = TimeRange.DAY;
    }

    updateFilterDays(days: TimeRange): void {
        this.filterDays = days;
        this.loadChartData$();
    }

    updateOraclePrice(
        borrowAssetUsdValue: number,
        supplyAssetUsdValue: number,
    ) {
        this.oraclePrice = borrowAssetUsdValue / supplyAssetUsdValue;
    }

    getCoinId(address: string): string {
        return this.ethereumService
            .getNetworkAssets()
            .find((a) => a.address.toLowerCase() === address.toLowerCase())?.id;
    }
}
