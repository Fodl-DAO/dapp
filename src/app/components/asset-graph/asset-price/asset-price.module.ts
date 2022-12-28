import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetPriceComponent } from './asset-price.component';
import { IconAssetModule } from '../../icon-asset/icon-asset.module';
import { MatIconModule } from '@angular/material/icon';
import { FormatExchangeRatePipeModule } from '../../../pipes/format-exchange-rate/format-exchange-rate.pipe.module';
import { AssetAddressPipeModule } from '../../../pipes/asset-address/asset-address.pipe.module';
import { FormatValuePipeModule } from '../../../pipes/format-value/format-value.pipe.module';

@NgModule({
    declarations: [AssetPriceComponent],
    imports: [
        CommonModule,
        IconAssetModule,
        MatIconModule,
        FormatExchangeRatePipeModule,
        AssetAddressPipeModule,
        FormatValuePipeModule,
    ],
    exports: [AssetPriceComponent],
})
export class AssetPriceModule {}
