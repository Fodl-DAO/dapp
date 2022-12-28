import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, share, switchMap } from 'rxjs/operators';

import { ICacheRecord } from '../../interfaces/cacheRecord.interface';
import { Expires } from './cache.expires.type';

import { CacheStorageService } from '../cache-storage/cache-storage.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { PendingService } from '../pending/pending.service';

import { isNumber, isString, isDate } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class CacheService {
    private readonly CONFIG_CACHE_PROPERTY = 'cacheExpiresSeconds';

    constructor(
        private configService: ConfigurationService,
        private pendingService: PendingService,
        private cacheStorage: CacheStorageService,
    ) {}

    public getItem<T>(
        key: string,
        observable: Observable<T>,
        expires?: Expires,
    ): Observable<T> {
        return this.pendingService.intercept(
            key,
            this.getItemFromStorage(
                key,
                observable,
                expires ||
                    this.configService.getValue(this.CONFIG_CACHE_PROPERTY),
            ).pipe(share()),
        );
    }

    private getItemFromStorage<T>(
        key: string,
        observable: Observable<T>,
        expires: Expires,
    ): Observable<T> {
        return this.cacheStorage.getRecord(key).pipe(
            map((record: ICacheRecord<T>) => {
                return record ? record : null;
            }),
            switchMap((record: ICacheRecord<T> | null) => {
                if (record && this.isRecordValid<T>(record)) {
                    return of(record.value);
                }
                return observable.pipe(
                    switchMap((val: any) =>
                        this.saveItemToStorage(key, val, expires),
                    ),
                    // If request wasn't successful then return previous data
                    // from cache even when the record is expired
                    catchError((error) =>
                        this.handleRequestError(key, error, record),
                    ),
                );
            }),
        );
    }

    private saveItemToStorage<T>(
        key: string,
        value: T,
        expires: Expires,
    ): Observable<T> {
        const _expires = this.sanitizeAndGenerateDateExpiry(
            expires,
            this.configService.getValue(this.CONFIG_CACHE_PROPERTY),
        );

        const record = {
            key: key,
            expires: _expires,
            value: value,
        };

        return this.cacheStorage
            .addRecord(record)
            .pipe(map((record: ICacheRecord<T>) => record.value));
    }

    public expireItem(key: string): Observable<void> {
        return this.cacheStorage.removeRecord(key);
    }

    private handleRequestError<T>(
        key: string,
        error: any,
        record: ICacheRecord<T>,
    ): Observable<T> {
        if (record) {
            console.error(error);
            console.warn(
                `Request was unsuccessful. Outdated data is used. Cache-item-key: ${key}`,
            );
            return of<T>(record.value);
        }
        return throwError(error);
    }

    private isRecordValid<T>(record: ICacheRecord<T>) {
        return new Date(record.expires).getTime() > Date.now() && record.value;
    }

    private sanitizeAndGenerateDateExpiry(
        expires: Expires,
        defaultExpires: number,
    ): Date {
        const expireDate: Date = this.expiryToDate(expires);
        if (expireDate.getTime() <= Date.now()) {
            return new Date(Date.now() + defaultExpires);
        }
        return expireDate;
    }

    private expiryToDate(expires: Expires): Date {
        if (isNumber(expires)) {
            return new Date(Date.now() + Math.abs(expires as number) * 1000);
        }
        if (isString(expires)) {
            return new Date(expires);
        }
        if (isDate(expires)) {
            return expires as Date;
        }
        return new Date();
    }
}
