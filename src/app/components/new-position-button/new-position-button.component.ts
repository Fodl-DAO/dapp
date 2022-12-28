import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-new-position-button',
    templateUrl: './new-position-button.component.html',
})
export class NewPositionButtonComponent {
    @Output() click: EventEmitter<any> = new EventEmitter<any>(undefined);
}
