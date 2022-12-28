import { NgModule } from '@angular/core';

import { AssetAddressPipe } from './asset-address.pipe';

@NgModule({
    declarations: [AssetAddressPipe],
    exports: [AssetAddressPipe],
})
export class AssetAddressPipeModule {}
