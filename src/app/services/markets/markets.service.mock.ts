import { BehaviorSubject } from 'rxjs';

import { IFoldingMarket, IMarket } from '../../interfaces/market.interface';

export class MarketsServiceMock {
    assetMarkets$: BehaviorSubject<IMarket[]> = new BehaviorSubject<IMarket[]>(
        undefined,
    );

    foldingMarkets$: BehaviorSubject<IFoldingMarket[]> = new BehaviorSubject<
        IFoldingMarket[]
    >(undefined);

    marketsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        true,
    );

    getMarkets() {}

    findMarket(platform: string, asset: string) {}

    findFoldingMarket(
        platform: string,
        supplyAsset: string,
        borrowAsset: string,
    ) {}
}
