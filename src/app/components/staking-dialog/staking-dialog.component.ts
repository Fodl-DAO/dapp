import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BehaviorSubject, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { LPService } from '../../services/lp/lp.service';
import { StakingService } from '../../services/staking/staking.service';

import { ethers } from 'ethers';

@Component({
    selector: 'app-staking-dialog',
    templateUrl: './staking-dialog.component.html',
})
export class StakingDialogComponent implements OnInit, OnDestroy {
    geyserContract$: BehaviorSubject<ethers.Contract> =
        new BehaviorSubject<ethers.Contract>(undefined);

    lpContract$: BehaviorSubject<ethers.Contract> =
        new BehaviorSubject<ethers.Contract>(undefined);

    unsubscribe$: Subject<any> = new Subject();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { pair: string },
        public dialogRef: MatDialogRef<StakingDialogComponent>,
        private lpService: LPService,
        private stakingService: StakingService,
    ) {}

    ngOnInit() {
        this.lpService.connected$
            .pipe(
                filter((connected) => connected),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {
                switch (this.data.pair) {
                    case 'FODL / USDC':
                        this.lpContract$.next(this.lpService.lpFodlUsdc);

                        break;
                    case 'FODL / ETH':
                        this.lpContract$.next(this.lpService.lpFodlEth);

                        break;

                    case 'WMATIC / FODL':
                        this.lpContract$.next(this.lpService.lpFoldWmatic);

                        break;
                }
            });

        this.stakingService.connected$
            .pipe(
                filter((connected) => connected),
                takeUntil(this.unsubscribe$),
            )
            .subscribe(() => {
                switch (this.data.pair) {
                    case 'FODL / USDC':
                        this.geyserContract$.next(
                            this.stakingService.geyserUsdc,
                        );

                        break;
                    case 'FODL / ETH':
                        this.geyserContract$.next(
                            this.stakingService.geyserEth,
                        );

                        break;

                    case 'WMATIC / FODL':
                        this.geyserContract$.next(
                            this.stakingService.geyserWmatic,
                        );

                        break;
                }
            });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
