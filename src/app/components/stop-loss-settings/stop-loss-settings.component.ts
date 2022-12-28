import { Component, Inject, OnInit } from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { DIALOG_MEDIUM } from '../../constants/commons';

import { convertToBigNumber, parseBigNumber } from '../../utilities/bigNumber';
import {
    isExchangeReverseRequired,
    reverseExchangeRate,
} from '../../utilities/formatExchangeRate';

import { FoldingService } from '../../services/folding/folding.service';

import { TransactionComponent } from '../transaction/transaction.component';
import { IPosition } from '../../interfaces/position.interface';

import { formatNumber } from '../../utilities/formatValue';

@Component({
    selector: 'app-stop-loss-settings',
    templateUrl: './stop-loss-settings.component.html',
})
export class StopLossSettingsComponent implements OnInit {
    readonly DEFAULT_UNWIND_FACTOR = 100;
    readonly DEFAULT_SLIPPAGE_INCENTIVE = 5;

    unwindFactor: number;
    slippageIncentive: number;
    collateralUsageLimit: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { position: IPosition },
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<StopLossSettingsComponent>,
        public foldingService: FoldingService,
    ) {}

    ngOnInit() {
        this.getStopLossConfiguration();
    }

    getStopLossConfiguration() {
        this.foldingService
            .getStopLossConfiguration(this.data.position.positionAddress)
            .subscribe(
                ([slippageIncentive, collateralUsageLimit, unwindFactor]) => {
                    this.unwindFactor =
                        !unwindFactor || unwindFactor.isZero()
                            ? this.DEFAULT_UNWIND_FACTOR
                            : parseBigNumber(unwindFactor, 16);

                    this.slippageIncentive =
                        !slippageIncentive || slippageIncentive.isZero()
                            ? this.DEFAULT_SLIPPAGE_INCENTIVE
                            : parseBigNumber(slippageIncentive, 16);

                    this.collateralUsageLimit =
                        !collateralUsageLimit || collateralUsageLimit.isZero()
                            ? Math.round(
                                  (100 + this.minCollateralUsageLimit) / 2,
                              )
                            : parseBigNumber(collateralUsageLimit, 16);
                },
            );
    }

    save() {
        if (this.dialogRef) {
            this.dialogRef.close();
        }

        this.dialog.open(TransactionComponent, {
            width: DIALOG_MEDIUM,
            id: 'stop-loss',
            data: {
                title: 'Save Stop Loss Configuration',
                actionDescription:
                    'Please sign a transaction to save stop loss bot configuration.',
                action: this.foldingService.configureStopLoss(
                    this.data.position.positionAddress,
                    convertToBigNumber(this.unwindFactor, 16),
                    convertToBigNumber(this.slippageIncentive, 16),
                    convertToBigNumber(this.collateralUsageLimit, 16),
                ),
            },
        });
    }

    get minCollateralUsageLimit(): number {
        return Math.ceil(this.data.position.collateralUsageFactor);
    }

    get stopLossPriceBorrowToken(): number {
        return this.collateralUsageLimit
            ? this.data.position.borrowAmount /
                  (this.data.position.supplyMarket.liquidationFactor *
                      this.data.position.supplyAmount *
                      (this.collateralUsageLimit / 100))
            : 0;
    }

    get stopLossPriceReadableToken(): number {
        const result = isExchangeReverseRequired(
            this.stopLossPriceBorrowToken,
            this.data.position.borrowMarket.assetSymbol,
            this.data.position.supplyMarket.assetSymbol,
        )
            ? reverseExchangeRate(
                  this.stopLossPriceBorrowToken,
                  this.data.position.borrowMarket.assetSymbol,
                  this.data.position.supplyMarket.assetSymbol,
              )[0]
            : this.stopLossPriceBorrowToken;

        return formatNumber(result);
    }

    get positionValueLeft(): number {
        return this.getSupplyAmountLeft() - this.getBorrowAmountLeft() || 0;
    }

    get tipForTheBot(): number {
        return (
            this.getSupplyAmountRedeemed() - this.getBorrowAmountRepaid() || 0
        );
    }

    get leverageAfterStopLoss(): number {
        return this.getSupplyAmountLeft() / this.positionValueLeft || 0;
    }

    setStopLossPriceBorrowToken(price = 0) {
        const minPrice =
            this.data.position.borrowAmount /
            (this.data.position.supplyMarket.liquidationFactor *
                this.data.position.supplyAmount);

        const maxPrice =
            this.data.position.borrowAmount /
            (this.data.position.supplyMarket.liquidationFactor *
                this.data.position.supplyAmount *
                (this.minCollateralUsageLimit / 100));

        if (price < minPrice) {
            price = minPrice;
        }

        if (price > maxPrice) {
            price = maxPrice;
        }

        this.collateralUsageLimit =
            (this.data.position.borrowAmount /
                (this.data.position.supplyMarket.liquidationFactor *
                    this.data.position.supplyAmount *
                    price)) *
            100;
    }

    setStopLossPriceReadableToken(value) {
        const price = parseFloat(value.target.value) || 0;

        this.setStopLossPriceBorrowToken(
            isExchangeReverseRequired(
                price,
                this.data.position.borrowMarket.assetSymbol,
                this.data.position.supplyMarket.assetSymbol,
            )
                ? reverseExchangeRate(
                      price,
                      this.data.position.borrowMarket.assetSymbol,
                      this.data.position.supplyMarket.assetSymbol,
                  )[0]
                : price,
        );
    }

    getBorrowValueInSupplyTokenAtStopLoss(): number {
        return this.data.position.borrowAmount / this.stopLossPriceBorrowToken;
    }

    getBorrowAmountLeft(): number {
        return (
            this.getBorrowValueInSupplyTokenAtStopLoss() *
            (1 - this.unwindFactor / 100)
        );
    }

    getBorrowAmountRepaid(): number {
        return (
            this.getBorrowValueInSupplyTokenAtStopLoss() *
            (this.unwindFactor / 100)
        );
    }

    getSupplyAmountLeft(): number {
        return this.data.position.supplyAmount - this.getSupplyAmountRedeemed();
    }

    getSupplyAmountRedeemed(): number {
        return (
            this.getBorrowAmountRepaid() * (1 + this.slippageIncentive / 100)
        );
    }
}
