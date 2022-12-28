import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormatValuePipeModule } from '../../pipes/format-value/format-value.pipe.module';

import { AprTooltipComponent } from './apr-tooltip.component';

@NgModule({
    declarations: [AprTooltipComponent],
    imports: [CommonModule, FormatValuePipeModule],
    exports: [AprTooltipComponent],
})
export class AprTooltipModule {}
