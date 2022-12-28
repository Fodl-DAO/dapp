import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconAssetModule } from '../icon-asset/icon-asset.module';

import { IconPairComponent } from './icon-pair.component';

@NgModule({
    declarations: [IconPairComponent],
    imports: [CommonModule, IconAssetModule],
    exports: [IconPairComponent],
})
export class IconPairModule {}
