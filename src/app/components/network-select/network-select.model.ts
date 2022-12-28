import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';

import { NetworkSelectComponent } from './network-select.component';

@NgModule({
    declarations: [NetworkSelectComponent],
    imports: [CommonModule, FormsModule, MatSelectModule],
    exports: [NetworkSelectComponent],
})
export class NetworkSelectModule {}
