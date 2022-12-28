import { Injectable } from '@angular/core';

import {
    FodlSingleSidedStaking,
    FodlSingleSidedStaking__factory,
    FodlToken,
    FodlToken__factory,
    ConstantFaucetResume,
    ConstantFaucetResume__factory,
} from '@0xb1/fodl-typechain';

import { BigNumber, ethers } from 'ethers';

import { combineLatest } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { erc20Abi } from '../../../abis/erc20';

import { ASSET_FODL } from '../../constants/blockchain';

import { convertToBigNumber, parseBigNumber } from '../../utilities/bigNumber';

import { ConfigurationService } from '../configuration/configuration.service';
import { EthereumService } from '../ethereum/ethereum.service';
import { GeckoPriceService } from '../gecko-price/gecko-price.service';

@Injectable()
export class SingleSidedStakingService {
    private singleSidedStakingEthereum: FodlSingleSidedStaking;
    private singleSidedStaking: FodlSingleSidedStaking;
    private fodlToken: FodlToken;

    constructor(
        private configurationService: ConfigurationService,
        private ethereumService: EthereumService,
        private geckoPriceService: GeckoPriceService,
    ) {
        combineLatest([
            this.ethereumService.connected$,
            this.configurationService.config$,
        ])
            .pipe(
                filter(
                    ([connected, config]) =>
                        connected && !!config.singleSidedStaking,
                ),
                tap(([_, config]) => {
                    this.singleSidedStakingEthereum =
                        FodlSingleSidedStaking__factory.connect(
                            config.singleSidedStaking,
                            this.ethereumService.getBaseProvider(),
                        );
                }),
            )
            .subscribe(() => {
                this.singleSidedStaking =
                    FodlSingleSidedStaking__factory.connect(
                        this.singleSidedStakingEthereum.address,
                        this.ethereumService.getSigner(),
                    );

                this.fodlToken = FodlToken__factory.connect(
                    ASSET_FODL.address,
                    this.ethereumService.getSigner(),
                );
            });
    }

    getXFodlAddress(): string {
        return this.singleSidedStaking.address;
    }

    getUnstakedAmount(amount: ethers.BigNumber): Promise<ethers.BigNumber> {
        return this.singleSidedStaking.callStatic.unstake(amount);
    }

    getConstantFaucetResumeContract(): ConstantFaucetResume {
        const contactAddress =
            this.configurationService.getValue('xFodlUpdate');

        if (!contactAddress) {
            throw new Error('Contract address of xFodlUpdate is not found.');
        }

        return ConstantFaucetResume__factory.connect(
            contactAddress,
            this.ethereumService.getSigner(),
        );
    }

    async updateXFodlPrice() {
        try {
            return await this.getConstantFaucetResumeContract().distributeFodl();
        } catch (e) {
            return e;
        }
    }

    async getXFodlLastUpdateTime(): Promise<BigNumber> {
        try {
            return await this.getConstantFaucetResumeContract().callStatic.lastUpdateTime();
        } catch (e) {
            return e;
        }
    }

    async getStakingAPR(): Promise<number> {
        return 0;
    }

    async getXFodlPrice(): Promise<number> {
        const totalSupply =
            await this.singleSidedStakingEthereum.callStatic.totalSupply();

        const balance = convertToBigNumber(await this.getFodlTvl());

        return totalSupply.isZero() || balance.isZero()
            ? 1
            : parseBigNumber(
                  balance.mul(convertToBigNumber(1)).div(totalSupply),
              );
    }

    async stake(amount: ethers.BigNumber) {
        try {
            return this.fodlToken.transferAndCall(
                this.singleSidedStaking.address,
                amount,
                '0x',
            );
        } catch (e) {
            return e;
        }
    }

    async unstake(amount: ethers.BigNumber) {
        try {
            return this.singleSidedStaking.unstake(amount);
        } catch (e) {
            return e;
        }
    }

    async getFodlUsdValue(): Promise<number> {
        return await this.geckoPriceService
            .getERC20Price(ASSET_FODL.address)
            .toPromise();
    }

    async getFodlTvl(): Promise<number> {
        const provider = this.ethereumService.getBaseProvider();

        if (!provider) {
            throw new Error(
                'Provider is not ready. Please check if you`re connected to blockchain',
            );
        }

        return this.singleSidedStakingEthereum
            ? parseBigNumber(
                  await new ethers.Contract(
                      ASSET_FODL.address,
                      erc20Abi,
                      provider,
                  ).callStatic.balanceOf(
                      this.singleSidedStakingEthereum.address,
                  ),
              )
            : 0;
    }

    async getXFodlTotalSupply(): Promise<number> {
        return parseBigNumber(
            await this.singleSidedStakingEthereum.callStatic.totalSupply(),
        );
    }

    async getTvlUsd(): Promise<number> {
        return (await this.getFodlUsdValue()) * (await this.getFodlTvl());
    }
}
