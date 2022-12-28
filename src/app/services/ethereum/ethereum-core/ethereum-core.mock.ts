import { BehaviorSubject } from 'rxjs';

import { IConfig } from '../../../interfaces/config.interface';

import { NetworkType } from '../ethereum.network.type';

import { providers } from 'ethers';

import Web3Modal from 'web3modal';
import { filter } from 'rxjs/operators';

export const MOCK_WALLET_ADDRESS = '0xe800E5a369B96dc60E9491fc429D8729CF2FAe26';

export abstract class EthereumCoreMock {
    ethereum: any;
    provider: providers.Web3Provider;
    web3Modal: Web3Modal;
    config: IConfig;

    protected connectedSubject$ = new BehaviorSubject<boolean>(false);
    connected$ = this.connectedSubject$.asObservable();

    protected networkSubject$ = new BehaviorSubject<NetworkType>(undefined);
    network$ = this.networkSubject$.asObservable();

    protected accountSubject$ = new BehaviorSubject<string>(undefined);
    account$ = this.accountSubject$.asObservable();

    protected constructor() {
        this.connected$ = this.connectedSubject$.pipe(
            filter((connected) => !!connected),
        );
    }

    async automaticConnection() {
        this.accountSubject$.next(MOCK_WALLET_ADDRESS);
    }

    async connect() {
        this.accountSubject$.next(MOCK_WALLET_ADDRESS);
    }

    disconnect() {
        this.accountSubject$.next(undefined);
    }

    async switchChain() {
        return;
    }
}
