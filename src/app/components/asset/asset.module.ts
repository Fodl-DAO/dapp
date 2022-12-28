import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconAssetModule } from '../icon-asset/icon-asset.module';

import { AssetComponent } from './asset.component';

@NgModule({
    declarations: [AssetComponent],
    imports: [CommonModule, IconAssetModule],
    exports: [AssetComponent],
})
export class AssetModule {}
