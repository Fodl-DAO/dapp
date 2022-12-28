import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NewPositionButtonComponent } from './new-position-button.component';

@NgModule({
    declarations: [NewPositionButtonComponent],
    imports: [CommonModule, MatButtonModule, MatIconModule],
    exports: [NewPositionButtonComponent],
})
export class NewPositionButtonModule {}
