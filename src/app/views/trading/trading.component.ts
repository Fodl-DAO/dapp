import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { isMarketSafe } from '../../utilities/marketSafe';
import { isStableCoin } from '../../utilities/stableCoin';

import { IFoldingMarketApr } from '../../interfaces/market.interface';

import { EthereumService } from '../../services/ethereum/ethereum.service';
import { MarketsService } from '../../services/markets/markets.service';
import { FoldingService } from '../../services/folding/folding.service';

import { assetsPriority } from '../../constants/assets-priority';

import {
    ASSET_BSCETH,
    ASSET_BTCB,
    ASSET_WBNB,
} from '../../constants/networks/bsc';

import {
    ASSET_BUSD,
    ASSET_DAI,
    ASSET_USDC,
    ASSET_WBTC,
    ASSET_WETH,
} from '../../constants/networks/ethereum';
import { HOURS_IN_YEAR } from '../../constants/commons';

import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../utilities/localStorageFunctions';
import { getMarketApr, getMarketDistributionApr } from '../../utilities/apy';

@Component({
    selector: 'app-trading',
    templateUrl: './trading.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingComponent implements OnInit, OnDestroy {
    readonly CARDS_ON_START = 15;
    readonly STEP_RENDER_CARDS = 15;
    readonly INTEREST_TIMEFRAME_LOCAL_KEY = 'interest-timeframe';

    selectedToggleAsset: string = 'all';
    selectedToggleAsset$: BehaviorSubject<string> = new BehaviorSubject<string>(
        this.selectedToggleAsset,
    );

    sortBy$: BehaviorSubject<string> = new BehaviorSubject<string>('market');

    interestRateTimeframe$: BehaviorSubject<number> =
        new BehaviorSubject<number>(undefined);

    foldingMarkets: IFoldingMarketApr[];
    showedFoldingMarkets: IFoldingMarketApr[];
    foldingMarketsSubscription$: Subscription;

    toggleAssets: string[];

    constructor(
        public ethereumService: EthereumService,
        public marketsService: MarketsService,
        public foldingService: FoldingService,
    ) {}

    ngOnInit() {
        this.initToggleAssets();
        this.initInterestTimeframeRange();
        this.loadFoldingMarkets();
    }

    ngOnDestroy() {
        this.foldingMarketsSubscription$.unsubscribe();
    }

    initInterestTimeframeRange() {
        const timeframe = getFromLocalStorage(
            this.INTEREST_TIMEFRAME_LOCAL_KEY,
        );

        this.interestRateTimeframe$.next(
            timeframe ? parseInt(timeframe) : HOURS_IN_YEAR,
        );
    }

    initToggleAssets() {
        const network = this.ethereumService.getNetwork();

        if (network === 'ethereum' || network === 'polygon') {
            this.toggleAssets = [
                ASSET_WBTC.symbol,
                ASSET_WETH.symbol,
                ASSET_USDC.symbol,
                ASSET_DAI.symbol,
            ];
        }

        if (network === 'bsc') {
            this.toggleAssets = [
                ASSET_BTCB.symbol,
                ASSET_BSCETH.symbol,
                ASSET_WBNB.symbol,
                ASSET_BUSD.symbol,
            ];
        }
    }

    loadFoldingMarkets() {
        this.foldingMarketsSubscription$ = combineLatest([
            this.marketsService.foldingMarkets$.pipe(
                filter((foldingMarkets) => !!foldingMarkets),
            ),
            this.sortBy$,
            this.selectedToggleAsset$,
            this.interestRateTimeframe$,
        ])
            .pipe(
                map(([markets, sortBy, selectedAsset, timeframe]) => {
                    let extendedMarkets = markets.map((market) => {
                        return {
                            ...market,
                            marketMaxApr: getMarketApr(
                                market.maxLeverage,
                                market.supplyMarket,
                                market.borrowMarket,
                                timeframe,
                            ),
                            marketMaxDistributionApr: getMarketDistributionApr(
                                market.maxLeverage,
                                market.supplyMarket,
                                market.borrowMarket,
                                timeframe,
                            ),
                        };
                    });

                    if (selectedAsset !== 'all') {
                        extendedMarkets = extendedMarkets.filter(
                            (market) =>
                                market.borrowMarket.assetSymbol ===
                                    selectedAsset ||
                                market.supplyMarket.assetSymbol ===
                                    selectedAsset,
                        );
                    }

                    return extendedMarkets.sort((a, b) => {
                        const direction = sortBy.startsWith('-') ? -1 : 1;
                        const column = sortBy.replace('-', '');

                        const priorityA = this.getPriorityPairSum(a);
                        const priorityB = this.getPriorityPairSum(b);

                        const priorityAlphabeticalSort =
                            priorityB > priorityA ||
                            (priorityB === priorityA &&
                                `${a.supplyMarket.assetSymbol}${a.borrowMarket.assetSymbol}${a.supplyMarket.platform.name}` >
                                    `${b.supplyMarket.assetSymbol}${b.borrowMarket.assetSymbol}${b.supplyMarket.platform.name}`);

                        switch (column) {
                            case 'interestRate':
                                return a.marketMaxApr < b.marketMaxApr
                                    ? direction
                                    : -direction;
                            case 'market':
                            default:
                                return priorityAlphabeticalSort
                                    ? direction
                                    : -direction;
                        }
                    });
                }),
            )
            .subscribe((markets: IFoldingMarketApr[]) => {
                this.foldingMarkets = markets;
                this.showedFoldingMarkets = this.foldingMarkets.slice(
                    0,
                    this.CARDS_ON_START,
                );
            });
    }

    appendMarkets() {
        const startIndex = this.showedFoldingMarkets.length;
        const endIndex =
            startIndex + this.STEP_RENDER_CARDS > this.foldingMarkets.length
                ? this.foldingMarkets.length
                : startIndex + this.STEP_RENDER_CARDS;

        const pushMarkets = this.foldingMarkets.slice(startIndex, endIndex);

        this.showedFoldingMarkets.push(...pushMarkets);
    }

    handleOnScroll() {
        if (this.showedFoldingMarkets?.length < this.foldingMarkets?.length) {
            this.appendMarkets();
        }
    }

    handleTimeframeUpdate(timeframe: number) {
        this.interestRateTimeframe$.next(timeframe);
        saveToLocalStorage(this.INTEREST_TIMEFRAME_LOCAL_KEY, timeframe);
    }

    handleSelectedAssetUpdate() {
        this.selectedToggleAsset$.next(this.selectedToggleAsset);
    }

    sortBy(column: string) {
        if (column === this.sortBy$.getValue().replace('-', '')) {
            this.sortBy$.next(
                `${
                    this.sortBy$.getValue().startsWith('-') ? '' : '-'
                }${column}`,
            );
        } else {
            this.sortBy$.next(column);
        }
    }

    get interestRateTimeframe(): number {
        return this.interestRateTimeframe$.getValue();
    }

    get sortByValue(): string {
        return this.sortBy$.getValue();
    }

    getCallToAction(foldingMarket: IFoldingMarketApr): string {
        if (
            isMarketSafe(
                foldingMarket.supplyMarket.assetAddress,
                foldingMarket.borrowMarket.assetAddress,
            )
        ) {
            return 'Farm';
        } else if (isStableCoin(foldingMarket.supplyMarket.assetAddress)) {
            return `Short ${foldingMarket.borrowMarket.assetSymbol}`;
        } else if (isStableCoin(foldingMarket.borrowMarket.assetAddress)) {
            return `Long ${foldingMarket.supplyMarket.assetSymbol}`;
        } else {
            return 'Trade';
        }
    }

    getPriorityPairSum(pair: IFoldingMarketApr): number {
        const firstAssetSymbol = pair.supplyMarket.assetSymbol;
        const secondAssetSymbol = pair.borrowMarket.assetSymbol;

        const getAssetPriority = (assetSymbol: string): number =>
            assetsPriority[assetSymbol] ? assetsPriority[assetSymbol] : 0;

        return firstAssetSymbol === secondAssetSymbol
            ? getAssetPriority(firstAssetSymbol)
            : getAssetPriority(firstAssetSymbol) +
                  getAssetPriority(secondAssetSymbol);
    }
}
