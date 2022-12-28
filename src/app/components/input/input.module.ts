import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { IconAssetModule } from '../icon-asset/icon-asset.module';
import { FormatInputDirective } from '../../directives/format-input/format-input.directive';

@NgModule({
    declarations: [InputComponent, FormatInputDirective],
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        MatInputModule,
        IconAssetModule,
    ],
    exports: [InputComponent],
})
export class InputModule {}
