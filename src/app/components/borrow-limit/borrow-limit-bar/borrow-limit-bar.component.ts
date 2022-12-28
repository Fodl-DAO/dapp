import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-borrow-limit-bar',
    templateUrl: './borrow-limit-bar.component.html',
})
export class BorrowLimitBarComponent {
    @Input() collateralUsageFactorLeftOffset: string;
    @Input() collateralUsageLimitLeftOffset: string;
}
