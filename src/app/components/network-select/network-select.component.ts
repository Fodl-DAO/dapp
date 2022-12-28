import { Component, Inject } from '@angular/core';

import { Router } from '@angular/router';

import { DOCUMENT } from '@angular/common';

import { DEFAULT_NETWORK, NETWORKS } from '../../constants/blockchain';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { EthereumService } from '../../services/ethereum/ethereum.service';

import { NetworkType } from '../../services/ethereum/ethereum.network.type';

@Component({
    selector: 'app-network-select',
    templateUrl: './network-select.component.html',
})
export class NetworkSelectComponent {
    readonly TRADING_PATH = '/trading';

    networks = NETWORKS;
    network: NetworkType = DEFAULT_NETWORK;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private configurationService: ConfigurationService,
        private ethereumService: EthereumService,
        private router: Router,
    ) {
        this.configurationService
            .getValueObservable('network')
            .subscribe((network: NetworkType) => (this.network = network));
    }

    async changeNetwork(value: NetworkType) {
        this.network = value;

        if (this.router.url !== this.TRADING_PATH) {
            await this.router.navigate([this.TRADING_PATH]);
        }

        try {
            await this.ethereumService.switchNetwork(this.network);
        } catch (error: any) {
            if (error?.message === 'rejected') {
                return;
            }
            console.error(error);
        }
    }
}
