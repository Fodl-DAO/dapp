import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { FoldingService } from '../../services/folding/folding.service';

@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
})
export class RootComponent implements OnInit, OnDestroy {
    subscription$: Subscription;

    constructor(
        private router: Router,
        public foldingService: FoldingService,
    ) {}

    ngOnInit() {
        this.foldingService.positions$
            .pipe(first())
            .subscribe((positions) =>
                this.router.navigate([
                    positions.length ? 'positions' : 'trading',
                ]),
            );
    }

    ngOnDestroy() {
        this.subscription$?.unsubscribe();
    }
}
