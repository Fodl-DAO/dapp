import { NgModule } from '@angular/core';

import { AssetSymbolPipe } from './asset-symbol.pipe';

@NgModule({
    declarations: [AssetSymbolPipe],
    exports: [AssetSymbolPipe],
})
export class AssetSymbolPipeModule {}
