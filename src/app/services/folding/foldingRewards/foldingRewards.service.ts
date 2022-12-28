import { Injectable } from '@angular/core';

import { forkJoin, Observable, of, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import {
    IClaim,
    IMerkleRootClaim,
    IRewards,
    IRewardsPerMerkleRoot,
    IComputeClaims,
} from '../../../interfaces/rewards.interface';

import { parseBalanceMap } from '../../../utilities/merkleTree';
import { convertToBigNumber } from '../../../utilities/bigNumber';

import BSC_DISTRIBUTIONS from '../../../../assets/rewardsDistribution/bsc.json';
import ETH_DISTRIBUTIONS from '../../../../assets/rewardsDistribution/ethereum.json';
import POLYGON_DISTRIBUTIONS from '../../../../assets/rewardsDistribution/polygon.json';

import { EthereumService } from '../../ethereum/ethereum.service';

import { BytesLike } from '@ethersproject/bytes';
import { BigNumber, ethers } from 'ethers';

import {
    RewardsDistributor,
    RewardsDistributor__factory,
} from '@0xb1/fodl-typechain';

@Injectable({
    providedIn: 'root',
})
export class FoldingRewardsService {
    rewardsDistributor: RewardsDistributor;

    constructor(private ethereumService: EthereumService) {}

    connect() {
        if (this.rewardsDistributor) return;

        const rewardsDistributor =
            this.ethereumService.getNetworkFoldingRewardsDistributor();

        this.rewardsDistributor = RewardsDistributor__factory.connect(
            rewardsDistributor,
            this.ethereumService.getSigner(),
        );
    }

    async claim(
        amount: ethers.BigNumber,
        claims: IMerkleRootClaim[],
        simulate?: boolean,
    ): Promise<
        [ethers.BigNumber, ethers.BigNumber] | ethers.ContractTransaction
    > {
        this.connect();

        if (simulate) {
            return this.rewardsDistributor.callStatic.claim(amount, claims);
        } else {
            try {
                return await this.rewardsDistributor.claim(amount, claims);
            } catch (e) {
                return e;
            }
        }
    }

    async getSchedule(
        merkleRoot: BytesLike,
    ): Promise<[ethers.BigNumber, ethers.BigNumber]> {
        this.connect();

        try {
            return this.rewardsDistributor.callStatic.schedule(merkleRoot);
        } catch {
            return [ethers.BigNumber.from(0), ethers.BigNumber.from(0)];
        }
    }

    async getClaimedAmount(
        account: string,
        merkleRoot: BytesLike,
    ): Promise<ethers.BigNumber> {
        this.connect();

        try {
            return this.rewardsDistributor.callStatic.userClaims(
                account,
                merkleRoot,
            );
        } catch {
            return undefined;
        }
    }

    computeClaims(
        account: string,
        amount: BigNumber,
    ): Observable<IComputeClaims> {
        return combineLatest([
            this.getClaims(account, amount),
            this.ethereumService.getBaseProvider().getBlock('latest'),
        ]).pipe(
            map(([claims, block]) => {
                return claims.map((claim) => ({
                    ...claim,
                    tax: claim.taxingPeriod
                        .add(claim.startTime)
                        .sub(block.timestamp)
                        .mul(convertToBigNumber(1))
                        .div(claim.taxingPeriod),
                }));
            }),
            map((claimsWithTax) => {
                let amountClaimed = ethers.BigNumber.from(0);
                let totalTax = ethers.BigNumber.from(0);
                let i = 0;

                for (
                    i = 0;
                    i < claimsWithTax.length && amountClaimed.lt(amount);
                    i++
                ) {
                    const amountNeeded = amount.sub(amountClaimed);
                    const { remainingAmount, tax } = claimsWithTax[i];

                    if (remainingAmount.gt(amountNeeded)) {
                        amountClaimed = amountClaimed.add(amountNeeded);

                        totalTax = totalTax.add(
                            amountNeeded.mul(tax).div(convertToBigNumber(1)),
                        );
                    } else {
                        amountClaimed = amountClaimed.add(remainingAmount);

                        totalTax = totalTax.add(
                            remainingAmount.mul(tax).div(convertToBigNumber(1)),
                        );
                    }
                }

                return {
                    totalTax: totalTax,
                    amountsReceived: amountClaimed.sub(totalTax),
                    claims: claimsWithTax.splice(0, i),
                };
            }),
        );
    }

    getAvailableRewards(account: string): Observable<IRewards[]> {
        const rewards = this.getAllRewards(account);

        if (!rewards.length) {
            return of([]);
        }

        return of(rewards).pipe(
            mergeMap((rewards) => {
                return forkJoin(
                    ...rewards.map(async (reward) => {
                        const claimedAmount = await this.getClaimedAmount(
                            this.ethereumService.getAccount(),
                            reward.merkleRoot,
                        );

                        const remainingAmount = claimedAmount
                            ? ethers.BigNumber.from(reward.amount).sub(
                                  claimedAmount,
                              )
                            : ethers.BigNumber.from(0);

                        const schedule = await this.getSchedule(
                            reward.merkleRoot,
                        );

                        return {
                            ...reward,
                            startTime: schedule[0],
                            taxingPeriod: schedule[1],
                            remainingAmount: remainingAmount,
                        };
                    }),
                );
            }),
            map((extendedRewards) => {
                return extendedRewards
                    .filter(
                        (reward) =>
                            !reward.startTime.isZero() &&
                            !reward.remainingAmount.isZero(),
                    )
                    .sort((a, b) => (a.startTime.gt(b.startTime) ? 1 : -1));
            }),
        );
    }

    private getClaims(
        account: string,
        amount: BigNumber,
    ): Observable<IClaim[]> {
        return this.getAvailableRewards(account).pipe(
            map((rewards) => {
                return rewards.reduce(
                    (a, c) =>
                        a
                            .reduce(
                                (a_, c_) => a_.add(c_.remainingAmount),
                                ethers.BigNumber.from(0),
                            )
                            .lt(amount)
                            ? [...a, c]
                            : a,
                    [],
                );
            }),
            map((claims) => {
                return claims.map((claim) => {
                    const merkleProof =
                        claim.merkleProof.length && claim.merkleProof[0] === ''
                            ? []
                            : claim.merkleProof;

                    return {
                        ...claim,
                        amountAvailable: ethers.BigNumber.from(claim.amount),
                        merkleProof: merkleProof,
                    };
                });
            }),
        );
    }

    private getAllRewards(accountOwner: string): IRewardsPerMerkleRoot[] {
        this.connect();

        const rewards: IRewardsPerMerkleRoot[] = [];
        const account = accountOwner.toLowerCase();

        Object.entries(this.getRewardsDistribution()).map(
            ([merkleRoot, distribution]) => {
                const dist = Object.fromEntries(
                    Object.entries(distribution).map(([user, amount]) => [
                        user.toLowerCase(),
                        BigNumber.from(amount),
                    ]),
                );

                const tree = parseBalanceMap(dist);

                if (tree.claims[account]) {
                    rewards.push({
                        merkleRoot: merkleRoot,
                        merkleProof: tree.claims[account].proof,
                        amount: tree.claims[account].amount,
                        accountOwner: account,
                    });
                }
            },
        );

        return rewards;
    }

    private getRewardsDistribution(): {
        [merkleRoot: string]: { [user: string]: string };
    } {
        switch (this.ethereumService.getNetwork()) {
            case 'bsc':
                return BSC_DISTRIBUTIONS;
            case 'polygon':
                return POLYGON_DISTRIBUTIONS;
            default:
                return ETH_DISTRIBUTIONS;
        }
    }
}
