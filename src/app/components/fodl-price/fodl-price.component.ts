import { Component, OnInit } from '@angular/core';

import { first } from 'rxjs/operators';

import { ASSET_FODL } from '../../constants/blockchain';

import { GeckoPriceService } from '../../services/gecko-price/gecko-price.service';

@Component({
    selector: 'app-fodl-price',
    templateUrl: './fodl-price.component.html',
})
export class FodlPriceComponent implements OnInit {
    fodlPrice: number;

    constructor(private geckoPriceService: GeckoPriceService) {}

    ngOnInit() {
        this.getFodlPrice();
    }

    getFodlPrice() {
        this.geckoPriceService
            .getERC20Price(ASSET_FODL.address)
            .pipe(first())
            .subscribe((price) => (this.fodlPrice = price));
    }
}
