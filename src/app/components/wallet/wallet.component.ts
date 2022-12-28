import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EthereumService } from '../../services/ethereum/ethereum.service';

import { WalletDialogComponent } from './wallet-dialog/wallet-dialog.component';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
})
export class WalletComponent {
    constructor(
        private dialog: MatDialog,
        public ethereumService: EthereumService,
    ) {}

    openWalletDialog() {
        this.dialog.open(WalletDialogComponent, {
            width: '34rem',
        });
    }
}
