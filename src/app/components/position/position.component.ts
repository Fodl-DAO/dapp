import { Component, Input, OnInit } from '@angular/core';

import { Location } from '@angular/common';

import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { tap } from 'rxjs/operators';

import { DIALOG_MEDIUM, DIALOG_SMALL } from '../../constants/commons';

import { IPosition } from '../../interfaces/position.interface';
import { IPositionDetails } from '../../interfaces/positionDetails.interface';

import { capitalizeFirstLetter } from '../../utilities/capitalize';

import { RoutingStateService } from '../../services/routingState/routing-state.service';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { FoldingService } from '../../services/folding/folding.service';

import { SettingsDialogComponent } from '../settings-dialog/settings-dialog.component';
import { StopLossSettingsComponent } from '../stop-loss-settings/stop-loss-settings.component';

@Component({
    selector: 'app-position',
    templateUrl: './position.component.html',
})
export class PositionComponent implements OnInit {
    @Input() position: IPosition;
    @Input() edit?: string;

    allowStopLoss: boolean;

    positionDetails: IPositionDetails;

    constructor(
        private dialog: MatDialog,
        private location: Location,
        private router: Router,
        private configurationService: ConfigurationService,
        private routingStateService: RoutingStateService,
        public foldingService: FoldingService,
    ) {}

    ngOnInit() {
        this.allowStopLoss = this.configurationService.getValue('stopLoss');
    }

    async goBack() {
        const path = this.location.path();

        if (!path.startsWith('/new-position') || path.startsWith('/index')) {
            this.location.back();
            return;
        }

        const previousPath = this.routingStateService.getPreviousUrl();
        await this.router.navigate([previousPath]);
    }

    openSettings() {
        this.dialog.open(SettingsDialogComponent, { width: DIALOG_SMALL });
    }

    openStopLoss() {
        this.dialog.open(StopLossSettingsComponent, {
            width: DIALOG_MEDIUM,
            data: {
                position: this.position,
            },
        });
    }

    getFormTitle(): string {
        switch (this.edit) {
            case undefined:
                return 'View Position';

            case 'all':
                return 'Open Position';

            case 'close':
                return 'Close Position';

            default:
                return `Change ${capitalizeFirstLetter(this.edit)}`;
        }
    }
}
