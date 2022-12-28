import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IConfig } from '../../interfaces/config.interface';

import {
    getFromLocalStorage,
    saveToLocalStorage,
} from '../../utilities/localStorageFunctions';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    private config: IConfig;
    private configSubject$ = new BehaviorSubject<IConfig>(undefined);

    config$: Observable<IConfig> = this.configSubject$.asObservable();

    constructor(private http: HttpClient) {}

    static factoryLoadConfig(configService: ConfigurationService) {
        return () => configService.loadConfig();
    }

    async loadConfig() {
        return this.http
            .get<IConfig>('/config.json')
            .pipe(
                catchError((error) => {
                    return throwError(
                        'Failed to load config. An error occurred: ' +
                            error.message,
                    );
                }),
                tap((config) => {
                    this.config = config;
                    this.reload();
                }),
            )
            .toPromise();
    }

    private reload() {
        Object.keys(this.config).map(<K extends keyof IConfig>(key: K) => {
            const storageValue =
                typeof this.config[key] === 'number'
                    ? Number(getFromLocalStorage(key))
                    : getFromLocalStorage(key);

            if (storageValue) {
                this.config[key] = storageValue as IConfig[K];
            }
        });

        this.configSubject$.next(this.config);
    }

    getConfig(): IConfig {
        return this.config;
    }

    getValueObservable<K extends keyof IConfig>(
        key: K,
    ): Observable<IConfig[K]> {
        return this.config$.pipe(map((config) => config[key]));
    }

    getValue<F extends keyof IConfig>(key: F): IConfig[F] {
        return this.config[key];
    }

    setValue<K extends keyof IConfig>(key: K, value: IConfig[K]) {
        saveToLocalStorage(key, value);
        this.reload();
    }
}
