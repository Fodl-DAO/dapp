import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AssetSymbolPipeModule } from '../../pipes/asset-symbol/asset-symbol.pipe.module';
import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { BorrowLimitBarModule } from './borrow-limit-bar/borrow-limit-bar.module';

import { BorrowLimitComponent } from './borrow-limit.component';

@NgModule({
    declarations: [BorrowLimitComponent],
    imports: [
        CommonModule,
        AssetSymbolPipeModule,
        FormatValuePipeModule,
        BorrowLimitBarModule,
    ],
    exports: [BorrowLimitComponent],
})
export class BorrowLimitModule {}
