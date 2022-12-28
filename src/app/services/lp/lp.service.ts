import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { sushiLPAbi } from '../../../abis/sushi';

import { ethers } from 'ethers';

import { parseBigNumber } from '../../utilities/bigNumber';

import { EthereumService } from '../ethereum/ethereum.service';
import { GeckoPriceService } from '../gecko-price/gecko-price.service';
import { StakingService } from '../staking/staking.service';

import {
    ASSET_FODL,
    ASSET_USDC,
    ASSET_WMATIC,
    ETH_DECIMALS,
    LP_FODL_ETH,
    LP_FODL_USDC,
    LP_FODL_WMATIC,
} from '../../constants/blockchain';

@Injectable({
    providedIn: 'root',
})
export class LPService {
    public lpFodlUsdc: ethers.Contract;
    public lpFodlEth: ethers.Contract;
    public lpFoldWmatic: ethers.Contract;

    public connected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false,
    );

    public reserves = [];

    constructor(
        private ethereumService: EthereumService,
        private geckoPriceService: GeckoPriceService,
        private stakingService: StakingService,
    ) {
        this.ethereumService.connected$
            .pipe(
                map((connected) =>
                    connected
                        ? this.connectContracts()
                        : this.disconnectContracts(),
                ),
            )
            .subscribe();
    }

    private connectContracts() {
        const network = this.ethereumService.getNetwork();
        const provider = this.ethereumService.getBaseProvider();

        if (network === 'bsc') {
            return;
        }

        if (network === 'ethereum') {
            this.lpFodlEth = new ethers.Contract(
                LP_FODL_ETH,
                sushiLPAbi,
                provider,
            );

            this.lpFodlUsdc = new ethers.Contract(
                LP_FODL_USDC,
                sushiLPAbi,
                provider,
            );
        }

        if (network === 'polygon') {
            this.lpFoldWmatic = new ethers.Contract(
                LP_FODL_WMATIC,
                sushiLPAbi,
                provider,
            );
        }

        this.connected$.next(true);
    }

    private disconnectContracts() {
        this.lpFodlEth = undefined;
        this.lpFodlUsdc = undefined;
        this.lpFoldWmatic = undefined;

        this.connected$.next(false);
    }

    getContractForLP(lp: string): ethers.Contract {
        switch (lp) {
            case LP_FODL_USDC:
                return this.lpFodlUsdc;
            case LP_FODL_ETH:
                return this.lpFodlEth;
            case LP_FODL_WMATIC:
                return this.lpFoldWmatic;
        }

        return undefined;
    }

    getLPfromContract(contract: ethers.Contract): string {
        switch (contract.address) {
            case this.lpFodlUsdc?.address:
                return LP_FODL_USDC;
            case this.lpFodlEth?.address:
                return LP_FODL_ETH;
            case this.lpFoldWmatic?.address:
                return LP_FODL_WMATIC;
        }

        return undefined;
    }

    async getReserves(contract: ethers.Contract) {
        if (this.reserves[contract.address]) {
            return this.reserves[contract.address];
        } else {
            const reserves = await contract.callStatic.getReserves();

            this.reserves[contract.address] = reserves;

            return reserves;
        }
    }

    async totalSupply(contract: ethers.Contract) {
        return contract?.callStatic.totalSupply();
    }

    async balanceOf(
        contract: ethers.Contract,
        account: string,
    ): Promise<ethers.BigNumber> {
        return contract?.callStatic.balanceOf(account);
    }

    async getTvl(contract: ethers.Contract): Promise<number> {
        if (!(contract && this.reserves)) {
            return 0;
        }

        const lp = this.getLPfromContract(contract);

        const reserves = await this.getReserves(contract);

        const tokenPrice =
            lp === LP_FODL_ETH
                ? await this.geckoPriceService.getEthereumPrice().toPromise()
                : lp === LP_FODL_WMATIC
                ? await this.geckoPriceService
                      .getERC20Price(ASSET_WMATIC.address, 'polygon')
                      .toPromise()
                : 1;

        const tokenAmount = parseBigNumber(
            lp === LP_FODL_WMATIC ? reserves._reserve0 : reserves._reserve1,
            lp === LP_FODL_USDC ? ASSET_USDC.decimals : ETH_DECIMALS,
        );

        const fodlPrice = await this.geckoPriceService
            .getERC20Price(ASSET_FODL.address)
            .toPromise();

        const fodlAmount = parseBigNumber(
            lp === LP_FODL_WMATIC ? reserves._reserve1 : reserves._reserve0,
        );

        return fodlAmount * fodlPrice + tokenAmount * tokenPrice;
    }

    async getFodlApr(contract: ethers.Contract): Promise<number> {
        if (!contract) {
            return 0;
        }

        const lp = this.getLPfromContract(contract);

        const totalSupply = parseBigNumber(
            await this.stakingService.totalSupply(
                this.stakingService.getContractForLP(lp),
            ),
        );

        const fodlPrice = await this.geckoPriceService
            .getERC20Price(ASSET_FODL.address)
            .toPromise();

        const lpValue = await this.getTvl(contract);
        const lpSupply = parseBigNumber(await this.totalSupply(contract));
        const lpPrice = lpValue / lpSupply;
        const rewardRate =
            parseBigNumber(
                await this.stakingService.rewardRate(
                    this.stakingService.getContractForLP(lp),
                ),
            ) *
            60 *
            60 *
            24 *
            365;

        return totalSupply
            ? ((rewardRate * fodlPrice) / (totalSupply * lpPrice)) * 100
            : 0;
    }
}
