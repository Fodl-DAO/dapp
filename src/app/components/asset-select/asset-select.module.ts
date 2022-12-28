import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { IconAssetModule } from '../icon-asset/icon-asset.module';

import { AssetSelectComponent } from './asset-select.component';

@NgModule({
    declarations: [AssetSelectComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatSelectModule,
        FormatValuePipeModule,
        IconAssetModule,
    ],
    exports: [AssetSelectComponent],
})
export class AssetSelectModule {}
