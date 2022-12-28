import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { combineLatest, from, Observable, Subject } from 'rxjs';
import { filter, first, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { EthereumService } from '../../services/ethereum/ethereum.service';
import { GeckoPriceService } from '../../services/gecko-price/gecko-price.service';
import { LPService } from '../../services/lp/lp.service';
import { StakingService } from '../../services/staking/staking.service';

import { StakingDialogComponent } from '../staking-dialog/staking-dialog.component';

import { aprToApy } from '../../utilities/apy';
import { parseBigNumber } from '../../utilities/bigNumber';

import { DIALOG_SMALL } from '../../constants/commons';
import {
    ASSET_FODL,
    ASSET_USDC,
    ASSET_WMATIC,
    ETH_ADDRESS,
    ETH_DECIMALS,
    LP_FODL_ETH,
    LP_FODL_USDC,
    LP_FODL_WMATIC,
} from '../../constants/blockchain';

@Component({
    selector: 'app-lp-info',
    templateUrl: './lp-info.component.html',
})
export class LpInfoComponent implements OnInit, OnDestroy {
    @Input() name: string;
    @Input() icon: string;
    @Input() lp: string;

    private readonly unsubscribe$ = new Subject();

    assetFodl = ASSET_FODL;

    allowStaking$: Observable<boolean>;

    fodl = 0;
    fodlUsd = 0;

    fodlPrice = 0;
    ethPrice = 0;
    wmaticPrice = 0;

    token = 0;
    tokenUsd = 0;
    tokenPrice = 0;

    totalLPSupply = 0;
    totalLPSupplyUsd = 0;

    totalStaked = 0;
    totalStakedUsd = 0;

    staked = 0;
    stakedUsd = 0;

    rewards = 0;
    rewardsUsd = 0;

    fodlApr = 0;
    fodlApy = 0;

    tokenAddress = '';
    tokenName = '';
    lpUrl = '';

    constructor(
        private dialog: MatDialog,
        private configurationService: ConfigurationService,
        private ethereumService: EthereumService,
        private geckoPriceService: GeckoPriceService,
        private stakingService: StakingService,
        private lpService: LPService,
    ) {
        this.allowStaking$ = this.configurationService.config$.pipe(
            filter(
                (config) =>
                    !!config.fodlStakingUsdc &&
                    !!config.fodlStakingEth &&
                    !!config.fodlStakingWmatic,
            ),
            switchMap(() => this.ethereumService.account$),
            map((account) => !!account),
        );
    }

    ngOnInit() {
        combineLatest([
            this.ethereumService.connected$,
            this.ethereumService.network$,
            this.lpService.connected$,
        ])
            .pipe(
                filter(([networkConnected, network, lpConnected]) => {
                    return (
                        networkConnected &&
                        lpConnected &&
                        (network === 'ethereum' || network === 'polygon')
                    );
                }),
                switchMap(() => this.stakingService.updated$),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {
                this.reloadData();
            });

        switch (this.lp) {
            case LP_FODL_ETH:
                this.tokenName = 'ETH';
                this.tokenAddress = ETH_ADDRESS;
                this.lpUrl =
                    'https://app.sushi.com/add/ETH/0x4C2e59D098DF7b6cBaE0848d66DE2f8A4889b9C3';

                break;

            case LP_FODL_USDC:
                this.tokenName = 'USDC';
                this.tokenAddress = ASSET_USDC.address;
                this.lpUrl =
                    'https://app.sushi.com/add/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/0x4C2e59D098DF7b6cBaE0848d66DE2f8A4889b9C3';

                break;

            case LP_FODL_WMATIC:
                this.tokenName = 'WMATIC';
                this.tokenAddress = ASSET_WMATIC.address;
                this.lpUrl =
                    'https://quickswap.exchange/#/pools?currency0=0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270&currency1=0x5314ba045a459f63906aa7c76d9f337dcb7d6995';

                break;
        }
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    reloadData() {
        this.geckoPriceService
            .getERC20Price(ASSET_FODL.address)
            .pipe(
                tap((fodlPrice) => (this.fodlPrice = fodlPrice)),
                switchMap(() =>
                    this.ethereumService.isEthereumNetwork()
                        ? this.geckoPriceService.getEthereumPrice()
                        : this.geckoPriceService.getERC20Price(
                              ASSET_WMATIC.address,
                              'polygon',
                          ),
                ),
                tap((tokenPrice) => {
                    this.tokenPrice = this.lp !== LP_FODL_USDC ? tokenPrice : 1;
                }),
                switchMap(() => this.lpService.connected$),
                switchMap(() =>
                    from(
                        this.lpService.getReserves(
                            this.lpService.getContractForLP(this.lp),
                        ),
                    ),
                ),
                tap((reserves) => {
                    this.fodl = parseBigNumber(
                        this.lp === LP_FODL_WMATIC
                            ? reserves._reserve1
                            : reserves._reserve0,
                    );

                    this.token = parseBigNumber(
                        this.lp === LP_FODL_WMATIC
                            ? reserves._reserve0
                            : reserves._reserve1,
                        this.lp === LP_FODL_USDC
                            ? ASSET_USDC.decimals
                            : ETH_DECIMALS,
                    );
                }),
                switchMap(() => this.allowStaking$),
                filter((allowStaking) => !!allowStaking),
                switchMap(() => this.stakingService.connected$),
                switchMap(() =>
                    from(
                        this.stakingService.balanceOf(
                            this.stakingService.getContractForLP(this.lp),
                        ),
                    ),
                ),
                map((balanceOfBigNumber) => parseBigNumber(balanceOfBigNumber)),
                tap((balanceOf) => (this.staked = balanceOf)),
                switchMap(() =>
                    from(
                        this.stakingService.earned(
                            this.stakingService.getContractForLP(this.lp),
                        ),
                    ),
                ),
                map((earnedBigNumber) => parseBigNumber(earnedBigNumber)),
                tap((earned) => (this.rewards = earned)),
                switchMap(() =>
                    this.stakingService.totalSupply(
                        this.stakingService.getContractForLP(this.lp),
                    ),
                ),
                map((totalSupplyBigNumber) =>
                    parseBigNumber(totalSupplyBigNumber),
                ),
                tap((totalSupply) => (this.totalStaked = totalSupply)),
                switchMap(() =>
                    this.lpService.totalSupply(
                        this.lpService.getContractForLP(this.lp),
                    ),
                ),
                map((totalLPBigNumber) => parseBigNumber(totalLPBigNumber)),
                tap((totalLPSupply) => (this.totalLPSupply = totalLPSupply)),
                switchMap(() =>
                    this.lpService.getFodlApr(
                        this.lpService.getContractForLP(this.lp),
                    ),
                ),
                tap((fodlApr) => {
                    this.fodlApr = fodlApr;
                    this.fodlApy = aprToApy(this.fodlApr);
                }),
                tap(() => {
                    this.totalLPSupplyUsd =
                        this.fodl * this.fodlPrice +
                        this.token * this.tokenPrice;

                    this.totalStakedUsd =
                        (this.totalStaked * this.totalLPSupplyUsd) /
                        this.totalLPSupply;

                    this.stakedUsd =
                        (this.staked * this.totalLPSupplyUsd) /
                        this.totalLPSupply;

                    this.fodlUsd = this.fodl * this.fodlPrice;
                    this.tokenUsd = this.token * this.tokenPrice;
                    this.rewardsUsd = this.rewards * this.fodlPrice;
                }),
                first(),
            )
            .subscribe();
    }

    openStaking() {
        this.dialog.open(StakingDialogComponent, {
            width: DIALOG_SMALL,
            data: {
                pair: this.name,
            },
        });
    }
}
