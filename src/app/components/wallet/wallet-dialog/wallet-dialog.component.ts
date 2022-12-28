import { Component } from '@angular/core';

import { Clipboard } from '@angular/cdk/clipboard';

import { MatDialogRef } from '@angular/material/dialog';

import {
    getBlockExplorerAddressLink,
    getBlockExplorerName,
} from '../../../utilities/blockExplorer';

import { EthereumService } from '../../../services/ethereum/ethereum.service';

@Component({
    selector: 'app-wallet-dialog',
    templateUrl: './wallet-dialog.component.html',
})
export class WalletDialogComponent {
    account: string;
    counter = 0;

    constructor(
        private clipboard: Clipboard,
        public dialogRef: MatDialogRef<WalletDialogComponent>,
        public ethereumService: EthereumService,
    ) {}

    addressClick() {
        if (this.counter++ >= 5) {
            this.account = this.ethereumService.getAccount();
        }
    }

    getBlockExplorerName(): string {
        return getBlockExplorerName(this.ethereumService.getNetwork());
    }

    openAddressInBlockExplorer(): void {
        window.open(
            getBlockExplorerAddressLink(
                this.ethereumService.getAccount(),
                this.ethereumService.getNetwork(),
            ),
            '_blank',
        );
    }

    copyAddress(): void {
        this.clipboard.copy(this.ethereumService.getAccount());
    }

    updateAccount() {
        if (this.account) {
            this.ethereumService.setAccount(this.account);
        } else {
            this.account = '0x';
        }
    }
}
