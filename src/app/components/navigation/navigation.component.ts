import { Component } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { NetworkType } from '../../services/ethereum/ethereum.network.type';

const NAVIGATION = [
    {
        label: 'Your Positions',
        link: 'positions',
    },
    {
        label: 'Trading',
        link: 'trading',
    },
    {
        label: 'Rewards',
        link: 'rewards',
    },
    {
        label: 'Staking',
        link: 'staking',
    },
];

const hidden = {
    binance: ['staking'],
};

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
})
export class NavigationComponent {
    routes = [];

    constructor(private configurationService: ConfigurationService) {
        this.configurationService
            .getValueObservable('network')
            .subscribe(
                (network: NetworkType) =>
                    (this.routes = NAVIGATION.filter(
                        (route) =>
                            !network ||
                            network === 'ethereum' ||
                            network === 'polygon' ||
                            (network === 'bsc' &&
                                !hidden.binance.includes(route.link)),
                    )),
            );
    }

    linkActive(routerLinkActive: RouterLinkActive) {
        return routerLinkActive.isActive;
    }
}
