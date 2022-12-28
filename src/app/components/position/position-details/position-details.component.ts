import { Component, Input } from '@angular/core';

import { IPosition } from '../../../interfaces/position.interface';
import { IPositionDetails } from '../../../interfaces/positionDetails.interface';

@Component({
    selector: 'app-position-details',
    templateUrl: './position-details.component.html',
})
export class PositionDetailsComponent {
    @Input() edit: boolean;
    @Input() position: IPosition;
    @Input() positionDetails: IPositionDetails;
}
