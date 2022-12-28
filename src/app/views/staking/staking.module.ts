import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { IconPairModule } from '../../components/icon-pair/icon-pair.module';
import { IconPlatformModule } from '../../components/icon-platform/icon-platform.module';
import { LpInfoModule } from '../../components/lp-info/lp-info.module';
import { SingleSidedStakingModule } from '../../components/single-sided-staking/single-sided-staking.module';

import { StakingRoutesModule } from './staking-routing.module';

import { StakingComponent } from './staking.component';

@NgModule({
    declarations: [StakingComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        StakingRoutesModule,
        FormatValuePipeModule,
        IconPairModule,
        IconPlatformModule,
        LpInfoModule,
        SingleSidedStakingModule,
    ],
})
export class StakingModule {}
