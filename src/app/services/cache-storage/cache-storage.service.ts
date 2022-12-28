import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

import { ICacheRecord } from '../../interfaces/cacheRecord.interface';

import Dexie, { Table } from 'dexie';

@Injectable({
    providedIn: 'root',
})
export class CacheStorageService extends Dexie {
    private static readonly DB_NAME: string = 'Cache';
    private records: Table<ICacheRecord<any>, string>;

    constructor() {
        super(CacheStorageService.DB_NAME);

        this.version(1).stores({
            records: 'key, expires, value',
        });

        this.open().catch((err) => {
            console.log(err);
        });
    }

    public addRecord<T>(record: ICacheRecord<T>): Observable<ICacheRecord<T>> {
        return new Observable((subscriber) => {
            this.records
                .put({
                    key: record.key,
                    expires: record.expires,
                    value: record.value,
                })
                .then((recordKey) => {
                    if (recordKey !== record.key) {
                        throw new Error('Record was not saved');
                    }
                    subscriber.next(record);
                    subscriber.complete();
                })
                .catch((err) => {
                    this.handleError(err);
                });
        });
    }

    public getRecord<T>(
        key: string,
    ): Observable<ICacheRecord<T> | ICacheRecord<T>[]> {
        return new Observable((subscriber) => {
            this.records
                .get(key)
                .then((record) => {
                    subscriber.next(record);
                    subscriber.complete();
                })
                .catch((err) => {
                    this.handleError(err);
                });
        });
    }

    public removeRecord(key: string): Observable<void> {
        return new Observable<any>((subscriber) => {
            this.records
                .delete(key)
                .then(() => {
                    subscriber.next();
                    subscriber.complete();
                })
                .catch((err) => {
                    this.handleError(
                        new Error(
                            'Key is not valid or transaction is readonly or inactive',
                        ),
                    );
                });
        });
    }

    public resetDatabase(): Observable<void> {
        return new Observable<any>((subscriber) => {
            this.records
                .clear()
                .then(() => {
                    subscriber.next();
                    subscriber.complete();
                })
                .catch((err) => {
                    this.handleError(new Error('Could not reset database'));
                });
        });
    }

    private handleError(error: Error): void {
        return new Subscriber().error(`Cache Storage: ${error.message}`);
    }
}
