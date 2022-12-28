import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { from } from 'rxjs';

import { DIALOG_MEDIUM } from '../../../constants/commons';
import { ETH_DECIMALS } from '../../../constants/networks/ethereum';

import { displayBigNumber } from '../../../utilities/displayBigNumber';

import { SingleSidedStakingService } from '../../../services/single-sided-staking/single-sided-staking.service';

import { TransactionComponent } from '../../transaction/transaction.component';

import { BigNumber, ethers } from 'ethers';

@Component({
    selector: 'app-single-sided-stake-unstake',
    templateUrl: './single-sided-stake-unstake.component.html',
})
export class SingleSidedStakeUnstakeComponent {
    @Output() reloadBalances: EventEmitter<void> = new EventEmitter<void>();

    @Input() type: 'stake' | 'unstake' = 'stake';
    @Input() balance: ethers.BigNumber = ethers.constants.Zero;

    amount: BigNumber = ethers.constants.Zero;

    constructor(
        private dialog: MatDialog,
        private singleSidedStakingService: SingleSidedStakingService,
    ) {}

    setMax() {
        this.amount = this.balance;
    }

    action() {
        this.dialog.open(TransactionComponent, {
            width: DIALOG_MEDIUM,
            data: this.getDialogOptions(),
        });
    }

    getDialogOptions() {
        const callback = () => {
            this.reloadBalances.emit();
            this.amount = ethers.constants.Zero;
        };

        if (this.type === 'stake') {
            return {
                title: 'Stake FODL Token',
                actionDescription: 'Please sign a transaction to stake FODL',
                action: from(this.singleSidedStakingService.stake(this.amount)),
                callback,
            };
        }

        return {
            title: 'Withdraw FODL Token',
            actionDescription: 'Please sign a transaction to withdraw FODL',
            action: from(this.singleSidedStakingService.unstake(this.amount)),
            callback,
        };
    }

    get userBalance(): string {
        return displayBigNumber(this.balance, ETH_DECIMALS);
    }

    get isAmountValid(): boolean {
        return !this.amount.isNegative() && !this.amount.gt(this.balance);
    }

    get errorText(): string {
        return this.amount.gt(this.balance)
            ? 'Not enough balance'
            : 'Please enter a valid amount';
    }

    get isAmountButtonDisabled(): boolean {
        return !this.isAmountValid || this.amount.isZero();
    }

    get buttonText(): string {
        return this.type === 'stake' ? 'Stake' : 'Unstake';
    }
}
