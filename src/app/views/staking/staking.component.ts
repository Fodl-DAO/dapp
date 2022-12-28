import { Component, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { LPs, POLYGON_LPs } from '../../constants/blockchain';

import { IConfig } from '../../interfaces/config.interface';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { EthereumService } from '../../services/ethereum/ethereum.service';
import { NetworkType } from '../../services/ethereum/ethereum.network.type';

@Component({
    selector: 'app-staking',
    templateUrl: './staking.component.html',
})
export class StakingComponent implements OnDestroy {
    lps;

    error$: Observable<string>;

    singleSidedStaking: boolean;

    localNetwork: NetworkType;

    private readonly unsubscribe$ = new Subject();

    constructor(
        private configurationService: ConfigurationService,
        public ethereumService: EthereumService,
    ) {
        this.error$ = this.ethereumService.connected$.pipe(
            map((value) =>
                !value ? 'Cannot connect to Ethereum blockchain.' : undefined,
            ),
        );

        this.configurationService.config$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((config: IConfig) => {
                this.localNetwork = config.network as NetworkType;

                this.singleSidedStaking =
                    !!config.singleSidedStaking &&
                    config.network === 'ethereum';

                this.lps =
                    config.network === 'ethereum'
                        ? LPs
                        : config.network === 'polygon'
                        ? POLYGON_LPs
                        : undefined;
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
