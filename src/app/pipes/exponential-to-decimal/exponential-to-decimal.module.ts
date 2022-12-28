import { NgModule } from '@angular/core';

import { ExponentialToDecimalPipe } from './exponential-to-decimal.pipe';

@NgModule({
    declarations: [ExponentialToDecimalPipe],
    exports: [ExponentialToDecimalPipe],
})
export class ExponentialToDecimalPipeModule {}
