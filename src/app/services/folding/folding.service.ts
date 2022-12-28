import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';

import {
    catchError,
    debounceTime,
    filter,
    map,
    switchMap,
    tap,
} from 'rxjs/operators';

import { IErrorMessageData } from '../../interfaces/errorMessageData.interface';
import {
    IIncreaseSimplePosition,
    IIncreaseSimplePositionWithLoop,
} from '../../interfaces/increasePosition.interface';
import {
    IDecreaseSimplePosition,
    IDecreaseSimplePositionWithLoop,
} from '../../interfaces/decreasePosition.interface';
import { IPosition } from '../../interfaces/position.interface';
import { IPositionDetails } from '../../interfaces/positionDetails.interface';
import { IPNLSettings } from '../../interfaces/sltp.interface';

import { NETWORK_INTERVAL } from '../../constants/commons';

import { convertToBigNumber, parseBigNumber } from '../../utilities/bigNumber';
import { ensureNumberIsReadable } from '../../utilities/ensureNumberIsReadable';
import { getMarketApr } from '../../utilities/apy';

import { EthereumService } from '../ethereum/ethereum.service';
import { MarketsService } from '../markets/markets.service';

import { FoldingPositionsService } from './foldingPositions/foldingPositions.service';
import { FoldingRegistryService } from './foldingRegistry/foldingRegistry.service';

import { BigNumber, ethers } from 'ethers';

@Injectable({
    providedIn: 'root',
})
export class FoldingService {
    positions$ = new BehaviorSubject<IPosition[]>([]);
    positionsLoading$ = new BehaviorSubject<boolean>(false);

    accounts$ = new BehaviorSubject<string[]>([]);
    accountsLoading$ = new BehaviorSubject<boolean>(false);

    private loadPositions$ = new BehaviorSubject<boolean>(true);

    simulating$ = new BehaviorSubject<boolean>(false);

    error$: Observable<string>;

    constructor(
        private ethereumService: EthereumService,
        private foldingPositionsService: FoldingPositionsService,
        private foldingRegistryService: FoldingRegistryService,
        private marketsService: MarketsService,
    ) {
        this.error$ = this.ethereumService.connected$.pipe(
            debounceTime(NETWORK_INTERVAL),
            map((value) =>
                value ? undefined : 'Not connected to blockchain.',
            ),
        );

        // Handle network or wallet disconnect
        combineLatest([
            this.ethereumService.connected$,
            this.ethereumService.account$,
        ])
            .pipe(filter(([connected, account]) => !connected || !account))
            .subscribe(() => {
                this.accounts$.next([]);
                this.positions$.next([]);
            });

        // Start to load positions
        combineLatest([
            this.marketsService.assetMarkets$,
            this.ethereumService.account$,
            this.loadPositions$,
        ])
            .pipe(
                filter(
                    ([markets, account, _]) => !!markets?.length && !!account,
                ),
                tap(() => {
                    this.positions$.next([]);
                    this.positionsLoading$.next(true);
                    this.accountsLoading$.next(true);
                }),
                switchMap(([markets, account, _]) => {
                    return from(
                        this.foldingRegistryService.getFoldingAccounts(account),
                    );
                }),
                tap((foldingAccounts: string[]) => {
                    this.accounts$.next(foldingAccounts);
                    this.accountsLoading$.next(false);
                }),
                switchMap((foldingAccounts: string[]) => {
                    return !foldingAccounts?.length
                        ? of([])
                        : this.getPositions$();
                }),
                catchError((e) => {
                    console.error(e);
                    this.error$ = of(
                        "Error: Something went wrong. Can't load the positions",
                    );
                    return of([]);
                }),
            )
            .subscribe((positions: IPosition[]) => {
                this.positions$.next(positions);
                this.positionsLoading$.next(false);
            });
    }

    loadPositions() {
        this.loadPositions$.next(true);
    }

    private getPositions$() {
        return from(
            this.foldingPositionsService.getPositions(
                this.accounts$.getValue(),
            ),
        ).pipe(
            map((positions: IPosition[]) => {
                return positions.map((position) =>
                    this.extendPosition(position),
                );
            }),
        );
    }

    private extendPosition(position: IPosition): IPosition {
        const borrowMarket = this.marketsService.findMarket(
            position.platformAddress,
            position.borrowTokenAddress,
        );

        const supplyMarket = this.marketsService.findMarket(
            position.platformAddress,
            position.supplyTokenAddress,
        );

        const leverageBigNumber = position.positionValueBigNumber.isZero()
            ? convertToBigNumber(1)
            : position.supplyAmountBigNumber
                  .mul(convertToBigNumber(1))
                  .div(position.positionValueBigNumber)
                  .sub(convertToBigNumber(1));

        const leverage = parseBigNumber(leverageBigNumber);

        const apr = getMarketApr(leverage, supplyMarket, borrowMarket);

        const positionValue = parseBigNumber(
            position.positionValueBigNumber,
            supplyMarket.assetDecimals,
        );

        const principalValue = parseBigNumber(
            position.principalValueBigNumber,
            supplyMarket.assetDecimals,
        );

        const supplyAmount = parseBigNumber(
            position.supplyAmountBigNumber,
            supplyMarket.assetDecimals,
        );

        const supplyAmountUsd = supplyAmount * supplyMarket.assetUsdValue;

        const borrowAmount = parseBigNumber(
            position.borrowAmountBigNumber,
            borrowMarket.assetDecimals,
        );

        const borrowAmountUsd = borrowAmount * borrowMarket.assetUsdValue;

        const currentPrice =
            borrowMarket.assetUsdValue / supplyMarket.assetUsdValue;

        const principalValueUsd = principalValue * supplyMarket.assetUsdValue;

        const rewardsPnl = 0;

        return {
            ...position,
            apr,
            leverage,
            leverageBigNumber,
            borrowMarket,
            borrowAmount,
            borrowAmountUsd,
            supplyMarket,
            supplyAmount,
            supplyAmountUsd,
            positionValue,
            positionValueUsd: positionValue * supplyMarket.assetUsdValue,
            principalValue,
            principalValueUsd,
            foldingMarket: this.marketsService.findFoldingMarket(
                position.platformAddress,
                position.supplyTokenAddress,
                position.borrowTokenAddress,
            ),
            currentPrice,
            pnl: (positionValue / principalValue - 1) * 100,
            rewardsPnl,
        };
    }

    createFoldingAccount(
        simulate?: boolean,
    ): Observable<Object | IErrorMessageData> {
        return from(this.foldingRegistryService.createFoldingAccount(simulate));
    }

    calculateAndIncreaseSimplePosition(
        platform: string,
        principalToken: string,
        principalAmount: BigNumber,
        leverage: number,
        borrowToken: string,
        account?: string,
    ): Observable<Object | IErrorMessageData> {
        return from(
            this.ethereumService.isLoopRequired()
                ? this.foldingPositionsService.calculateIncreaseSimplePositionWithLoop(
                      platform,
                      principalToken,
                      principalAmount,
                      leverage,
                      borrowToken,
                  )
                : this.foldingPositionsService.calculateIncreaseSimplePosition(
                      platform,
                      principalToken,
                      principalAmount,
                      leverage,
                      borrowToken,
                  ),
        ).pipe(
            catchError((error) => of({ error })),
            map((params) => (account ? { ...params, account } : params)),
            switchMap((params) =>
                from(
                    this.ethereumService.isLoopRequired()
                        ? this.foldingPositionsService.increaseSimplePositionWithLoop(
                              params as IIncreaseSimplePositionWithLoop,
                          )
                        : this.foldingPositionsService.increaseSimplePosition(
                              params as IIncreaseSimplePosition,
                          ),
                ),
            ),
        );
    }

    calculateAndDecreaseSimplePosition(position: IPosition, amount: BigNumber) {
        return from(
            this.ethereumService.isLoopRequired()
                ? this.foldingPositionsService.calculateDecreaseSimplePositionWithLoop(
                      position,
                      amount,
                  )
                : this.foldingPositionsService.calculateDecreaseSimplePosition(
                      position,
                      amount,
                  ),
        ).pipe(
            catchError((error) => of({ error })),
            map((params) => ({ ...params, account: position.positionAddress })),
            switchMap((params) =>
                from(
                    this.ethereumService.isLoopRequired()
                        ? this.foldingPositionsService.decreaseSimplePositionWithLoop(
                              params as IDecreaseSimplePositionWithLoop,
                          )
                        : this.foldingPositionsService.decreaseSimplePosition(
                              params as IDecreaseSimplePosition,
                          ),
                ),
            ),
        );
    }

    calculateAndIncreaseSimplePositionLeverage(
        position: IPosition,
        leverage: number,
    ) {
        return from(
            this.ethereumService.isLoopRequired()
                ? this.foldingPositionsService.calculateIncreaseSimplePositionByLeverageWithLoop(
                      position,
                      leverage,
                  )
                : this.foldingPositionsService.calculateIncreaseSimplePositionByLeverage(
                      position,
                      leverage,
                  ),
        ).pipe(
            catchError((error) => of({ error })),
            map((params) => ({ ...params, account: position.positionAddress })),
            switchMap((params) =>
                from(
                    this.ethereumService.isLoopRequired()
                        ? this.foldingPositionsService.increaseSimplePositionWithLoop(
                              params as IIncreaseSimplePositionWithLoop,
                          )
                        : this.foldingPositionsService.increaseSimplePosition(
                              params as IIncreaseSimplePosition,
                          ),
                ),
            ),
        );
    }

    calculateAndDecreaseSimplePositionLeverage(
        position: IPosition,
        leverage: number,
    ) {
        return from(
            this.ethereumService.isLoopRequired()
                ? this.foldingPositionsService.calculateDecreaseSimplePositionByLeverageWithLoop(
                      position,
                      leverage,
                  )
                : this.foldingPositionsService.calculateDecreaseSimplePositionByLeverage(
                      position,
                      leverage,
                  ),
        ).pipe(
            catchError((error) => of({ error })),
            map((params) => ({ ...params, account: position.positionAddress })),
            switchMap((params) =>
                from(
                    this.ethereumService.isLoopRequired()
                        ? this.foldingPositionsService.decreaseSimplePositionWithLoop(
                              params as IDecreaseSimplePositionWithLoop,
                          )
                        : this.foldingPositionsService.decreaseSimplePosition(
                              params as IDecreaseSimplePosition,
                          ),
                ),
            ),
        );
    }

    calculateAndCloseSimplePosition(position: IPosition) {
        return from(
            this.ethereumService.isLoopRequired()
                ? this.foldingPositionsService.calculateCloseSimplePositionWithLoop(
                      position,
                  )
                : this.foldingPositionsService.calculateCloseSimplePosition(
                      position,
                  ),
        ).pipe(
            catchError((error) => of({ error })),
            map((params) => ({ ...params, account: position.positionAddress })),
            switchMap((params) =>
                from(
                    this.ethereumService.isLoopRequired()
                        ? this.foldingPositionsService.decreaseSimplePositionWithLoop(
                              params as IDecreaseSimplePositionWithLoop,
                          )
                        : this.foldingPositionsService.decreaseSimplePosition(
                              params as IDecreaseSimplePosition,
                          ),
                ),
            ),
        );
    }

    getPositionDetails(position: IPosition): IPositionDetails {
        return {
            principalValue: position.principalValue,
            principalValueUsd: position.principalValueUsd,
            positionValue: position.positionValue,
            positionValueUsd: position.positionValueUsd,
            pnl: ensureNumberIsReadable(
                (position.positionValue / position.principalValue - 1) * 100,
            ),
            executionPrice: 0,
            supplyAmount: position.supplyAmount,
            supplyAmountUsd: position.supplyAmountUsd,
            borrowAmount: position.borrowAmount,
            borrowAmountUsd: position.borrowAmountUsd,
            borrowLimitUsage: ensureNumberIsReadable(
                position.borrowAmountUsd /
                    (position.supplyAmountUsd *
                        position.supplyMarket.collateralFactor),
            ),
            nativeApr:
                ((position.leverage + 1) * position.supplyMarket.supplyAPR -
                    position.leverage * position.borrowMarket.borrowAPR) *
                100,
            apr: position.apr,
            distributionApr:
                (position.leverage + 1) *
                    position.supplyMarket?.supplyRewardsAPR +
                position.leverage * position.borrowMarket?.borrowRewardsAPR,
        };
    }

    calculateIncreaseSimplePosition(
        platform: string,
        principalToken: string,
        principalAmount: BigNumber,
        leverage: number,
        borrowToken: string,
    ): Observable<IIncreaseSimplePosition> {
        return from(
            this.foldingPositionsService.calculateIncreaseSimplePosition(
                platform,
                principalToken,
                principalAmount,
                leverage,
                borrowToken,
            ),
        );
    }

    calculateIncreaseSimplePositionWithLoop(
        platform: string,
        principalToken: string,
        principalAmount: BigNumber,
        leverage: number,
        borrowToken: string,
    ): Observable<IIncreaseSimplePositionWithLoop> {
        return from(
            this.foldingPositionsService.calculateIncreaseSimplePositionWithLoop(
                platform,
                principalToken,
                principalAmount,
                leverage,
                borrowToken,
            ),
        );
    }

    calculateDecreaseSimplePosition(
        position: IPosition,
        amount: BigNumber,
    ): Observable<IDecreaseSimplePosition> {
        return from(
            this.foldingPositionsService.calculateDecreaseSimplePosition(
                position,
                amount,
            ),
        );
    }

    calculateDecreaseSimplePositionWithLoop(
        position: IPosition,
        amount: BigNumber,
    ): Observable<IDecreaseSimplePositionWithLoop> {
        return from(
            this.foldingPositionsService.calculateDecreaseSimplePositionWithLoop(
                position,
                amount,
            ),
        );
    }

    calculateCloseSimplePosition(
        position: IPosition,
    ): Observable<IDecreaseSimplePosition> {
        return from(
            this.foldingPositionsService.calculateCloseSimplePosition(position),
        );
    }

    calculateCloseSimplePositionWithLoop(
        position: IPosition,
    ): Observable<IDecreaseSimplePositionWithLoop> {
        return from(
            this.foldingPositionsService.calculateCloseSimplePositionWithLoop(
                position,
            ),
        );
    }

    calculateIncreaseSimplePositionByLeverage(
        position: IPosition,
        leverage: number,
    ): Observable<IIncreaseSimplePosition> {
        return from(
            this.foldingPositionsService.calculateIncreaseSimplePositionByLeverage(
                position,
                leverage,
            ),
        );
    }

    calculateIncreaseSimplePositionByLeverageWithLoop(
        position: IPosition,
        leverage: number,
    ): Observable<IIncreaseSimplePositionWithLoop> {
        return from(
            this.foldingPositionsService.calculateIncreaseSimplePositionByLeverageWithLoop(
                position,
                leverage,
            ),
        );
    }

    calculateDecreaseSimplePositionByLeverage(
        position: IPosition,
        leverage: number,
    ): Observable<IDecreaseSimplePosition> {
        return from(
            this.foldingPositionsService.calculateDecreaseSimplePositionByLeverage(
                position,
                leverage,
            ),
        );
    }

    calculateDecreaseSimplePositionByLeverageWithLoop(
        position: IPosition,
        leverage: number,
    ): Observable<IDecreaseSimplePositionWithLoop> {
        return from(
            this.foldingPositionsService.calculateDecreaseSimplePositionByLeverageWithLoop(
                position,
                leverage,
            ),
        );
    }

    simulateIncreaseSimplePosition(
        position: IPosition,
        delta: BigNumber,
        leverage?: number,
    ): Observable<IPositionDetails> {
        return this.ethereumService.isLoopRequired()
            ? this.calculateIncreaseSimplePositionWithLoop(
                  position.platformAddress,
                  position.supplyTokenAddress,
                  delta,
                  leverage || position.leverage,
                  position.borrowTokenAddress,
              ).pipe(
                  map((output) => {
                      const borrowAmount = parseBigNumber(
                          output.totalBorrowAmount,
                          position.borrowMarket.assetDecimals,
                      );

                      const borrowAmountUsd =
                          borrowAmount * position.borrowMarket.assetUsdValue;

                      const principalValue = parseBigNumber(
                          output.principalAmount,
                          position.supplyMarket.assetDecimals,
                      );

                      const principalValueUsd =
                          principalValue * position.supplyMarket.assetUsdValue;

                      const supplyAmount =
                          parseBigNumber(
                              delta,
                              position.supplyMarket.assetDecimals,
                          ) *
                          ((leverage || position.leverage) + 1);

                      const supplyAmountUsd =
                          supplyAmount * position.supplyMarket.assetUsdValue;

                      const positionValueUsd =
                          supplyAmountUsd - borrowAmountUsd;
                      const positionValue =
                          positionValueUsd /
                          position.supplyMarket.assetUsdValue;

                      return {
                          ...this.getPositionDetails({
                              ...position,
                              leverage: leverage || position.leverage,
                              principalValue:
                                  (position.principalValue || 0) +
                                  principalValue,
                              principalValueUsd:
                                  (position.principalValueUsd || 0) +
                                  principalValueUsd,
                              borrowAmount:
                                  (position.borrowAmount || 0) + borrowAmount,
                              borrowAmountUsd:
                                  (position.borrowAmountUsd || 0) +
                                  borrowAmountUsd,
                              supplyAmount:
                                  (position.supplyAmount || 0) + supplyAmount,
                              supplyAmountUsd:
                                  (position.supplyAmountUsd || 0) +
                                  supplyAmountUsd,
                              positionValue:
                                  (position.positionValue || 0) + positionValue,
                              positionValueUsd:
                                  (position.positionValueUsd || 0) +
                                  positionValueUsd,
                          }),
                          executionPrice: output.executionPrice,
                      };
                  }),
              )
            : this.calculateIncreaseSimplePosition(
                  position.platformAddress,
                  position.supplyTokenAddress,
                  delta,
                  leverage || position.leverage,
                  position.borrowTokenAddress,
              ).pipe(
                  map((output) => {
                      const borrowAmount = parseBigNumber(
                          output.borrowAmount,
                          position.borrowMarket.assetDecimals,
                      );

                      const borrowAmountUsd =
                          borrowAmount * position.borrowMarket.assetUsdValue;

                      const principalValue = parseBigNumber(
                          output.principalAmount,
                          position.supplyMarket.assetDecimals,
                      );

                      const principalValueUsd =
                          principalValue * position.supplyMarket.assetUsdValue;

                      const supplyAmount = parseBigNumber(
                          output.supplyAmount,
                          position.supplyMarket.assetDecimals,
                      );

                      const supplyAmountUsd =
                          supplyAmount * position.supplyMarket.assetUsdValue;

                      const positionValueUsd =
                          supplyAmountUsd - borrowAmountUsd;
                      const positionValue =
                          positionValueUsd /
                          position.supplyMarket.assetUsdValue;

                      return {
                          ...this.getPositionDetails({
                              ...position,
                              leverage: leverage || position.leverage,
                              principalValue:
                                  (position.principalValue || 0) +
                                  principalValue,
                              principalValueUsd:
                                  (position.principalValueUsd || 0) +
                                  principalValueUsd,
                              borrowAmount:
                                  (position.borrowAmount || 0) + borrowAmount,
                              borrowAmountUsd:
                                  (position.borrowAmountUsd || 0) +
                                  borrowAmountUsd,
                              supplyAmount:
                                  (position.supplyAmount || 0) + supplyAmount,
                              supplyAmountUsd:
                                  (position.supplyAmountUsd || 0) +
                                  supplyAmountUsd,
                              positionValue:
                                  (position.positionValue || 0) + positionValue,
                              positionValueUsd:
                                  (position.positionValueUsd || 0) +
                                  positionValueUsd,
                          }),
                          executionPrice: output.executionPrice,
                      };
                  }),
              );
    }

    simulateDecreaseSimplePosition(
        position: IPosition,
        delta: BigNumber,
    ): Observable<IPositionDetails> {
        return this.ethereumService.isLoopRequired()
            ? this.calculateDecreaseSimplePositionWithLoop(
                  position,
                  delta,
              ).pipe(
                  map((output) => {
                      const repayAmount = parseBigNumber(
                          output.repayAmount,
                          position.borrowMarket.assetDecimals,
                      );

                      const redeemAmount = parseBigNumber(
                          output.maxRedeemAmount,
                          position.supplyMarket.assetDecimals,
                      );

                      const withdrawAmount = parseBigNumber(
                          output.withdrawAmount,
                          position.supplyMarket.assetDecimals,
                      );

                      const borrowAmount = position.borrowAmount - repayAmount;
                      const borrowAmountUsd =
                          borrowAmount * position.borrowMarket.assetUsdValue;

                      const principalValue =
                          position.principalValue - withdrawAmount;
                      const principalValueUsd =
                          principalValue * position.supplyMarket.assetUsdValue;

                      const supplyAmount =
                          position.supplyAmount - redeemAmount - withdrawAmount;
                      const supplyAmountUsd =
                          supplyAmount * position.supplyMarket.assetUsdValue;

                      const positionValueUsd =
                          supplyAmountUsd - borrowAmountUsd;
                      const positionValue =
                          positionValueUsd /
                          position.supplyMarket.assetUsdValue;

                      return {
                          ...this.getPositionDetails({
                              ...position,
                              principalValue,
                              principalValueUsd,
                              borrowAmount,
                              borrowAmountUsd,
                              supplyAmount,
                              supplyAmountUsd,
                              positionValue,
                              positionValueUsd,
                          }),
                          executionPrice: output.executionPrice,
                      };
                  }),
              )
            : this.calculateDecreaseSimplePosition(position, delta).pipe(
                  map((output) => {
                      const repayAmount = parseBigNumber(
                          output.borrowTokenRepayAmount,
                          position.borrowMarket.assetDecimals,
                      );

                      const withdrawAmount = parseBigNumber(
                          output.withdrawAmount,
                          position.supplyMarket.assetDecimals,
                      );

                      const borrowAmount = position.borrowAmount - repayAmount;
                      const borrowAmountUsd =
                          borrowAmount * position.borrowMarket.assetUsdValue;

                      const principalValue =
                          position.principalValue - withdrawAmount;
                      const principalValueUsd =
                          principalValue * position.supplyMarket.assetUsdValue;

                      const supplyAmount =
                          position.supplyAmount -
                          withdrawAmount * (position.leverage + 1);
                      const supplyAmountUsd =
                          supplyAmount * position.supplyMarket.assetUsdValue;

                      const positionValueUsd =
                          supplyAmountUsd - borrowAmountUsd;
                      const positionValue =
                          positionValueUsd /
                          position.supplyMarket.assetUsdValue;

                      return {
                          ...this.getPositionDetails({
                              ...position,
                              principalValue,
                              principalValueUsd,
                              borrowAmount,
                              borrowAmountUsd,
                              supplyAmount,
                              supplyAmountUsd,
                              positionValue,
                              positionValueUsd,
                          }),
                          executionPrice: output.executionPrice,
                      };
                  }),
              );
    }

    simulateIncreaseSimplePositionByLeverage(
        position: IPosition,
        leverage: number,
    ): Observable<IPositionDetails> {
        return this.ethereumService.isLoopRequired()
            ? this.calculateIncreaseSimplePositionByLeverageWithLoop(
                  position,
                  leverage,
              ).pipe(
                  map((output) => {
                      const borrowAmount =
                          position.borrowAmount +
                          parseBigNumber(
                              output.totalBorrowAmount,
                              position.borrowMarket.assetDecimals,
                          );

                      const borrowAmountUsd =
                          borrowAmount * position.borrowMarket.assetUsdValue;

                      const supplyAmount =
                          position.supplyAmount +
                          parseBigNumber(
                              output.supplyAmount,
                              position.supplyMarket.assetDecimals,
                          );

                      const supplyAmountUsd =
                          supplyAmount * position.supplyMarket.assetUsdValue;

                      const positionValueUsd =
                          supplyAmountUsd - borrowAmountUsd;
                      const positionValue =
                          positionValueUsd /
                          position.supplyMarket.assetUsdValue;

                      return {
                          ...this.getPositionDetails({
                              ...position,
                              leverage,
                              borrowAmount,
                              borrowAmountUsd,
                              supplyAmount,
                              supplyAmountUsd,
                              positionValue,
                              positionValueUsd,
                          }),
                          executionPrice: output.executionPrice,
                      };
                  }),
              )
            : this.calculateIncreaseSimplePositionByLeverage(
                  position,
                  leverage,
              ).pipe(
                  map((output) => {
                      const borrowAmount =
                          position.borrowAmount +
                          parseBigNumber(
                              output.borrowAmount,
                              position.borrowMarket.assetDecimals,
                          );

                      const borrowAmountUsd =
                          borrowAmount * position.borrowMarket.assetUsdValue;

                      const supplyAmount =
                          position.supplyAmount +
                          parseBigNumber(
                              output.supplyAmount,
                              position.supplyMarket.assetDecimals,
                          );
                      const supplyAmountUsd =
                          supplyAmount * position.supplyMarket.assetUsdValue;

                      const positionValueUsd =
                          supplyAmountUsd - borrowAmountUsd;
                      const positionValue =
                          positionValueUsd /
                          position.supplyMarket.assetUsdValue;

                      return {
                          ...this.getPositionDetails({
                              ...position,
                              leverage,
                              borrowAmount,
                              borrowAmountUsd,
                              supplyAmount,
                              supplyAmountUsd,
                              positionValue,
                              positionValueUsd,
                          }),
                          executionPrice: output.executionPrice,
                      };
                  }),
              );
    }

    simulateDecreaseSimplePositionByLeverage(
        position: IPosition,
        leverage: number,
    ): Observable<IPositionDetails> {
        return this.ethereumService.isLoopRequired()
            ? this.calculateDecreaseSimplePositionByLeverageWithLoop(
                  position,
                  leverage,
              ).pipe(
                  map((output) => {
                      const repayAmount = parseBigNumber(
                          output.repayAmount,
                          position.borrowMarket.assetDecimals,
                      );

                      const borrowAmount = position.borrowAmount - repayAmount;
                      const borrowAmountUsd =
                          borrowAmount * position.borrowMarket.assetUsdValue;

                      const supplyAmount =
                          position.supplyAmount -
                          position.positionValue *
                              (position.leverage - leverage);
                      const supplyAmountUsd =
                          supplyAmount * position.supplyMarket.assetUsdValue;

                      const positionValueUsd =
                          supplyAmountUsd - borrowAmountUsd;
                      const positionValue =
                          positionValueUsd /
                          position.supplyMarket.assetUsdValue;

                      return {
                          ...this.getPositionDetails({
                              ...position,
                              leverage,
                              borrowAmount,
                              borrowAmountUsd,
                              supplyAmount,
                              supplyAmountUsd,
                              positionValue,
                              positionValueUsd,
                          }),
                          executionPrice: output.executionPrice,
                      };
                  }),
              )
            : this.calculateDecreaseSimplePositionByLeverage(
                  position,
                  leverage,
              ).pipe(
                  map((output) => {
                      const borrowAmount =
                          position.borrowAmount -
                          parseBigNumber(
                              output.borrowTokenRepayAmount,
                              position.borrowMarket.assetDecimals,
                          );

                      const borrowAmountUsd =
                          borrowAmount * position.borrowMarket.assetUsdValue;

                      const supplyAmount =
                          position.supplyAmount -
                          position.positionValue *
                              (position.leverage - leverage);
                      const supplyAmountUsd =
                          supplyAmount * position.supplyMarket.assetUsdValue;

                      const positionValueUsd =
                          supplyAmountUsd - borrowAmountUsd;
                      const positionValue =
                          positionValueUsd /
                          position.supplyMarket.assetUsdValue;

                      return {
                          ...this.getPositionDetails({
                              ...position,
                              leverage,
                              borrowAmount,
                              borrowAmountUsd,
                              supplyAmount,
                              supplyAmountUsd,
                              positionValue,
                              positionValueUsd,
                          }),
                          executionPrice: output.executionPrice,
                      };
                  }),
              );
    }

    simulateClosePosition(position: IPosition): Observable<IPositionDetails> {
        return this.ethereumService.isLoopRequired()
            ? this.calculateCloseSimplePositionWithLoop(position).pipe(
                  map((output) => {
                      const borrowAmount =
                          position.borrowAmount -
                          parseBigNumber(
                              output.minRepayAmount,
                              position.borrowMarket.assetDecimals,
                          );
                      const borrowAmountUsd =
                          borrowAmount * position.borrowMarket.assetUsdValue;

                      const supplyAmount = 0;
                      const supplyAmountUsd = 0;

                      const principalValue = undefined;
                      const principalValueUsd = undefined;

                      const positionValueUsd =
                          supplyAmountUsd - borrowAmountUsd;
                      const positionValue =
                          positionValueUsd /
                          position.supplyMarket.assetUsdValue;

                      return {
                          ...this.getPositionDetails({
                              ...position,
                              borrowAmount,
                              borrowAmountUsd,
                              supplyAmount,
                              supplyAmountUsd,
                              positionValue,
                              positionValueUsd,
                              principalValue,
                              principalValueUsd,
                          }),
                          executionPrice: output.executionPrice,
                      };
                  }),
              )
            : this.calculateCloseSimplePosition(position).pipe(
                  map((output) => {
                      const borrowAmount = 0;
                      const borrowAmountUsd = 0;

                      const supplyAmount = 0;
                      const supplyAmountUsd = 0;

                      const principalValue = undefined;
                      const principalValueUsd = undefined;

                      const positionValueUsd =
                          supplyAmountUsd - borrowAmountUsd;
                      const positionValue =
                          positionValueUsd /
                          position.supplyMarket.assetUsdValue;

                      return {
                          ...this.getPositionDetails({
                              ...position,
                              borrowAmount,
                              borrowAmountUsd,
                              supplyAmount,
                              supplyAmountUsd,
                              positionValue,
                              positionValueUsd,
                              principalValue,
                              principalValueUsd,
                          }),
                          executionPrice: output.executionPrice,
                      };
                  }),
              );
    }

    getAllPNLSettings(position: IPosition): Observable<IPNLSettings> {
        return from(
            this.foldingPositionsService.getAllPNLSettings(
                position.positionAddress,
            ),
        ).pipe(
            map((pnlSettings) =>
                pnlSettings.map((sltp) => ({
                    priceTarget:
                        1 /
                        parseBigNumber(
                            sltp[0],
                            18 +
                                position.borrowMarket.assetDecimals -
                                position.supplyMarket.assetDecimals,
                        ),
                    fixedReward: parseBigNumber(
                        sltp[1],
                        position.supplyMarket.assetDecimals,
                    ),
                    percentageReward: parseBigNumber(sltp[2]) * 100,
                    unwindFactor: parseBigNumber(sltp[3]) * 100,
                    isTakeProfit: sltp[4],
                })),
            ),
        );
    }

    configurePNL(
        position: IPosition,
        priceTarget: number,
        fixedReward: number,

        percentageReward: number,
        unwindFactor: number,
        isTakeProfit: boolean,
    ): Observable<Object | IErrorMessageData> {
        return from(
            this.foldingPositionsService.configurePNL(
                position.positionAddress,
                convertToBigNumber(
                    priceTarget,
                    18 +
                        position.borrowMarket.assetDecimals -
                        position.supplyMarket.assetDecimals,
                ),
                convertToBigNumber(
                    fixedReward,
                    position.supplyMarket.assetDecimals,
                ),
                convertToBigNumber(percentageReward / 100),
                convertToBigNumber(unwindFactor / 100),
                isTakeProfit,
            ),
        );
    }

    removePNLSetting(
        position: IPosition,
        index: number,
    ): Observable<Object | IErrorMessageData> {
        return from(
            this.foldingPositionsService.removePNLSetting(
                position.positionAddress,
                convertToBigNumber(index, 0),
            ),
        );
    }

    getStopLossConfiguration(
        account: string,
    ): Observable<[ethers.BigNumber, ethers.BigNumber, ethers.BigNumber]> {
        return from(
            this.foldingPositionsService.getStopLossConfiguration(account),
        );
    }

    configureStopLoss(
        account: string,
        unwindFactor: ethers.BigNumber,
        slippageIncentive: ethers.BigNumber,
        collateralUsageLimit: ethers.BigNumber,
    ): Observable<Object | IErrorMessageData> {
        return from(
            this.foldingPositionsService.configureStopLoss(
                account,
                unwindFactor,
                slippageIncentive,
                collateralUsageLimit,
            ),
        );
    }
}
