import { Component, Input, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { first } from 'rxjs/operators';

import { SettingsService } from '../../services/settings/settings.service';

import { formatNumber } from '../../utilities/formatValue';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
    @Input() dialogRef?: MatDialogRef<any>;

    readonly MIN_SLIPPAGE = 0;
    readonly MAX_SLIPPAGE = 50;

    readonly FAIL_TRANSACTION_WARNING = 0.05;
    readonly FRONTRUN_SLIPPAGE_WARNING = 5;

    slippage: number;

    constructor(private settingsService: SettingsService) {}

    ngOnInit() {
        this.settingsService.settings$.pipe(first()).subscribe((settings) => {
            this.slippage = settings.slippage;
        });
    }

    save() {
        this.settingsService.settings$.next({
            slippage: this.slippage,
        });

        this.settingsService.save();

        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    modifySlippage(amount: number) {
        if (!this.slippage) {
            this.slippage = 0;
        }

        this.slippage += amount;
        this.slippage = Math.max(
            this.MIN_SLIPPAGE,
            Math.min(this.slippage, this.MAX_SLIPPAGE),
        );

        this.slippage = formatNumber(this.slippage);
    }

    get isSlippageValid() {
        return (
            this.slippage >= this.MIN_SLIPPAGE &&
            this.slippage <= this.MAX_SLIPPAGE
        );
    }

    get isSlippageWarning() {
        return (
            this.slippage > this.FRONTRUN_SLIPPAGE_WARNING ||
            this.slippage < this.FAIL_TRANSACTION_WARNING
        );
    }

    get slippageWarningText() {
        return this.slippage > this.FRONTRUN_SLIPPAGE_WARNING
            ? 'Your transaction may be frontrun'
            : 'Your transaction may fail';
    }
}
