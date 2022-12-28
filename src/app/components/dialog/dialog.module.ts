import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DialogComponent } from './dialog.component';

@NgModule({
    declarations: [DialogComponent],
    imports: [CommonModule, MatButtonModule, MatIconModule],
    exports: [DialogComponent],
})
export class DialogModule {}
