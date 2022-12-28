import { NgModule } from '@angular/core';

import { FormatExchangeRatePipe } from './format-exchange-rate.pipe';

@NgModule({
    declarations: [FormatExchangeRatePipe],
    exports: [FormatExchangeRatePipe],
})
export class FormatExchangeRatePipeModule {}
