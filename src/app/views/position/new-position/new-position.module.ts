import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PositionModule } from '../../../components/position/position.module';
import { PositionLoadingModule } from '../../../components/position/position-loading/position-loading.module';

import { NewPositionRoutesModule } from './new-position-routing.module';

import { NewPositionComponent } from './new-position.component';

@NgModule({
    declarations: [NewPositionComponent],
    imports: [
        CommonModule,
        NewPositionRoutesModule,
        PositionModule,
        PositionLoadingModule,
    ],
})
export class NewPositionModule {}
