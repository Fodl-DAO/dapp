import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-settings-dialog',
    templateUrl: './settings-dialog.component.html',
})
export class SettingsDialogComponent {
    constructor(public dialogRef: MatDialogRef<SettingsDialogComponent>) {}
}
