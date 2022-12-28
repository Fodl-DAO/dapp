import { BigNumber, ethers } from 'ethers';
import { BytesLike } from '@ethersproject/bytes';

import {
    IMerkleRootClaim,
    IComputeClaims,
} from '../../../interfaces/rewards.interface';

import { IRewards } from '../../../interfaces/rewards.interface';
import { Observable } from 'rxjs';

export class FoldingRewardsServiceMock {
    connect() {}

    async claim(
        amount: ethers.BigNumber,
        claims: IMerkleRootClaim[],
        simulate?: boolean,
    ): Promise<string | Object> {
        return {};
    }

    async getStartTime(merkleRoot: BytesLike): Promise<ethers.BigNumber> {
        return undefined;
    }

    async getClaimedAmount(
        account: string,
        merkleRoot: BytesLike,
    ): Promise<ethers.BigNumber> {
        return undefined;
    }

    getAvailableRewards(account: string): Promise<IRewards[]> {
        return undefined;
    }

    computeClaims(
        account: string,
        amount: BigNumber,
    ): Observable<IComputeClaims> {
        return undefined;
    }
}
