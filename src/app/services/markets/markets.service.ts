import { Injectable } from '@angular/core';

import {
    BehaviorSubject,
    combineLatest,
    forkJoin,
    from,
    Observable,
    of,
} from 'rxjs';

import {
    catchError,
    filter,
    map,
    mergeMap,
    switchMap,
    tap,
} from 'rxjs/operators';

import { IFoldingMarket, IMarket } from '../../interfaces/market.interface';

import { getMaxLeverage } from '../../utilities/maxLeverage';
import { getAssetPairs as getAssetPairsHardcoded } from '../../utilities/assetPairs';

import { ERC20Service } from '../erc20/erc20.service';
import { EthereumService } from '../ethereum/ethereum.service';
import { FoldingMarketsService } from '../folding/foldingMarkets/foldingMarkets.service';

import { ethers } from 'ethers';

@Injectable({
    providedIn: 'root',
})
export class MarketsService {
    assetMarkets$ = new BehaviorSubject<IMarket[]>(undefined);

    foldingMarkets$ = new BehaviorSubject<IFoldingMarket[]>(undefined);

    marketsLoading$ = new BehaviorSubject<boolean>(undefined);

    private loadMarkets$ = new BehaviorSubject<boolean>(true);

    constructor(
        private erc20service: ERC20Service,
        private ethereumService: EthereumService,
        private foldingMarketsService: FoldingMarketsService,
    ) {
        // Handle network disconnect
        this.ethereumService.connected$
            .pipe(
                filter((connected) => !connected),
                tap(() => this.resetMarkets()),
            )
            .subscribe();

        // Handle network connect
        combineLatest([
            this.ethereumService.connected$,
            this.ethereumService.account$,
            this.loadMarkets$,
        ])
            .pipe(
                filter(([connected, _]) => {
                    return connected && !this.marketsLoading$.getValue();
                }),
                tap(() => {
                    this.marketsLoading$.next(true);
                }),
                mergeMap(() => {
                    return this.getMarkets$();
                }),
                switchMap((markets) => {
                    return this.getWalletBalance$(markets);
                }),
                mergeMap((markets: IMarket[]) => {
                    return combineLatest([
                        of(markets),
                        this.getAssetPairs$(markets),
                    ]);
                }),
                tap(([markets, foldingMarkets]) => {
                    this.assetMarkets$.next(markets);
                    this.foldingMarkets$.next(foldingMarkets);
                    this.marketsLoading$.next(false);
                }),
                catchError((err) => this.handleLoadMarketsError$(err)),
            )
            .subscribe();
    }

    private resetMarkets() {
        this.assetMarkets$.next(undefined);
        this.foldingMarkets$.next(undefined);
        this.marketsLoading$.next(false);
    }

    private handleLoadMarketsError$(error: any): Observable<{ error: any }> {
        console.error('Failed to load markets: ', error);
        this.resetMarkets();
        return of({ error });
    }

    private getMarkets$(): Observable<IMarket[]> {
        return from(this.foldingMarketsService.getMarketData()).pipe(
            map((markets) => {
                if (!markets?.length) {
                    throw 'Markets list is empty';
                }
                return markets;
            }),
        );
    }

    private getAssetPairs$(markets: IMarket[]): Observable<IFoldingMarket[]> {
        return of(markets).pipe(
            map((markets) => {
                return getAssetPairsHardcoded(this.ethereumService.getNetwork())
                    .map((assetPair) => {
                        const supplyMarket = this.findMarket(
                            assetPair.supplyAsset.platformAddress,
                            assetPair.supplyAsset.address,
                            markets,
                        );

                        const borrowMarket = this.findMarket(
                            assetPair.borrowAsset.platformAddress,
                            assetPair.borrowAsset.address,
                            markets,
                        );

                        const maxLeverage = getMaxLeverage(
                            supplyMarket.collateralFactor,
                        );

                        return {
                            supplyMarket,
                            borrowMarket,
                            maxLeverage,
                        };
                    })
                    .filter((foldingMarket) => foldingMarket.maxLeverage > 0);
            }),
        );
    }

    private getWalletBalance$(markets: IMarket[]): Observable<IMarket[]> {
        return combineLatest([of(markets), this.ethereumService.account$]).pipe(
            mergeMap(([markets, account]) => {
                return forkJoin(
                    ...markets.map((market) =>
                        this.extendMarketWithWalletBalance$(market, account),
                    ),
                );
            }),
        );
    }

    private extendMarketWithWalletBalance$(
        market: IMarket,
        account: string,
    ): Observable<IMarket> {
        return of(market).pipe(
            switchMap(() => {
                if (!account) {
                    return of(ethers.constants.Zero);
                }
                return from(
                    this.erc20service.getBalance(account, market.assetAddress),
                );
            }),
            map((balance: ethers.BigNumber) => {
                market.walletBalance = balance;
                return market;
            }),
            catchError(() => {
                console.error(`Failed to load balance for account: ${account}`);
                return of(market);
            }),
        );
    }

    reloadMarkets() {
        this.loadMarkets$.next(true);
    }

    findMarket(platform: string, asset: string, markets?: IMarket[]): IMarket {
        const _markets = markets ? markets : this.assetMarkets$.getValue();
        return _markets?.length
            ? _markets.find(
                  (market) =>
                      market.platform.address.toLowerCase() ===
                          platform.toLowerCase() &&
                      market.assetAddress.toLowerCase() === asset.toLowerCase(),
              )
            : undefined;
    }

    findFoldingMarket(
        platform: string,
        supplyAsset: string,
        borrowAsset: string,
    ): IFoldingMarket {
        return this.foldingMarkets$.getValue()?.length
            ? this.foldingMarkets$
                  .getValue()
                  .find(
                      (foldingMarket) =>
                          foldingMarket.supplyMarket.platform.address.toLowerCase() ===
                              platform.toLowerCase() &&
                          foldingMarket.supplyMarket.assetAddress.toLowerCase() ===
                              supplyAsset.toLowerCase() &&
                          foldingMarket.borrowMarket.assetAddress.toLowerCase() ===
                              borrowAsset.toLowerCase(),
                  )
            : undefined;
    }
}
