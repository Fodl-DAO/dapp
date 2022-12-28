import { Component, Inject, OnInit } from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';

import { from } from 'rxjs';

import { TransactionComponent } from '../transaction/transaction.component';

import { ERC20Service } from '../../services/erc20/erc20.service';
import { EthereumService } from '../../services/ethereum/ethereum.service';
import { SingleSidedStakingService } from '../../services/single-sided-staking/single-sided-staking.service';

import { DIALOG_MEDIUM } from '../../constants/commons';
import { ASSET_FODL } from '../../constants/blockchain';

import { parseBigNumber } from '../../utilities/bigNumber';

import { ethers } from 'ethers';

import moment from 'moment';

@Component({
    selector: 'app-single-sided-staking',
    templateUrl: './single-sided-staking.component.html',
})
export class SingleSidedStakingComponent implements OnInit {
    balanceFodl: ethers.BigNumber;
    balanceXFodl: ethers.BigNumber;

    xFodlPrice = 0;
    xFodlTotalSupply = 0;
    tvlUsd = 0;
    fodlUsdValue = 0;
    apr = 0;

    xFodlLastUpdateAgo: string;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private erc20service: ERC20Service,
        private ethereumService: EthereumService,
        private singleSidedStakingService: SingleSidedStakingService,
        private dialog: MatDialog,
    ) {}

    async ngOnInit() {
        await this.getBalances();

        this.xFodlTotalSupply =
            await this.singleSidedStakingService.getXFodlTotalSupply();

        this.fodlUsdValue =
            await this.singleSidedStakingService.getFodlUsdValue();

        this.tvlUsd = await this.singleSidedStakingService.getTvlUsd();

        this.xFodlLastUpdateAgo = moment(
            await this.getLastUpdateXFodlDate(),
        ).fromNow();

        this.apr = (((50000000 / 3) * this.fodlUsdValue) / this.tvlUsd) * 100;
    }

    async getBalances() {
        this.xFodlPrice = await this.singleSidedStakingService.getXFodlPrice();

        this.balanceFodl = await this.erc20service.getBalance(
            this.ethereumService.getAccount(),
            ASSET_FODL.address,
        );

        this.balanceXFodl = await this.erc20service.getBalance(
            this.ethereumService.getAccount(),
            this.singleSidedStakingService.getXFodlAddress(),
        );
    }

    async getLastUpdateXFodlDate(): Promise<Date> {
        const lastUpdateTime =
            await this.singleSidedStakingService.getXFodlLastUpdateTime();

        return new Date(parseInt(lastUpdateTime._hex, 16) * 1000);
    }

    getBalanceXFodl(): number {
        return this.balanceXFodl ? parseBigNumber(this.balanceXFodl) : 0;
    }

    getBalanceXFodlUsd(): number {
        return this.getBalanceXFodl() * this.fodlUsdValue * this.xFodlPrice;
    }

    updateXFodlPrice() {
        this.dialog.open(TransactionComponent, {
            width: DIALOG_MEDIUM,
            data: {
                title: 'Update xFODL price',
                actionDescription: `Please confirm transaction to update xFODL price.`,
                callback: () => this.document.location.reload(),
                action: from(this.singleSidedStakingService.updateXFodlPrice()),
            },
        });
    }
}
