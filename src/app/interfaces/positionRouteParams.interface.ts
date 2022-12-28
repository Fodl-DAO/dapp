import { Params } from '@angular/router';

export interface IPositionRouteParams extends Params {
    platform: string;
    supplyAsset: string;
    borrowAsset: string;
    leverage?: string;
}
