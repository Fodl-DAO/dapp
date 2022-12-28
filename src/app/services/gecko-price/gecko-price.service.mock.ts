import { Observable } from 'rxjs';

export class GeckoPriceServiceMock {
    getEthereumPrice(): Observable<number> {
        return new Observable<number>((subscriber) => {
            subscriber.next(1);
            subscriber.complete();
        });
    }

    getERC20Price(
        token: string,
        network: string = 'ethereum',
    ): Observable<number> {
        return new Observable<number>((subscriber) => {
            subscriber.next(1);
            subscriber.complete();
        });
    }

    getMarketChart(
        id: string,
        days = '30',
        currency = 'usd',
        interval = 'minutely',
    ): Observable<any> {
        return new Observable<any>((subscriber) => {
            subscriber.next([]);
            subscriber.complete();
        });
    }

    getCoin(id: string): Observable<any> {
        return new Observable<any>((subscriber) => {
            subscriber.next({});
            subscriber.complete();
        });
    }

    getLatestPrice(asset: string): Observable<number> {
        return new Observable<number>((subscriber) => {
            subscriber.next(1);
            subscriber.complete();
        });
    }
}
