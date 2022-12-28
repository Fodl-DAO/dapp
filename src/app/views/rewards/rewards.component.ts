import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BigNumber, ethers } from 'ethers';

import {
    BehaviorSubject,
    combineLatest,
    defer,
    Observable,
    of,
    Subject,
} from 'rxjs';

import {
    catchError,
    debounceTime,
    filter,
    mergeMap,
    switchMap,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { DIALOG_MEDIUM } from '../../constants/commons';
import { ETH_DECIMALS } from '../../constants/networks/ethereum';

import { IClaim, IRewards } from '../../interfaces/rewards.interface';
import { ITransactionData } from '../../interfaces/transactionData.interface';

import { parseBigNumber } from '../../utilities/bigNumber';
import { displayBigNumber } from '../../utilities/displayBigNumber';

import { EthereumService } from '../../services/ethereum/ethereum.service';
import { FoldingRewardsService } from '../../services/folding/foldingRewards/foldingRewards.service';

import { TransactionComponent } from '../../components/transaction/transaction.component';

@Component({
    selector: 'app-rewards',
    templateUrl: './rewards.component.html',
})
export class RewardsComponent implements OnInit, OnDestroy {
    claimAmount: BigNumber = ethers.constants.Zero;
    total: BigNumber = ethers.constants.Zero;

    amountsReceived: BigNumber;
    totalTax: BigNumber;

    error: string;

    rewards$ = new BehaviorSubject<IRewards[]>(undefined);
    rewardsLoading$ = new BehaviorSubject<boolean>(false);

    simulate$ = new Subject();
    simulateLoading$ = new BehaviorSubject<boolean>(false);

    unsubscribe$ = new Subject();

    readonly SIMULATE_DEBOUNCE_TIME = 300;

    constructor(
        private dialog: MatDialog,
        private foldingRewardsService: FoldingRewardsService,
        private ethereumService: EthereumService,
    ) {}

    ngOnInit() {
        combineLatest([
            this.ethereumService.connected$,
            this.ethereumService.account$,
        ])
            .pipe(
                filter(([connected, account]) => !!connected && !!account),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => this.loadRewards());

        this.simulate$
            .pipe(
                tap(() => this.resetTaxes()),
                filter(() => this.isClaimAmountValid),
                tap(() => {
                    this.simulateLoading$.next(true);
                }),
                debounceTime(this.SIMULATE_DEBOUNCE_TIME),
                switchMap(() =>
                    this.foldingRewardsService.computeClaims(
                        this.ethereumService.getAccount(),
                        this.claimAmount,
                    ),
                ),
                takeUntil(this.unsubscribe$),
            )
            .subscribe((simulateResp) => {
                // Prevent setting tax & received amount values
                // while simulating is still performs but user
                // changed input value to invalid
                if (this.isClaimAmountValid) {
                    this.totalTax = simulateResp.totalTax;
                    this.amountsReceived = simulateResp.amountsReceived;
                }
                this.simulateLoading$.next(false);
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    loadRewards() {
        this.rewardsLoading$.next(true);

        this.foldingRewardsService
            .getAvailableRewards(this.ethereumService.getAccount())
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((rewards) => {
                this.rewards$.next(rewards);
                this.total = this.getTotalRewards(rewards);
                this.rewardsLoading$.next(false);
            });
    }

    setMax() {
        this.claimAmount = this.total;
        this.simulateClaim();
    }

    resetTaxes() {
        this.amountsReceived = undefined;
        this.totalTax = undefined;
        this.error = undefined;
    }

    simulateClaim() {
        this.simulate$.next();
    }

    claim() {
        this.foldingRewardsService
            .computeClaims(this.ethereumService.getAccount(), this.claimAmount)
            .pipe(
                takeUntil(this.unsubscribe$),
                mergeMap((simulateResp) => {
                    return combineLatest([
                        of(simulateResp),
                        this.foldingRewardsService.claim(
                            this.claimAmount,
                            simulateResp.claims,
                            true,
                        ),
                    ]);
                }),
                catchError(() => {
                    this.error = 'Cannot claim this amount.';
                    return of([]);
                }),
            )
            .subscribe(([simulateResp, _]) => {
                if (simulateResp && simulateResp.claims.length) {
                    this.dialog.open(TransactionComponent, {
                        width: DIALOG_MEDIUM,
                        data: this.getClaimDialogData(simulateResp.claims),
                    });
                }
            });
    }

    getClaimDialogData(claims: IClaim[]): ITransactionData {
        const actionDescription =
            'Accept transaction to claim your ' +
            displayBigNumber(this.amountsReceived, 18, 2) +
            ' FODL rewards and pay ' +
            displayBigNumber(this.totalTax, 18, 2) +
            ' FODL tax.';

        return {
            title: 'Claim Rewards',
            actionDescription: actionDescription,
            action: defer(() =>
                this.foldingRewardsService.claim(this.claimAmount, claims),
            ),
            callback: () => {
                this.claimAmount = ethers.constants.Zero;
                this.resetTaxes();
                this.loadRewards();
            },
        };
    }

    getTotalRewards(rewards: IRewards[]): BigNumber {
        if (!rewards || !rewards.length) {
            return ethers.constants.Zero;
        }
        return rewards.reduce(
            (a, c) => a.add(c.remainingAmount),
            ethers.BigNumber.from(0),
        );
    }

    get account(): Observable<string> {
        return this.ethereumService.account$;
    }

    get isClaimAmountValid(): boolean {
        return (
            this.claimAmount.gt(ethers.constants.Zero) &&
            !this.claimAmount.gt(this.total)
        );
    }

    get isRewardsAvailable(): boolean {
        return (
            !this.rewardsLoading$.getValue() &&
            this.total.gt(ethers.constants.Zero)
        );
    }

    get isClaimButtonDisabled(): boolean {
        return (
            !this.claimAmount.gt(ethers.constants.Zero) ||
            this.claimAmount.gt(this.total) ||
            this.simulateLoading$.getValue() ||
            !!this.error
        );
    }

    get claimButtonText(): string {
        return !this.claimAmount || !this.claimAmount.gt(0)
            ? 'Enter claim amount'
            : this.claimAmount.gt(this.total)
            ? 'Insufficient rewards'
            : 'Claim';
    }

    get taxPercent(): number {
        const totalTax = parseBigNumber(this.totalTax);
        const amountsReceived = parseBigNumber(this.amountsReceived);
        return (totalTax / (totalTax + amountsReceived)) * 100;
    }

    get maxRewards(): string {
        return displayBigNumber(this.total, ETH_DECIMALS);
    }

    get availableRewards(): string {
        return displayBigNumber(this.total, ETH_DECIMALS, 2, true);
    }

    get rewardsToReceive(): string {
        return displayBigNumber(this.amountsReceived, ETH_DECIMALS, 2, true);
    }

    get earlyWithdrawFee(): string {
        return displayBigNumber(this.totalTax, ETH_DECIMALS, 2, true);
    }
}
