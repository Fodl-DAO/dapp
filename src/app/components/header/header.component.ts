import { Component } from '@angular/core';

import { filter } from 'rxjs/operators';
import { ConfigurationService } from '../../services/configuration/configuration.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
    allowNetworkSelect: boolean;

    constructor(private configurationService: ConfigurationService) {
        this.configurationService
            .getValueObservable('network')
            .pipe(filter((network) => !!network))
            .subscribe(() => (this.allowNetworkSelect = true));
    }
}
