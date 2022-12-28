import { Pipe, PipeTransform } from '@angular/core';

import { getAssetAddress } from '../../utilities/asset';

@Pipe({
    name: 'assetAddress',
})
export class AssetAddressPipe implements PipeTransform {
    transform(symbol: string, platformAddress: string): any {
        return getAssetAddress(symbol, platformAddress);
    }
}
