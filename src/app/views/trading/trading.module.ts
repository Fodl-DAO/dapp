import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { AprTooltipModule } from '../../components/apr-tooltip/apr-tooltip.module';
import { IconPairModule } from '../../components/icon-pair/icon-pair.module';
import { IconPairPlatformModule } from '../../components/icon-pair-platform/icon-pair-platform.module';
import { IconPlatformModule } from '../../components/icon-platform/icon-platform.module';
import { NewPositionButtonModule } from '../../components/new-position-button/new-position-button.module';

import { TradingRoutesModule } from './trading-routing.module';

import { TradingComponent } from './trading.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IconAssetModule } from '../../components/icon-asset/icon-asset.module';

@NgModule({
    declarations: [TradingComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatProgressSpinnerModule,
        TradingRoutesModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FormatValuePipeModule,
        AprTooltipModule,
        IconPairModule,
        IconPairPlatformModule,
        IconPlatformModule,
        NewPositionButtonModule,
        InfiniteScrollModule,
        IconAssetModule,
    ],
})
export class TradingModule {}
