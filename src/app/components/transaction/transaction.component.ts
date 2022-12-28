import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, filter, first, switchMap, tap } from 'rxjs/operators';

import { TRANSACTION_INTERVAL } from '../../constants/commons';

import { ITransactionData } from '../../interfaces/transactionData.interface';

import {
    getBlockExplorerLink,
    getBlockExplorerName,
} from '../../utilities/blockExplorer';
import { getAssetSymbol } from '../../utilities/asset';
import { displayBigNumber } from '../../utilities/displayBigNumber';

import { EthereumService } from '../../services/ethereum/ethereum.service';
import { FoldingService } from '../../services/folding/folding.service';
import { MarketsService } from '../../services/markets/markets.service';
import { ERC20Service } from '../../services/erc20/erc20.service';

import { BigNumber } from 'ethers';

@Component({
    selector: 'app-transaction',
    templateUrl: './transaction.component.html',
})
export class TransactionComponent implements OnInit, OnDestroy {
    tx$: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);

    interval: number;
    error: string;
    step: string;
    transactionHash: string;

    getAssetSymbol = getAssetSymbol;

    readonly LOW_SLIPPAGE_ERROR = 'execution reverted: DWV3FMC5';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ITransactionData,
        private ethereumService: EthereumService,
        private erc20Service: ERC20Service,
        public dialogRef: MatDialogRef<TransactionComponent>,
        public marketsService: MarketsService,
        public foldingService: FoldingService,
    ) {}

    ngOnInit() {
        (this.data.approve
            ? this.approveSpendingThenDoAction()
            : this.doAction()
        )
            .pipe(first())
            .subscribe(() => (this.step = 'done'));
    }

    ngOnDestroy() {
        this.clearInterval();
    }

    approveSpendingThenDoAction(): Observable<any> {
        this.step = 'approve';

        return from(
            this.erc20Service.getAllowance(
                this.data.approve.account,
                this.data.approve.token,
            ),
        ).pipe(
            switchMap((allowance: BigNumber) => {
                if (allowance.lt(this.data.approve.amount)) {
                    return from(
                        this.erc20Service.approveAllowance(
                            this.data.approve.account,
                            this.data.approve.token,
                            this.data.approve.amount,
                        ),
                    ).pipe(
                        switchMap((tx: any) =>
                            tx.hash
                                ? this.awaitTransaction(tx)
                                : this.cancelWithError(tx),
                        ),
                        filter((tx) => !!tx),
                        first(),
                        switchMap(() => this.doAction()),
                    );
                } else {
                    return this.doAction();
                }
            }),
        );
    }

    awaitTransaction(tx: any): Observable<any> {
        this.transactionHash = tx.hash;

        this.tx$.next(undefined);

        this.interval = window.setInterval(async () => {
            const txReceipt = await this.ethereumService
                .getBaseProvider()
                .getTransactionReceipt(this.transactionHash);

            if (
                txReceipt?.confirmations >=
                this.ethereumService.getMinimumConfirmations()
            ) {
                this.tx$.next(txReceipt);

                if (txReceipt.status === 0) {
                    this.error = 'Transaction Failed!';
                }

                this.clearInterval();
            }
        }, TRANSACTION_INTERVAL);

        return this.tx$;
    }

    cancelWithError(tx: any): Observable<any> {
        this.error = this.getErrorMessage(tx);
        this.step = undefined;

        return of();
    }

    clearInterval() {
        if (this.interval) {
            window.clearInterval(this.interval);

            this.interval = undefined;
        }
    }

    doAction() {
        this.step = 'action';

        return this.data.action.pipe(
            catchError((e) => of(e)),
            switchMap((tx: any) =>
                tx.hash ? this.awaitTransaction(tx) : this.cancelWithError(tx),
            ),
            filter((tx) => !!tx),
            tap(() => this.data.callback && this.data.callback()),
        );
    }

    getErrorMessage(tx: any): string {
        if (!tx?.reason) {
            return tx.message;
        }
        return (
            'Error: ' +
            (tx.reason === this.LOW_SLIPPAGE_ERROR
                ? 'Slippage is set lower than the price impact. Please increase it slightly.'
                : tx.reason)
        );
    }

    getBlockExplorerName(): string {
        return getBlockExplorerName(this.ethereumService.getNetwork());
    }

    getBlockExplorerLink(): string {
        return getBlockExplorerLink(
            this.transactionHash,
            this.ethereumService.getNetwork(),
        );
    }

    get approveAmount(): string {
        return displayBigNumber(
            this.data.approve.amount,
            this.data.approve.decimals,
        );
    }
}
