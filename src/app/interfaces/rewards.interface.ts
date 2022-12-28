import { BigNumber, BigNumberish, BytesLike, ethers } from 'ethers';

export interface IRewardsPerMerkleRoot {
    merkleRoot: string;
    merkleProof: ethers.BytesLike[];
    amount: string;
    accountOwner: string;
}

export interface IRewards extends IRewardsPerMerkleRoot {
    startTime: BigNumber;
    taxingPeriod: BigNumber;
    remainingAmount: BigNumber;
}

export interface IMerkleRootClaim {
    merkleRoot: BytesLike;
    amountAvailable: BigNumberish;
    merkleProof: BytesLike[];
}

export interface IClaim extends IRewards {
    amountAvailable: BigNumber;
}

export interface IComputeClaims {
    totalTax: BigNumber;
    amountsReceived: BigNumber;
    claims: IClaim[];
}
