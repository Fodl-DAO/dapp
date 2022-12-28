import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BigNumberInputComponent } from './big-number-input.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { InputModule } from '../input/input.module';
import { OnlyNumsDirective } from '../../directives/only-nums/only-nums.directive';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [BigNumberInputComponent, OnlyNumsDirective],
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        InputModule,
        MatIconModule,
    ],
    exports: [BigNumberInputComponent],
})
export class BigNumberInputModule {}
