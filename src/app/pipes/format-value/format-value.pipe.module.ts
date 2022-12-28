import { NgModule } from '@angular/core';

import { FormatValuePipe } from './format-value.pipe';

@NgModule({
    declarations: [FormatValuePipe],
    exports: [FormatValuePipe],
})
export class FormatValuePipeModule {}
