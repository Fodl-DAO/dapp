import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CacheService } from '../cache/cache.service';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
    ASSET_AAVE,
    ASSET_STKAAVE,
    ETH_ADDRESS,
    WETH_ADDRESS,
} from '../../constants/blockchain';

@Injectable({
    providedIn: 'root',
})
export class GeckoPriceService {
    private readonly COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

    constructor(private http: HttpClient, private cache: CacheService) {}

    public getEthereumPrice(): Observable<number> {
        const key = ['ETH', 'Price'].join('-');
        const url =
            this.COINGECKO_API_URL +
            '/simple/price' +
            '?ids=ethereum&vs_currencies=usd';

        const request = this.http
            .get(url)
            .pipe(map((response: any) => response.ethereum.usd));

        return this.cache.getItem(key, request);
    }

    public getERC20Price(
        token: string,
        network: string = 'ethereum',
    ): Observable<number> {
        token =
            token.toLowerCase() === ASSET_STKAAVE.address.toLowerCase()
                ? ASSET_AAVE.address.toLowerCase()
                : token.toLowerCase();

        const keyToken = token.slice(0, token.length / 2);
        const key = ['ERC20', 'Price', keyToken].join('-');

        const networkId = this.getNetworkId(network);
        const url =
            this.COINGECKO_API_URL +
            `/simple/token_price/${networkId}` +
            `?contract_addresses=${token}&vs_currencies=usd`;

        const request = this.http
            .get(url)
            .pipe(map((response) => response[token]?.usd));

        return this.cache.getItem(key, request);
    }

    public getMarketChart(
        id: string,
        days = '30',
        currency = 'usd',
        interval = 'minutely',
    ): Observable<any> {
        const key = ['CHART', id, currency, days, interval].join('-');
        const url =
            this.COINGECKO_API_URL +
            `/coins/${id}/market_chart` +
            `?vs_currency=${currency}&days=${days}&interval=${interval}`;

        const request = this.http
            .get<any>(url)
            .pipe(map((response) => response.prices));

        return this.cache.getItem(key, request);
    }

    public getCoin(id: string): Observable<any> {
        const key = ['COIN', id].join('-');
        const url =
            this.COINGECKO_API_URL +
            `/coins/${id}` +
            `?tickers=true&community_data=false&developer_data=false`;

        const request = this.http
            .get<any>(url)
            .pipe(map((response) => response));

        return this.cache.getItem(key, request);
    }

    public getLatestPrice(asset: string): Observable<number> {
        if (asset === ETH_ADDRESS || asset === WETH_ADDRESS) {
            return this.getEthereumPrice();
        }
        return this.getERC20Price(asset);
    }

    private getNetworkId(network: string): string {
        if (network === 'bsc') {
            return 'binance-smart-chain';
        }
        if (network === 'polygon') {
            return 'polygon-pos';
        }
        return network;
    }
}
