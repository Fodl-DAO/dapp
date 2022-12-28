import { Component, Input } from '@angular/core';

import { POLYGON_ASSETS } from '../../constants/networks/polygon';
import { ASSETS } from '../../constants/networks/ethereum';
import { BSC_ASSETS } from '../../constants/networks/bsc';

@Component({
    selector: 'app-icon-asset',
    templateUrl: './icon-asset.component.html',
    styleUrls: ['./icon-asset.component.scss'],
})
export class IconAssetComponent {
    @Input() asset: string;
    @Input() assetName: string;
    @Input() assetSymbol: string;
    @Input() platform?: string;
    @Input() platformName?: string;

    getAssetIconAddress(): string {
        if (this.assetSymbol) {
            const asset = [...ASSETS, ...POLYGON_ASSETS, ...BSC_ASSETS].find(
                (asset) => asset.symbol === this.assetSymbol,
            );
            return `/assets/icons/${asset.address.toLowerCase()}.svg`;
        }

        return this.asset
            ? `/assets/icons/${this.asset.toLowerCase()}.svg`
            : '';
    }
}
