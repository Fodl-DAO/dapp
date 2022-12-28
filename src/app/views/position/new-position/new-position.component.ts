import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import POSITION from '../../../../fixtures/position.json';

import { IPosition } from '../../../interfaces/position.interface';
import { IPositionRouteParams } from '../../../interfaces/positionRouteParams.interface';

import { EthereumService } from '../../../services/ethereum/ethereum.service';
import { MarketsService } from '../../../services/markets/markets.service';

@Component({
    selector: 'app-new-position',
    templateUrl: './new-position.component.html',
})
export class NewPositionComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    position$ = new BehaviorSubject<IPosition>(undefined);

    constructor(
        private activatedRoute: ActivatedRoute,
        private ethereumService: EthereumService,
        public marketsService: MarketsService,
    ) {}

    ngOnInit() {
        this.subscription = combineLatest([
            this.activatedRoute.params,
            this.marketsService.assetMarkets$,
        ])
            .pipe(filter(([_, markets]) => !!markets?.length))
            .subscribe(([params]) => {
                this.position$.next(
                    this.getPosition(params as IPositionRouteParams),
                );
            });
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    getPosition(params: IPositionRouteParams): IPosition {
        if (params.platform && params.supplyAsset && params.borrowAsset) {
            return {
                ...POSITION,
                platformAddress: params.platform,
                borrowMarket: this.marketsService.findMarket(
                    params.platform,
                    params.borrowAsset,
                ),
                supplyMarket: this.marketsService.findMarket(
                    params.platform,
                    params.supplyAsset,
                ),
                leverage: parseFloat(params.leverage) || 1,
            };
        }

        const defaults = {
            platform: this.ethereumService.getNetworkSpecificDefaultPlatform(),
            borrowAssetAddress:
                this.ethereumService.getNetworkSpecificDefaultSupplyAsset()
                    .address,
            supplyAssetAddress:
                this.ethereumService.getNetworkSpecificDefaultBorrowAsset()
                    .address,
        };

        return {
            ...POSITION,
            platformAddress: defaults.platform,
            borrowMarket: this.marketsService.findMarket(
                defaults.platform,
                defaults.borrowAssetAddress,
            ),
            supplyMarket: this.marketsService.findMarket(
                defaults.platform,
                defaults.supplyAssetAddress,
            ),
            leverage: 1,
        };
    }
}
