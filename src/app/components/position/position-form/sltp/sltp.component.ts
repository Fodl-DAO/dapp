import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DIALOG_MEDIUM } from '../../../../constants/commons';

import { TransactionComponent } from '../../../transaction/transaction.component';

import { IPosition } from '../../../../interfaces/position.interface';
import { ISLTP } from '../../../../interfaces/sltp.interface';

import { FoldingService } from '../../../../services/folding/folding.service';

import {
    formatExchangeRate,
    isExchangeReverseRequired,
} from '../../../../utilities/formatExchangeRate';

import { isStableCoin } from '../../../../utilities/stableCoin';
import { formatNumber } from '../../../../utilities/formatValue';

const DEFAULT_UNWIND_FACTOR = 100;
const DEFAULT_FIXED_REWARD = 0;
const DEFAULT_SLIPPAGE_INCENTIVE = 5;

@Component({
    selector: 'app-sltp',
    templateUrl: './sltp.component.html',
})
export class SLTPComponent implements OnInit {
    @Input() position: IPosition;

    @Output() settingSLTP: EventEmitter<boolean> = new EventEmitter<boolean>(
        false,
    );

    pnlSettings: any[];

    currentPrice: number;
    unwindFactor: number;
    slippageIncentive: number;

    priceTarget: number;
    priceTargetSymbols: string[];

    fixedReward: number;

    showForm: boolean;
    pnlSettingsIndex: number;

    constructor(
        private dialog: MatDialog,
        private foldingService: FoldingService,
    ) {}

    ngOnInit(): void {
        this.foldingService
            .getAllPNLSettings(this.position)
            .subscribe((pnlSettings) => (this.pnlSettings = pnlSettings));

        this.currentPrice = parseFloat(
            formatExchangeRate(
                this.position.currentPrice,
                this.position.supplyMarket.assetSymbol,
                this.position.borrowMarket.assetSymbol,
                'short',
            ),
        );

        this.priceTargetSymbols = this.getPriceTargetSymbols();
    }

    editSLTP(index?: number) {
        this.pnlSettingsIndex = index;
        this.showForm = true;

        if (index) {
            console.log(this.pnlSettings[index - 1]);

            this.priceTarget = parseFloat(
                formatExchangeRate(
                    this.pnlSettings[index - 1].priceTarget,
                    this.position.supplyMarket.assetSymbol,
                    this.position.borrowMarket.assetSymbol,
                    'short',
                ),
            );

            this.unwindFactor = this.pnlSettings[index - 1].unwindFactor;
            this.fixedReward = this.pnlSettings[index - 1].fixedReward;
            this.slippageIncentive =
                this.pnlSettings[index - 1].percentageReward;
        } else {
            this.priceTarget = this.currentPrice;
            this.unwindFactor = DEFAULT_UNWIND_FACTOR;
            this.fixedReward = DEFAULT_FIXED_REWARD;
            this.slippageIncentive = DEFAULT_SLIPPAGE_INCENTIVE;
        }

        this.emitShowForm();
    }

    isTakeProfit(): boolean {
        if (
            isExchangeReverseRequired(
                this.position.currentPrice,
                this.position.supplyMarket.assetSymbol,
                this.position.borrowMarket.assetSymbol,
            )
        ) {
            return this.priceTarget > this.currentPrice;
        }

        return this.currentPrice > this.priceTarget;
    }

    getActionType(): string {
        return this.isTakeProfit() ? 'Take Profit' : 'Stop Loss';
    }

    getPriceDifference(sltp?: ISLTP): number {
        return isExchangeReverseRequired(
            this.position.currentPrice,
            this.position.supplyMarket.assetSymbol,
            this.position.borrowMarket.assetSymbol,
        )
            ? (this.position.currentPrice /
                  (sltp ? sltp.priceTarget : 1 / this.priceTarget) -
                  1) *
                  100
            : ((sltp ? sltp.priceTarget : this.priceTarget) /
                  this.position.currentPrice -
                  1) *
                  100;
    }

    getEstimatedPnl(): number {
        let price = this.priceTarget;

        if (
            isExchangeReverseRequired(
                this.position.currentPrice,
                this.position.supplyMarket.assetSymbol,
                this.position.borrowMarket.assetSymbol,
            )
        ) {
            price = 1 / this.priceTarget;
        }

        return (
            this.position.supplyAmount -
            this.position.borrowAmount * price -
            this.position.principalValue
        );
    }

    getEstimatedPnlPercentage(): number {
        return (this.getEstimatedPnl() * 100) / this.position.principalValue;
    }

    getEstimatedPnlUsd(): number {
        return (
            this.getEstimatedPnl() * this.position.supplyMarket.assetUsdValue
        );
    }

    getPriceTargetSymbols(): string[] {
        if (
            isExchangeReverseRequired(
                this.position.currentPrice,
                this.position.supplyMarket.assetSymbol,
                this.position.borrowMarket.assetSymbol,
            )
        ) {
            return [
                this.position.supplyMarket.assetSymbol,
                this.position.borrowMarket.assetSymbol,
            ];
        }

        return [
            this.position.borrowMarket.assetSymbol,
            this.position.supplyMarket.assetSymbol,
        ];
    }

    modifyPriceTarget(delta: number) {
        const newPriceTarget = (this.priceTarget || 0) * (1 + delta / 100);

        this.priceTarget = formatNumber(newPriceTarget);
    }

    validatePriceTarget(): boolean {
        return this.priceTarget !== this.currentPrice && this.priceTarget > 0;
    }

    validateFixedReward(): boolean {
        return (
            this.fixedReward >= 0 &&
            this.fixedReward <= this.getMaxFixedReward()
        );
    }

    validateSlippageIncentive(): boolean {
        return this.slippageIncentive >= 0 && this.slippageIncentive <= 50;
    }

    validateInputs(): boolean {
        return (
            this.validatePriceTarget() &&
            this.validateFixedReward() &&
            this.validateSlippageIncentive()
        );
    }

    onChangePriceTarget() {
        if (this.priceTarget < 0) {
            this.priceTarget = 0;
        }
    }

    onChangeFixedReward() {
        if (this.fixedReward < 0) {
            this.fixedReward = 0;
        }

        const maxFixedReward = this.getMaxFixedReward();

        if (this.fixedReward > maxFixedReward) {
            this.fixedReward = formatNumber(maxFixedReward);
        }
    }

    onChangeSlippageIncentive() {
        if (this.slippageIncentive < 0) {
            this.slippageIncentive = 0;
        }

        if (this.slippageIncentive > 50) {
            this.slippageIncentive = 50;
        }
    }

    getMaxFixedReward(): number {
        return (
            (this.position.positionValue *
                (1 + this.getPriceDifference() / 100)) /
            2
        );
    }

    getFixedRewardUSDValue(): number {
        return this.fixedReward * this.position.supplyMarket.assetUsdValue;
    }

    getSlippageIncentiveUSDValue(): number {
        return (
            ((this.position.supplyAmount - this.position.positionValue) *
                (1 + this.getPriceDifference() / 100) *
                this.slippageIncentive *
                this.position.supplyMarket.assetUsdValue) /
            100
        );
    }

    resetFixedFee() {
        this.fixedReward = DEFAULT_FIXED_REWARD;
    }

    resetSlippageIncentive() {
        this.slippageIncentive = DEFAULT_SLIPPAGE_INCENTIVE;
    }

    submit() {
        if (this.pnlSettingsIndex) {
            this.dialog.open(TransactionComponent, {
                width: DIALOG_MEDIUM,
                data: {
                    title: `Delete ${this.getActionType()}`,
                    actionDescription: `Please sign a transaction to delete ${this.getActionType()} from your position.`,
                    callback: () => window.location.reload(),
                    action: this.foldingService.removePNLSetting(
                        this.position,
                        this.pnlSettingsIndex - 1,
                    ),
                },
            });
        } else {
            console.log(
                'current price:',
                1 / this.position.currentPrice,
                'price target:',
                isExchangeReverseRequired(
                    this.position.currentPrice,
                    this.position.supplyMarket.assetSymbol,
                    this.position.borrowMarket.assetSymbol,
                )
                    ? this.priceTarget
                    : 1 / this.priceTarget,
                'reverse:',
                isExchangeReverseRequired(
                    this.position.currentPrice,
                    this.position.supplyMarket.assetSymbol,
                    this.position.borrowMarket.assetSymbol,
                ),
                'isTakeProfit:',
                this.position.currentPrice >
                    (isExchangeReverseRequired(
                        this.position.currentPrice,
                        this.position.supplyMarket.assetSymbol,
                        this.position.borrowMarket.assetSymbol,
                    ) &&
                    !(
                        isStableCoin(this.position.supplyMarket.assetAddress) ||
                        isStableCoin(this.position.borrowMarket.assetAddress)
                    )
                        ? 1 / this.priceTarget
                        : this.priceTarget),
            );

            this.dialog.open(TransactionComponent, {
                width: DIALOG_MEDIUM,
                data: {
                    title: `Add ${this.getActionType()}`,
                    actionDescription: `Please sign a transaction to add ${this.getActionType()} to your position.`,
                    callback: () => window.location.reload(),
                    action: this.foldingService.configurePNL(
                        this.position,
                        isExchangeReverseRequired(
                            this.position.currentPrice,
                            this.position.supplyMarket.assetSymbol,
                            this.position.borrowMarket.assetSymbol,
                        )
                            ? this.priceTarget
                            : 1 / this.priceTarget,
                        this.fixedReward,
                        this.slippageIncentive,
                        this.unwindFactor,
                        1 / this.position.currentPrice <
                            (isExchangeReverseRequired(
                                this.position.currentPrice,
                                this.position.supplyMarket.assetSymbol,
                                this.position.borrowMarket.assetSymbol,
                            )
                                ? this.priceTarget
                                : 1 / this.priceTarget),
                    ),
                },
            });
        }
    }

    cancel() {
        this.priceTarget = undefined;
        this.unwindFactor = 0;
        this.showForm = false;

        this.emitShowForm();
    }

    emitShowForm() {
        this.settingSLTP.emit(this.showForm);
    }
}
