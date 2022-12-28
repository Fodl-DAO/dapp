import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';

import { IMarket } from '../../interfaces/market.interface';
import { IAsset } from '../../interfaces/asset.interface';

import { extractAssetFromMarket } from '../../utilities/extractAssetFromMarket';
import { displayBigNumber } from '../../utilities/displayBigNumber';

@Component({
    selector: 'app-asset-select',
    templateUrl: './asset-select.component.html',
})
export class AssetSelectComponent implements OnChanges {
    @Input() markets: IMarket[];
    @Input() assets?: IAsset[];
    @Input() asset: IAsset;

    @Output() assetChange: EventEmitter<IAsset> = new EventEmitter<IAsset>(
        undefined,
    );

    ngOnChanges(changes: SimpleChanges) {
        if (changes.markets) {
            this.assets = changes.markets.currentValue?.map((market) =>
                extractAssetFromMarket(market),
            );
        }
    }

    findAsset(platformAsset: string): IAsset {
        return this.assets.find(
            (asset) =>
                (asset.platformAddress + asset.address).toLowerCase() ===
                platformAsset.toLowerCase(),
        );
    }

    getWalletBalance(asset: string): string {
        const market = this.markets.find(
            (market) => market.assetAddress === asset,
        );
        return market
            ? displayBigNumber(market.walletBalance, market.assetDecimals)
            : '0';
    }
}
