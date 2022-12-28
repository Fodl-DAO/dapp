import { Pipe, PipeTransform } from '@angular/core';

import { getAssetSymbol } from '../../utilities/asset';

@Pipe({
    name: 'assetSymbol',
})
export class AssetSymbolPipe implements PipeTransform {
    transform(asset: string): any {
        return getAssetSymbol(asset);
    }
}
