import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconPairModule } from '../icon-pair/icon-pair.module';
import { IconPlatformModule } from '../icon-platform/icon-platform.module';

import { IconPairPlatformComponent } from './icon-pair-platform.component';

@NgModule({
    declarations: [IconPairPlatformComponent],
    imports: [CommonModule, IconPairModule, IconPlatformModule],
    exports: [IconPairPlatformComponent],
})
export class IconPairPlatformModule {}
