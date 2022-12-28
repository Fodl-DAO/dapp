import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { FormatValuePipeModule } from '../../../pipes/format-value/format-value.pipe.module';

import { IconAssetModule } from '../../icon-asset/icon-asset.module';

import { PositionDetailsComponent } from './position-details.component';

@NgModule({
    declarations: [PositionDetailsComponent],
    imports: [
        CommonModule,
        MatIconModule,
        FormatValuePipeModule,
        IconAssetModule,
    ],
    exports: [PositionDetailsComponent],
})
export class PositionDetailsModule {}
