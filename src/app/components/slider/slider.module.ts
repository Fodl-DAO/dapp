import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [SliderComponent],
    imports: [CommonModule, MatSliderModule, FormsModule],
    exports: [SliderComponent],
})
export class SliderModule {}
