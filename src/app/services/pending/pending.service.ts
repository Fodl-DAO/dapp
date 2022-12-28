import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class PendingService {
    private pending = new Map<string, Observable<any>>();

    public intercept(
        url: string,
        observable: Observable<any>,
    ): Observable<any> {
        const pendingRequestObservable = this.pending.get(url);
        return pendingRequestObservable
            ? pendingRequestObservable
            : this.execObservable(url, observable);
    }

    public execObservable(url, request): Observable<any> {
        this.pending.set(url, request);
        return request.pipe(
            tap(() => {
                this.pending.delete(url);
            }),
        );
    }
}
