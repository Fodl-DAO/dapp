import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PositionLoadingComponent } from './position-loading.component';

@NgModule({
    declarations: [PositionLoadingComponent],
    imports: [CommonModule, MatProgressSpinnerModule],
    exports: [PositionLoadingComponent],
})
export class PositionLoadingModule {}
