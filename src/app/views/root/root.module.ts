import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RootRoutesModule } from './root-routing.module';

import { RootComponent } from './root.component';

@NgModule({
    declarations: [RootComponent],
    imports: [CommonModule, MatProgressSpinnerModule, RootRoutesModule],
})
export class RootModule {}
