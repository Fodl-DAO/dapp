import { Injectable } from '@angular/core';

import { ethers } from 'ethers';

import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
    LP_FODL_ETH,
    LP_FODL_USDC,
    LP_FODL_WMATIC,
} from '../../constants/blockchain';

import { geyserAbi } from '../../../abis/geyser';

import { multiplyEstimatedGas } from '../../utilities/multiplyEstimatedGas';

import { ConfigurationService } from '../configuration/configuration.service';
import { EthereumService } from '../ethereum/ethereum.service';

@Injectable({
    providedIn: 'root',
})
export class StakingService {
    public geyserUsdc: ethers.Contract;
    public geyserEth: ethers.Contract;
    public geyserWmatic: ethers.Contract;

    public connected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false,
    );

    public updated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false,
    );

    constructor(
        private configurationService: ConfigurationService,
        private ethereumService: EthereumService,
    ) {
        this.ethereumService.connected$
            .pipe(switchMap(() => this.configurationService.config$))
            .subscribe((config) => {
                this.geyserUsdc = new ethers.Contract(
                    config.fodlStakingUsdc,
                    geyserAbi,
                    this.ethereumService.getSigner(),
                );

                this.geyserEth = new ethers.Contract(
                    config.fodlStakingEth,
                    geyserAbi,
                    this.ethereumService.getSigner(),
                );

                this.geyserWmatic = new ethers.Contract(
                    config.fodlStakingWmatic,
                    geyserAbi,
                    this.ethereumService.getSigner(),
                );

                this.connected$.next(true);
            });
    }

    getContractForLP(lp: string): ethers.Contract {
        switch (lp) {
            case LP_FODL_USDC:
                return this.geyserUsdc;
            case LP_FODL_ETH:
                return this.geyserEth;
            case LP_FODL_WMATIC:
                return this.geyserWmatic;
        }

        return undefined;
    }

    async totalSupply(geyser: ethers.Contract): Promise<ethers.BigNumber> {
        return geyser.callStatic.totalSupply();
    }

    async balanceOf(geyser: ethers.Contract): Promise<ethers.BigNumber> {
        return geyser.callStatic.balanceOf(this.ethereumService.getAccount());
    }

    async stake(geyser: ethers.Contract, amount: ethers.BigNumber) {
        try {
            const gasLimit = multiplyEstimatedGas(
                await geyser.estimateGas.stake(amount),
            );

            return await geyser.stake(amount, { gasLimit });
        } catch (e) {
            return e;
        }
    }

    async withdraw(geyser: ethers.Contract, amount: ethers.BigNumber) {
        try {
            const gasLimit = multiplyEstimatedGas(
                await geyser.estimateGas.withdraw(amount),
            );

            return await geyser.withdraw(amount, { gasLimit });
        } catch (e) {
            return e;
        }
    }

    async exit(geyser: ethers.Contract) {
        try {
            const gasLimit = multiplyEstimatedGas(
                await geyser.estimateGas.exit(),
            );

            return await geyser.exit({ gasLimit });
        } catch (e) {
            return e;
        }
    }

    async getReward(geyser: ethers.Contract) {
        try {
            const gasLimit = multiplyEstimatedGas(
                await geyser.estimateGas.getReward(),
            );

            return await geyser.getReward({ gasLimit });
        } catch (e) {
            return e;
        }
    }

    async earned(geyser: ethers.Contract) {
        return geyser.callStatic.earned(this.ethereumService.getAccount());
    }

    async rewardRate(geyser: ethers.Contract) {
        return geyser.rewardRate();
    }
}
