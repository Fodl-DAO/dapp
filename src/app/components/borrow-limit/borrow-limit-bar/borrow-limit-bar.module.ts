import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BorrowLimitBarComponent } from './borrow-limit-bar.component';

@NgModule({
    declarations: [BorrowLimitBarComponent],
    imports: [CommonModule],
    exports: [BorrowLimitBarComponent],
})
export class BorrowLimitBarModule {}
