import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
} from 'rxjs/operators';

import { IPosition } from '../../interfaces/position.interface';

import { LOADING_DEBOUNCE } from '../../constants/commons';

import { FoldingService } from '../../services/folding/folding.service';

@Component({
    selector: 'app-positions-view',
    templateUrl: './positions.component.html',
})
export class PositionsComponent implements OnInit {
    netWorth$: Observable<number>;

    positions$: Observable<IPosition[]>;
    openPositions$: Observable<IPosition[]>;
    positionsPaginated$: Observable<IPosition[]>;
    positionsLoading$: Observable<boolean>;

    showClosed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    page$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    itemsPerPage$: BehaviorSubject<number> = new BehaviorSubject<number>(10);

    sortBy$: BehaviorSubject<string> = new BehaviorSubject<string>(
        'positionValueUsd',
    );

    constructor(public foldingService: FoldingService) {}

    ngOnInit() {
        this.foldingService.loadPositions();

        this.positionsLoading$ = combineLatest([
            this.foldingService.positionsLoading$,
            this.foldingService.accountsLoading$,
        ]).pipe(
            map(
                ([positionsLoading, accountsLoading]) =>
                    positionsLoading || accountsLoading,
            ),
            debounceTime(LOADING_DEBOUNCE),
        );

        this.positions$ = combineLatest([
            this.foldingService.positions$.pipe(
                distinctUntilChanged(),
                map((positions) =>
                    positions.map((position) => ({
                        ...position,
                        strategy:
                            position.supplyTokenAddress +
                            position.borrowTokenAddress,
                    })),
                ),
            ),
            this.sortBy$.pipe(distinctUntilChanged()),
        ]).pipe(
            map(([positions, sortBy]) =>
                positions.sort((a, b) => {
                    const direction = sortBy.startsWith('-') ? -1 : 1;
                    const column = sortBy.replace('-', '');

                    if (sortBy === 'market') {
                        const platform =
                            a.supplyMarket.platform.name.localeCompare(
                                b.supplyMarket.platform.name,
                            );

                        const supplyMarket =
                            a.supplyMarket.assetSymbol.localeCompare(
                                b.supplyMarket.assetSymbol,
                            );

                        const borrowMarket =
                            a.borrowMarket.assetSymbol.localeCompare(
                                b.borrowMarket.assetSymbol,
                            );
                        return platform !== 0
                            ? platform
                            : supplyMarket !== 0
                            ? supplyMarket
                            : borrowMarket;
                    } else if (sortBy === '-market') {
                        const platform =
                            b.supplyMarket.platform.name.localeCompare(
                                a.supplyMarket.platform.name,
                            );

                        const supplyMarket =
                            b.supplyMarket.assetSymbol.localeCompare(
                                a.supplyMarket.assetSymbol,
                            );

                        const borrowMarket =
                            b.borrowMarket.assetSymbol.localeCompare(
                                a.borrowMarket.assetSymbol,
                            );

                        return platform !== 0
                            ? platform
                            : supplyMarket !== 0
                            ? supplyMarket
                            : borrowMarket;
                    } else if (sortBy === 'currentPrice') {
                        const x =
                            a.supplyMarket.assetUsdValue -
                            a.borrowMarket.assetUsdValue;

                        const y =
                            b.supplyMarket.assetUsdValue -
                            b.borrowMarket.assetUsdValue;
                        const diff = x - y;

                        return diff;
                    } else if (sortBy === '-currentPrice') {
                        const x =
                            a.supplyMarket.assetUsdValue -
                            a.borrowMarket.assetUsdValue;

                        const y =
                            b.supplyMarket.assetUsdValue -
                            b.borrowMarket.assetUsdValue;
                        const diff = x - y;

                        return -diff;
                    } else {
                        return a[column] < b[column] ? direction : -direction;
                    }
                }),
            ),
        );

        this.openPositions$ = combineLatest([
            this.positions$,
            this.showClosed$,
        ]).pipe(
            map(([positions, showClosed]) =>
                positions.filter(
                    (position) =>
                        position.positionValueUsd > (showClosed ? -1 : 0.5),
                ),
            ),
        );

        this.positionsPaginated$ = combineLatest([
            this.openPositions$,
            this.page$,
            this.itemsPerPage$,
        ]).pipe(
            map(([positions, page, itemsPerPage]) =>
                positions.slice((page - 1) * itemsPerPage, page * itemsPerPage),
            ),
        );

        this.showClosed$
            .pipe(filter((showClosed) => !showClosed))
            .subscribe(() => this.page$.next(1));

        this.netWorth$ = this.positions$.pipe(
            map((positions) =>
                positions.reduce((a, c) => (a += c.positionValueUsd), 0),
            ),
        );
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

    get isPositionsLoaded() {
        return !this.foldingService.positionsLoading$.getValue();
    }

    get isPositionsExist() {
        return this.foldingService.positions$.getValue()?.length;
    }
}
