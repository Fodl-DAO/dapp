import { Observable } from 'rxjs';

import { IMarket } from '../../../interfaces/market.interface';
import { IPlatform } from '../../../interfaces/platform.interface';

import { BigNumber } from 'ethers';
import { BehaviorSubject } from 'rxjs';

export class FoldingMarket implements IMarket {
    assetAddress: string;
    assetDecimals: number;
    assetSymbol: string;
    platform: IPlatform;
    referencePrice: BigNumber;
    assetUsdValue: number;
    totalBorrowBigNumber: BigNumber;
    borrowAPR: number;
    totalSupplyBigNumber: BigNumber;
    supplyAPR: number;
    totalLiquidity: number;
    collateralFactor: number;
    liquidationFactor: number;
    rewardTokenAddress: string;
    rewardTokenSymbol: string;
    rewardTokenDecimals: number;
    borrowRewardsAPR?: number;
    supplyRewardsAPR?: number;
    walletBalance?: BigNumber;

    $assetUsdValueSubject: BehaviorSubject<number>;

    constructor(
        data: IMarket,
        private updateUsdValue: (address: string) => Promise<number>,
    ) {
        Object.assign(this, data);
        this.$assetUsdValueSubject = new BehaviorSubject<number>(
            data.assetUsdValue,
        );
    }

    getAssetUsdValueObservable(): Observable<number> {
        return this.$assetUsdValueSubject.asObservable();
    }

    async updateAssetUsdValue(): Promise<void> {
        this.assetUsdValue = await this.updateUsdValue(this.assetAddress);
        this.$assetUsdValueSubject.next(this.assetUsdValue);
    }
}
