import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { from, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';

import { ITransactionData } from '../../../interfaces/transactionData.interface';

import { DIALOG_MEDIUM } from '../../../constants/commons';
import { ETH_DECIMALS } from '../../../constants/networks/ethereum';

import { EthereumService } from '../../../services/ethereum/ethereum.service';
import { LPService } from '../../../services/lp/lp.service';
import { StakingService } from '../../../services/staking/staking.service';

import { TransactionComponent } from '../../transaction/transaction.component';

import { StakingActionType } from './stake-unstake.action.type';

import { displayBigNumber } from '../../../utilities/displayBigNumber';

import { BigNumber, ethers } from 'ethers';

@Component({
    selector: 'app-stake-unstake',
    templateUrl: './stake-unstake.component.html',
})
export class StakeUnstakeComponent implements OnInit, OnDestroy {
    @Input() type: 'stake' | 'unstake' = 'stake';
    @Input() dialogRef: MatDialogRef<any>;
    @Input() geyserContract: ethers.Contract;
    @Input() lpContract: ethers.Contract;

    amount: BigNumber = ethers.constants.Zero;
    balance: BigNumber;
    rewards: BigNumber;

    unsubscribe$: Subject<any> = new Subject();

    constructor(
        private dialog: MatDialog,
        private lpService: LPService,
        private stakingService: StakingService,
        private ethereumService: EthereumService,
    ) {}

    ngOnInit() {
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    makeSubscriptions() {
        if (this.type === 'stake') {
            return this.lpService.connected$
                .pipe(
                    filter((connected) => connected),
                    takeUntil(this.unsubscribe$),
                    switchMap(() =>
                        from(
                            this.lpService.balanceOf(
                                this.lpContract,
                                this.ethereumService.getAccount(),
                            ),
                        ).pipe(map((balance) => (this.balance = balance))),
                    ),
                )
                .subscribe();
        }

        return this.stakingService.connected$
            .pipe(
                filter((connected) => connected),
                takeUntil(this.unsubscribe$),
                switchMap(() =>
                    from(
                        this.stakingService.balanceOf(this.geyserContract),
                    ).pipe(map((balance) => (this.balance = balance))),
                ),
                switchMap(() =>
                    from(this.stakingService.earned(this.geyserContract)).pipe(
                        map((rewards) => (this.rewards = rewards)),
                    ),
                ),
            )
            .subscribe();
    }

    setMax(value: BigNumber) {
        this.amount = value;
    }

    doAction(action: StakingActionType) {
        this.dialogRef.close();
        this.dialog.open(TransactionComponent, {
            width: DIALOG_MEDIUM,
            data: this.getDialogParams(action),
        });
    }

    getDialogParams(action: StakingActionType): ITransactionData {
        const callback = () => {
            this.stakingService.updated$.next(true);
        };

        if (action === 'unstake') {
            return {
                title: 'Withdraw LP Token',
                actionDescription: 'Please sign a transaction to withdraw LP',
                callback: callback,
                action: from(
                    this.stakingService.withdraw(
                        this.geyserContract,
                        this.amount,
                    ),
                ),
            };
        }

        if (action === 'claim') {
            return {
                title: 'Claim FODL rewards',
                actionDescription:
                    'Please sign a transaction to claim FODL rewards',
                callback: callback,
                action: from(
                    this.stakingService.getReward(this.geyserContract),
                ),
            };
        }

        if (action === 'exit') {
            return {
                title: 'Exit',
                actionDescription:
                    'Please sign a transaction to exit LP position',
                callback: callback,
                action: from(this.stakingService.exit(this.geyserContract)),
            };
        }

        return {
            title: 'Stake LP Token',
            actionDescription: 'Please sign a transaction to stake LP',
            approve: {
                account: this.geyserContract.address,
                amount: this.amount,
                decimals: ETH_DECIMALS,
                token: this.lpContract.address,
            },
            callback: callback,
            action: from(
                this.stakingService.stake(this.geyserContract, this.amount),
            ),
        };
    }

    isStakeUnstakeButtonDisabled(): boolean {
        return !this.isAmountValid || this.amount.isZero();
    }

    isExitButtonDisabled(): boolean {
        return this.rewards.isZero() && this.balance.isZero();
    }

    isClaimButtonDisabled(): boolean {
        return this.rewards.isZero();
    }

    get isAmountValid(): boolean {
        return !this.amount.isNegative() && !this.amount.gt(this.balance);
    }

    get errorText(): string {
        return this.amount.gt(this.balance)
            ? 'Not enough balance'
            : 'Please enter a valid amount';
    }

    get userBalance(): string {
        return displayBigNumber(this.balance, ETH_DECIMALS);
    }

    get userRewards(): string {
        return displayBigNumber(this.rewards, ETH_DECIMALS);
    }
}
