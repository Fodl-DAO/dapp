import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
    @Input() length: number;
    @Input() options = [5, 10, 25];
    @Input() itemsPerPage = 10;
    @Input() page = 1;

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>(
        undefined,
    );

    @Output() itemsPerPageChange: EventEmitter<number> =
        new EventEmitter<number>(undefined);

    getLastPage(): number {
        return Math.floor((this.length - 1) / this.itemsPerPage) + 1;
    }
}
