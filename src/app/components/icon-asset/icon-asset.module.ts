import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconPlatformModule } from '../icon-platform/icon-platform.module';

import { IconAssetComponent } from './icon-asset.component';

@NgModule({
    declarations: [IconAssetComponent],
    imports: [CommonModule, IconPlatformModule],
    exports: [IconAssetComponent],
})
export class IconAssetModule {}
