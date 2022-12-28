import { Component } from '@angular/core';

import { RoutingStateService } from './services/routingState/routing-state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(private routingStateService: RoutingStateService) {
        this.routingStateService.recordHistory();
    }
}
