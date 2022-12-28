import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AssetSymbolPipeModule } from '../../pipes/asset-symbol/asset-symbol.pipe.module';
import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';
import { FormatExchangeRatePipeModule } from '../../pipes/format-exchange-rate/format-exchange-rate.pipe.module';

import { ConfigurationService } from '../../services/configuration/configuration.service';

import { AprTooltipModule } from '../../components/apr-tooltip/apr-tooltip.module';
import { BorrowLimitModule } from '../../components/borrow-limit/borrow-limit.module';
import { IconPairPlatformModule } from '../../components/icon-pair-platform/icon-pair-platform.module';
import { NewPositionButtonModule } from '../../components/new-position-button/new-position-button.module';
import { PaginatorModule } from '../../components/paginator/paginator.module';

import { PositionsRoutesModule } from './positions-routing.module';

import { PositionsComponent } from './positions.component';

@NgModule({
    declarations: [PositionsComponent],
    imports: [
        CommonModule,
        HttpClientModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatProgressSpinnerModule,
        AssetSymbolPipeModule,
        FormatExchangeRatePipeModule,
        FormatValuePipeModule,
        AprTooltipModule,
        BorrowLimitModule,
        IconPairPlatformModule,
        NewPositionButtonModule,
        PaginatorModule,
        PositionsRoutesModule,
    ],
    providers: [ConfigurationService],
})
export class PositionsModule {}
