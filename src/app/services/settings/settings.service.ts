import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { ISettings } from '../../interfaces/settings.interface';

import { ConfigurationService } from '../configuration/configuration.service';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    settings$: BehaviorSubject<ISettings> = new BehaviorSubject<ISettings>(
        undefined,
    );

    constructor(private configurationService: ConfigurationService) {
        this.configurationService.config$.pipe(first()).subscribe((config) => {
            this.settings$.next({
                slippage: config.exchangeSlippage,
            });
        });
    }

    set(setting: string, value: any) {
        this.settings$.pipe(first()).subscribe((settings) => {
            let newSettings = { ...settings };
            newSettings[setting] = value;

            this.settings$.next(newSettings);
        });
    }

    save() {
        this.settings$.pipe(first()).subscribe((settings) => {
            this.configurationService.setValue(
                'exchangeSlippage',
                settings.slippage,
            );
        });
    }
}
