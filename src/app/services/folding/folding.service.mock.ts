import { BehaviorSubject } from 'rxjs';

import { IMarket } from '../../interfaces/market.interface';
import { IPosition } from '../../interfaces/position.interface';

export class FoldingServiceMock {
    positionsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false,
    );
    positions$: BehaviorSubject<IPosition[]> = new BehaviorSubject<IPosition[]>(
        [],
    );

    marketsLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false,
    );

    markets$: BehaviorSubject<IMarket[]> = new BehaviorSubject<IMarket[]>([]);
}
