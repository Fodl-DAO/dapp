import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import {
    debounceTime,
    filter,
    mergeMap,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { IAsset } from '../../../interfaces/asset.interface';
import { IMarket } from '../../../interfaces/market.interface';
import { IPosition } from '../../../interfaces/position.interface';
import { IPositionDetails } from '../../../interfaces/positionDetails.interface';
import { IPositionRouteParams } from '../../../interfaces/positionRouteParams.interface';
import { ITransactionData } from '../../../interfaces/transactionData.interface';

import { DIALOG_MEDIUM } from '../../../constants/commons';

import { parseBigNumber } from '../../../utilities/bigNumber';
import { displayBigNumber } from '../../../utilities/displayBigNumber';
import { extractAssetFromMarket } from '../../../utilities/extractAssetFromMarket';
import { isExchangeReverseRequired } from '../../../utilities/formatExchangeRate';
import { formatNumber } from '../../../utilities/formatValue';
import { getRouteBase } from '../../../utilities/getRouteBase';
import { getMaxLeverage } from '../../../utilities/maxLeverage';

import { ConfigurationService } from '../../../services/configuration/configuration.service';
import { FoldingService } from '../../../services/folding/folding.service';
import { MarketsService } from '../../../services/markets/markets.service';
import { SettingsService } from '../../../services/settings/settings.service';

import { TransactionComponent } from '../../transaction/transaction.component';

import { BigNumber, ethers } from 'ethers';

@Component({
    selector: 'app-position-form',
    templateUrl: './position-form.component.html',
})
export class PositionFormComponent implements OnChanges, OnDestroy, OnInit {
    @Input() position: IPosition;
    @Input() edit: string;

    @Output() simulatedPositionDetails: EventEmitter<IPositionDetails> =
        new EventEmitter<IPositionDetails>();

    readonly MIN_LEVERAGE = 0.001;
    readonly MIN_MARKET_COLLATERAL_FACTOR = 0.55;
    readonly DEBOUNCE_SIMULATE_SEC = 500;
    readonly REFRESH_INTERVAL = 10000;

    settingSLTP: boolean;
    sltp: boolean;

    simulate$ = new BehaviorSubject<Observable<IPositionDetails>>(undefined);
    unsubscribe$ = new Subject();

    supplyAsset: IAsset;
    borrowAsset: IAsset;

    supplyAmount: BigNumber = ethers.constants.Zero;
    supplyDelta: BigNumber = ethers.constants.Zero;

    leverage: number;
    maxLeverage: number;

    slippage: number;

    longMarkets: IMarket[];
    shortMarkets: IMarket[];

    action = 'supply';

    liquidationPrice = 0;
    liquidationPriceDifference = 0;

    executionPrice = 0;
    executionPriceImpact = 0;

    lastSimulationTime: number = 0;
    simulationValid: boolean = false;
    simulationCooldown: any;

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private configurationService: ConfigurationService,
        private settingsService: SettingsService,
        public activatedRoute: ActivatedRoute,
        public foldingService: FoldingService,
        public marketsService: MarketsService,
    ) {}

    ngOnInit() {
        this.sltp = this.configurationService.getValue('sltp');

        this.settingsService.settings$
            .pipe(
                filter((settings) => !!settings),
                takeUntil(this.unsubscribe$),
            )
            .subscribe((settings) => (this.slippage = settings.slippage));

        // Perform simulating
        this.simulate$
            .pipe(
                filter((simulate$) => !!simulate$),
                takeUntil(this.unsubscribe$),
                debounceTime(this.DEBOUNCE_SIMULATE_SEC),
                tap(() => this.foldingService.simulating$.next(true)),
                switchMap((simulate$) => {
                    return combineLatest([
                        this.position.borrowMarket.updateAssetUsdValue(),
                        this.position.supplyMarket.updateAssetUsdValue(),
                    ]).pipe(switchMap(() => simulate$));
                }),
            )
            .subscribe((positionDetails: IPositionDetails) => {
                this.updatePositionPrices(positionDetails);
                this.foldingService.simulating$.next(false);
                this.simulatedPositionDetails.emit(positionDetails);

                this.lastSimulationTime = Date.now();
                this.simulationValid = true;
                this.simulationCooldown = setTimeout(() => {
                    if (
                        Date.now() - this.lastSimulationTime >=
                        this.REFRESH_INTERVAL
                    )
                        this.simulationValid = false;
                }, this.REFRESH_INTERVAL);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        // User changed short/long/both assets
        if (changes.position) {
            this.marketsService.assetMarkets$
                .pipe(
                    filter((markets) => !!markets),
                    takeUntil(this.unsubscribe$),
                )
                .subscribe((markets) => {
                    this.updatePositionInputs(markets);
                    this.simulate();
                });
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    updatePositionPrices(details: IPositionDetails) {
        this.executionPrice = details.executionPrice;

        this.liquidationPrice = this.getLiquidationPrice(
            details.supplyAmount,
            details.borrowAmount,
        );

        [this.liquidationPriceDifference, this.executionPriceImpact] = [
            this.getPriceDifference(this.liquidationPrice),
            this.getPriceDifference(this.executionPrice),
        ];
    }

    updatePositionInputs(markets: IMarket[]) {
        this.longMarkets = markets?.filter(
            (market) =>
                market.collateralFactor > this.MIN_MARKET_COLLATERAL_FACTOR,
        );

        // Prepare short assets for selecting from asset-select
        // component based on platform from long asset
        this.shortMarkets = markets.filter(
            (market) =>
                market.platform.address.toLowerCase() ===
                this.position.platformAddress.toLowerCase(),
        );

        [this.supplyAsset, this.borrowAsset] = [
            extractAssetFromMarket(this.position.supplyMarket),
            extractAssetFromMarket(this.position.borrowMarket),
        ];

        // Truncate to two decimal places
        this.leverage = Math.floor(this.position.leverage * 100) / 100;

        this.maxLeverage = getMaxLeverage(
            this.position.supplyMarket.collateralFactor,
        );
    }

    isOpenPosition(): boolean {
        return this.position.positionValueUsd > 0.5;
    }

    async navigateWithParams(params: IPositionRouteParams) {
        await this.router.navigate([
            getRouteBase(this.router.url),
            {
                ...this.activatedRoute.snapshot.params,
                ...params,
            },
        ]);
    }

    async onBothAssetsChange() {
        this.supplyAmount = ethers.constants.Zero;
        await this.navigateWithParams({
            platform: this.supplyAsset.platformAddress,
            supplyAsset: this.supplyAsset.address,
            borrowAsset: this.borrowAsset.address,
        });
    }

    async onSupplyAssetChange() {
        this.supplyAmount = ethers.constants.Zero;
        await this.navigateWithParams({
            platform: this.supplyAsset.platformAddress,
            supplyAsset: this.supplyAsset.address,
            borrowAsset: this.borrowAsset.address,
        });
    }

    async onBorrowAssetChange() {
        await this.navigateWithParams({
            platform: this.supplyAsset.platformAddress,
            supplyAsset: this.supplyAsset.address,
            borrowAsset: this.borrowAsset.address,
        });
    }

    async swapAssets() {
        const temp = this.borrowAsset;

        this.borrowAsset = this.supplyAsset;
        this.supplyAsset = temp;

        await this.onBothAssetsChange();
    }

    getMax(): BigNumber {
        const market = this.longMarkets.find(
            (market) =>
                market.assetAddress.toLowerCase() ===
                this.supplyAsset.address.toLowerCase(),
        );
        return market ? market?.walletBalance : ethers.constants.Zero;
    }

    get max(): string {
        return displayBigNumber(this.getMax(), this.supplyAsset.decimals);
    }

    setMax() {
        this.supplyAmount = this.getMax();
        this.simulate();
    }

    getMaxDelta(): BigNumber {
        return this.action === 'supply'
            ? this.getMax()
            : this.position.positionValueBigNumber;
    }

    get maxDelta(): string {
        return displayBigNumber(this.getMaxDelta(), this.supplyAsset.decimals);
    }

    setMaxDelta() {
        this.supplyDelta = this.getMaxDelta();
        this.simulate();
    }

    modifyLeverage(amount: number) {
        if (!this.leverage) {
            this.leverage = this.MIN_LEVERAGE;
        }

        this.leverage += amount;

        if (this.leverage < this.MIN_LEVERAGE) {
            this.leverage = this.MIN_LEVERAGE;
        }

        if (this.leverage > this.maxLeverage) {
            this.leverage = this.maxLeverage;
        }

        this.leverage = formatNumber(this.leverage);

        this.simulate();
    }

    onTypeActionChange(): void {
        this.supplyDelta = ethers.constants.Zero;
        this.simulate();
    }

    getValueUSD(amount, address, platform) {
        const market = this.marketsService.findMarket(platform, address);
        return (
            parseBigNumber(amount, market?.assetDecimals) *
            market?.assetUsdValue
        );
    }

    get supplyAmountUsd(): number {
        return this.getValueUSD(
            this.supplyAmount,
            this.supplyAsset.address,
            this.supplyAsset.platformAddress,
        );
    }

    get supplyDeltaUsd(): number {
        return this.getValueUSD(
            this.supplyDelta,
            this.supplyAsset.address,
            this.supplyAsset.platformAddress,
        );
    }

    getSupplyMarket(): IMarket {
        return this.marketsService.findMarket(
            this.supplyAsset.platformAddress,
            this.supplyAsset.address,
        );
    }

    getLiquidationPrice(supplyAmount: number, borrowAmount: number): number {
        return (
            (supplyAmount * this.position.supplyMarket.liquidationFactor) /
            borrowAmount
        );
    }

    getPriceDifference(price: number): number {
        const oraclePrice =
            this.position.borrowMarket.assetUsdValue /
            this.position.supplyMarket.assetUsdValue;

        return isExchangeReverseRequired(
            price,
            this.position.supplyMarket.assetSymbol,
            this.position.borrowMarket.assetSymbol,
        )
            ? oraclePrice / price - 1
            : price / oraclePrice - 1;
    }

    get allowSwapAssets(): boolean {
        return (
            this.edit === 'all' &&
            this.getSupplyMarket() &&
            this.shortMarkets
                .map((borrowMarket) => borrowMarket.assetAddress.toLowerCase())
                .includes(this.getSupplyMarket().assetAddress.toLowerCase())
        );
    }

    validateSupplyAmount(): string {
        return !this.supplyAmount || !this.supplyAmount.gt(0)
            ? 'Principal Investment is too low'
            : this.supplyAmount.gt(this.getMax())
            ? 'Insufficient ' + this.supplyAsset.name + ' balance'
            : '';
    }

    validateSupplyDelta(): string {
        const actionLabel = this.action === 'supply' ? 'Supply' : 'Withdraw';
        return !this.supplyDelta || !this.supplyDelta.gt(0)
            ? actionLabel + ' amount is too low'
            : this.supplyDelta.gt(this.getMaxDelta())
            ? `Insufficient ${
                  this.supplyAsset.name
              } balance to ${actionLabel.toLowerCase()}`
            : '';
    }

    validateLeverage(): string {
        return !this.leverage || this.leverage < this.MIN_LEVERAGE
            ? 'Leverage is too low'
            : this.leverage > this.maxLeverage
            ? 'Leverage is too high'
            : '';
    }

    get showLiquidationPrice(): boolean {
        return (
            this.liquidationPrice &&
            this.liquidationPrice !== Infinity &&
            this.edit !== 'close'
        );
    }

    warnLiquidationPrice() {
        return Math.abs(this.liquidationPriceDifference) * 100 < 10;
    }

    getSubmitErrorText(): string {
        if (this.edit === 'leverage') {
            return this.validateLeverage();
        }

        if (this.edit === 'value') {
            return this.validateSupplyDelta();
        }

        if (this.edit === 'all') {
            return this.validateSupplyAmount()
                ? this.validateSupplyAmount()
                : this.validateLeverage();
        }

        return '';
    }

    get submitTitle(): string {
        const error = this.getSubmitErrorText();

        if (error) {
            return error;
        }

        if (this.lastSimulationTime > 0 && !this.simulationValid) {
            return 'Refresh Pricing';
        }

        switch (this.edit) {
            case 'all':
                return 'Open Position';

            case 'close':
                return 'Close Position';

            default:
                return `Change ${this.edit}`;
        }
    }

    get isSubmitButtonDisabled(): boolean {
        return (
            this.getSubmitErrorText() !== '' ||
            this.foldingService.simulating$.getValue()
        );
    }

    simulate() {
        const position: IPosition = {
            ...this.position,
            supplyTokenAddress: this.supplyAsset.address,
            borrowTokenAddress: this.borrowAsset.address,
        };

        this.simulate$.next(this.getSimulateAction(position));
    }

    getSimulateAction(position: IPosition): Observable<IPositionDetails> {
        // Simulate [modify value] when
        // user input delta is presented
        if (this.edit === 'value' && this.supplyDelta?.gt(0)) {
            return this.action === 'supply'
                ? // Supply - Increase value
                  this.foldingService.simulateIncreaseSimplePosition(
                      position,
                      this.supplyDelta,
                  )
                : // Withdraw - Decrease value
                  this.foldingService.simulateDecreaseSimplePosition(
                      position,
                      this.supplyDelta,
                  );
        }

        // Simulate [leverage change] when
        // user changed default leverage
        if (
            this.edit === 'leverage' &&
            this.leverage !== this.position.leverage
        ) {
            return this.leverage > this.position.leverage
                ? // Increase leverage
                  this.foldingService.simulateIncreaseSimplePositionByLeverage(
                      position,
                      this.leverage,
                  )
                : // Decrease leverage
                  this.foldingService.simulateDecreaseSimplePositionByLeverage(
                      position,
                      this.leverage,
                  );
        }

        // Simulate [close] position
        if (this.edit === 'close') {
            return this.foldingService.simulateClosePosition(position);
        }

        // Simulate [valid new position]
        if (this.edit === 'all' && this.supplyAmount?.gt(0)) {
            return this.foldingService.simulateIncreaseSimplePosition(
                position,
                this.supplyAmount,
                this.leverage,
            );
        }

        // Simulate [non-valid (default) new position]
        // or [view position]
        const details = this.foldingService.getPositionDetails({
            ...this.position,
            leverage: this.leverage || this.position.leverage,
        });

        return of(details);
    }

    submit() {
        if (!this.simulationValid) {
            return this.simulate();
        }
        this.openTransactionDialog();
    }

    openTransactionDialog() {
        this.getTransactionDialogData()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data) => {
                this.dialog.open(TransactionComponent, {
                    width: DIALOG_MEDIUM,
                    data: data,
                });
            });
    }

    getTransactionDialogData(): Observable<ITransactionData> {
        const updatesAndNavigationCallback = () => {
            this.marketsService.reloadMarkets();
            this.foldingService.loadPositions();
            this.router.navigate(['/positions']);
        };

        // Modify value of position
        if (this.edit === 'value') {
            return this.action === 'supply'
                ? // Supply - Increase value
                  of({
                      title: 'Increase Position',
                      actionDescription:
                          'Please confirm transaction to increase your position.',
                      approve: {
                          account: this.position.positionAddress,
                          amount: this.supplyDelta,
                          decimals: this.position.supplyMarket.assetDecimals,
                          token: this.position.supplyTokenAddress,
                      },
                      action: this.foldingService.calculateAndIncreaseSimplePosition(
                          this.position.platformAddress,
                          this.position.supplyTokenAddress,
                          this.supplyDelta,
                          this.leverage,
                          this.position.borrowTokenAddress,
                          this.position.positionAddress,
                      ),
                      callback: updatesAndNavigationCallback,
                  })
                : // Withdraw - Decrease Value
                  of({
                      title: 'Decrease Position',
                      actionDescription:
                          'Please confirm transaction to decrease your position.',
                      action: this.foldingService.calculateAndDecreaseSimplePosition(
                          this.position,
                          this.supplyDelta,
                      ),
                      callback: updatesAndNavigationCallback,
                  });
        }

        // Modify leverage of position
        if (this.edit === 'leverage') {
            return of({
                title: 'Change Leverage',
                actionDescription:
                    'Please confirm position leverage change transaction',
                action:
                    this.leverage > this.position.leverage
                        ? // Increase Leverage
                          this.foldingService.calculateAndIncreaseSimplePositionLeverage(
                              this.position,
                              this.leverage,
                          )
                        : // Decrease Leverage
                          this.foldingService.calculateAndDecreaseSimplePositionLeverage(
                              this.position,
                              this.leverage,
                          ),
                callback: updatesAndNavigationCallback,
            });
        }

        // Close position
        if (this.edit === 'close') {
            return of({
                title: 'Close Position',
                actionDescription: 'Accept transaction to close your position.',
                action: this.foldingService.calculateAndCloseSimplePosition(
                    this.position,
                ),
                callback: updatesAndNavigationCallback,
            });
        }

        // Open new position
        // (get new position address and return dialog data)
        return this.foldingService.createFoldingAccount(true).pipe(
            mergeMap((account: string) => {
                return of({
                    title: 'Open Leverage Position',
                    actionDescription: `Please sign a transaction to send ${displayBigNumber(
                        this.supplyAmount,
                        this.supplyAsset.decimals,
                    )} ${
                        this.supplyAsset.name
                    } to be used as a principal investment.`,
                    approve: {
                        account: account,
                        amount: this.supplyAmount,
                        decimals: this.position.supplyMarket.assetDecimals,
                        token: this.supplyAsset.address,
                    },
                    callback: () => {
                        this.supplyAmount = ethers.constants.Zero;
                        updatesAndNavigationCallback();
                    },
                    action: this.foldingService.calculateAndIncreaseSimplePosition(
                        this.supplyAsset.platformAddress,
                        this.supplyAsset.address,
                        this.supplyAmount,
                        this.leverage,
                        this.borrowAsset.address,
                    ),
                });
            }),
        );
    }
}
