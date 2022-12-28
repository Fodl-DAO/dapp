import { DOCUMENT } from '@angular/common';

import { Router } from '@angular/router';

import { Inject, NgZone } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IConfig } from '../../../interfaces/config.interface';

import { ConfigurationService } from '../../configuration/configuration.service';

import { NetworkType } from '../ethereum.network.type';

import { providers } from 'ethers';

import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal, { IProviderOptions } from 'web3modal';

import {
    getFromLocalStorage,
    removeFromLocalStorage,
    saveToLocalStorage,
} from '../../../utilities/localStorageFunctions';

import {
    getLocalChainId,
    getNetworkByChainId,
    getNetworkParams,
    isConnectedByChainId,
} from './ethereum-core.utils';

import {
    BSC,
    BSC_RPC_URL,
    DEFAULT_NETWORK,
    MAINNET,
    MAINNET_RPC,
    POLYGON,
    POLYGON_RPC_URL,
    WEB3_MODAL_NETWORKS,
} from '../../../constants/blockchain';

export abstract class EthereumCore {
    protected METAMASK_UNRECOGNIZED_CHAIN_ID_CODES = [-32603, 4902];
    protected METAMASK_SWITCH_CHAIN_ID_ALREADY_PENDING_CODE = -32002;
    protected METAMASK_USER_REJECTED_REQUEST_CODE = 4001;

    protected USER_CLOSED_MODAL_MESSAGES = [
        'Modal closed by user',
        'User closed modal',
        'User Rejected',
    ];

    protected WEB3_CONNECT_LOCAL_PROP = 'WEB3_CONNECT_CACHED_PROVIDER';
    protected WEB3_METAMASK_CACHE_PROVIDER = 'injected';

    protected WALLETCONNECT_SWITCH_NETWORK_KEY = 'wc_switch_network';
    protected WALLETCONNECT_LOCAL_PROP = 'walletconnect';
    protected WALLETCONNECT_LOCAL_DEEPLINK_PROP =
        'WALLETCONNECT_DEEPLINK_CHOICE';

    protected ethereum: any;
    protected web3Provider: providers.Web3Provider;
    protected web3Modal: Web3Modal;
    protected config: IConfig;

    protected connectedSubject$ = new BehaviorSubject<boolean>(false);
    connected$ = this.connectedSubject$.asObservable();

    protected networkSubject$ = new BehaviorSubject<NetworkType>(
        (this.configurationService.getValue('network') as NetworkType) ||
            DEFAULT_NETWORK,
    );
    network$ = this.networkSubject$.asObservable();

    protected accountSubject$ = new BehaviorSubject<string>(undefined);
    account$ = this.accountSubject$.asObservable();

    protected constructor(
        @Inject(DOCUMENT) private document: Document,
        private configurationService: ConfigurationService,
        private router: Router,
        private ngZone: NgZone,
    ) {
        this.configurationService.config$
            .pipe(tap((config) => (this.config = config)))
            .subscribe();

        this.ethereum = this.document.defaultView.ethereum;
        this.web3Modal = this.getWeb3Modal();

        this.validateCacheProvider();
        this.automaticConnection();
    }

    async automaticConnection(): Promise<void> {
        try {
            // User connected
            if (
                this.isWalletConnectUserConnected() ||
                (await this.isMetamaskUserConnected())
            ) {
                await this.connect(this.getCacheProvider());
                return;
            }

            // User not connected but Metamask extension is available
            if (this.ethereum) {
                const isWalletConnectSwitchNetwork = !!getFromLocalStorage(
                    this.WALLETCONNECT_SWITCH_NETWORK_KEY,
                );

                const metamaskChainId = await this.ethereum.request({
                    method: 'eth_chainId',
                });

                const supportedNetwork = getNetworkByChainId(
                    metamaskChainId,
                    this.config,
                );

                const updateModalAndConnect = () => {
                    this.web3Modal = this.getWeb3Modal();
                    this.web3Provider = new providers.Web3Provider(
                        this.ethereum,
                    );
                    this.connectedSubject$.next(true);
                };

                const switchToMetamaskNetwork = () => {
                    this.setNetwork(supportedNetwork);
                    updateModalAndConnect();
                };

                const processWalletConnectSwitchNetwork = async () => {
                    try {
                        await this.switchNetwork(
                            this.networkSubject$.getValue(),
                            false,
                        );
                    } catch (error: any) {
                        if (error?.message === 'rejected' && supportedNetwork) {
                            switchToMetamaskNetwork();
                            return;
                        }
                    }
                    updateModalAndConnect();
                };

                this.attachEthereumEvents(this.ethereum);

                // Reload the page after switching the network
                // while connected with WalletConnect
                if (isWalletConnectSwitchNetwork) {
                    removeFromLocalStorage(
                        this.WALLETCONNECT_SWITCH_NETWORK_KEY,
                    );
                    await processWalletConnectSwitchNetwork();
                    return;
                }

                if (!supportedNetwork) {
                    console.warn(
                        'Unsupported network. Please use ethereum, binance or polygon network.',
                    );
                    return;
                }

                // Set app network to current Metamask network
                switchToMetamaskNetwork();
            }
        } catch (error: any) {
            console.warn('Could not connect to the account.');
            console.error(error);
            return;
        }
    }

    async connect(cacheProvider?: string) {
        try {
            this.ethereum = cacheProvider
                ? await this.web3Modal.connectTo(cacheProvider)
                : await this.web3Modal.connect();
        } catch (error: any) {
            return this.handleConnectError(error);
        }

        if (this.isMetamaskMobileUserConnected()) {
            const appNetwork = this.networkSubject$.getValue();
            const ethChainId = await this.ethereum.request({
                method: 'eth_chainId',
            });

            // App & Metamask mobile on different networks
            if (!isConnectedByChainId(ethChainId, appNetwork, this.config)) {
                console.warn(
                    'Please open Metamask app and accept switch network request',
                );
                try {
                    // Only Metamask or Metamask mobile (by WalletConnect)
                    // can execute 'wallet_switchEthereumChain' request
                    await this.switchNetwork(appNetwork);
                } catch (error: any) {
                    await this.disconnect();
                    return this.handleSwitchNetworkError(error);
                }
            }
        }

        await this.processUser();
    }

    async disconnect() {
        removeFromLocalStorage(this.WALLETCONNECT_LOCAL_DEEPLINK_PROP);
        removeFromLocalStorage(this.WALLETCONNECT_LOCAL_PROP);

        const localCacheProvider = this.web3Modal.cachedProvider;
        const isMetamaskMobile =
            this.ethereum && this.ethereum.wc
                ? this.ethereum.wc?._peerMeta?.name === 'MetaMask'
                : false;

        this.web3Modal.clearCachedProvider();

        // WalletConnect users
        if (localCacheProvider === this.WALLETCONNECT_LOCAL_PROP) {
            if (!isMetamaskMobile) {
                this.ethereum.disconnect();
            }
            await this.reloadMainPage();
            return;
        }

        this.accountSubject$.next(undefined);
    }

    async switchNetwork(
        network: NetworkType,
        reloadPage = true,
    ): Promise<void> {
        const initialNetwork = this.networkSubject$.getValue();
        const isMetamaskExtensionExist = !!this.document.defaultView.ethereum;

        const isMetamaskMobile =
            this.ethereum && this.ethereum.wc
                ? this.ethereum.wc?._peerMeta?.name === 'MetaMask'
                : false;

        const rollbackNetwork = () => {
            this.setNetwork(initialNetwork);
            throw new Error('rejected');
        };

        this.setNetwork(network);

        if (
            isMetamaskExtensionExist &&
            !isMetamaskMobile &&
            this.isWalletConnectUserConnected()
        ) {
            saveToLocalStorage(this.WALLETCONNECT_SWITCH_NETWORK_KEY, true);
        }

        if (
            (!isMetamaskExtensionExist && !isMetamaskMobile) ||
            (this.isWalletConnectUserConnected() && !isMetamaskMobile)
        ) {
            await this.disconnect();
            await this.reloadMainPage();
            return;
        }

        try {
            await this.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: getLocalChainId(network, this.config) }],
            });
        } catch (error: any) {
            if (
                error?.code === this.METAMASK_USER_REJECTED_REQUEST_CODE ||
                error?.message === 'User rejected the request.'
            ) {
                rollbackNetwork();
            }

            if (
                this.METAMASK_UNRECOGNIZED_CHAIN_ID_CODES.includes(error?.code)
            ) {
                try {
                    await this.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [getNetworkParams(network, this.config)],
                    });

                    const currentChainId = await this.ethereum.request({
                        method: 'eth_chainId',
                    });

                    // User rejected 'switch network' request
                    // after 'add network' request
                    if (
                        getLocalChainId(initialNetwork, this.config) ===
                        currentChainId
                    ) {
                        rollbackNetwork();
                    }
                } catch (error: any) {
                    if (
                        error?.code === this.METAMASK_USER_REJECTED_REQUEST_CODE
                    ) {
                        rollbackNetwork();
                    }
                }
            }
        }

        // Metamask is strongly recommend to update
        // page after network change
        if (reloadPage) {
            await this.reloadMainPage();
        }
    }

    private async processUser() {
        this.attachEthereumEvents(this.ethereum);
        this.web3Provider = new providers.Web3Provider(this.ethereum);

        const accounts = await this.web3Provider.listAccounts();

        if (accounts.length) {
            this.accountSubject$.next(accounts[0]);
            this.connectedSubject$.next(true);
        }
    }

    private attachEthereumEvents(connector: any) {
        if (!connector) {
            throw new Error(
                "Can't attach Ethereum events. Please check the connector.",
            );
        }

        const handleAccountsChanged = async (accounts: string[]) => {
            this.ngZone.run(() => {
                if (accounts.length) {
                    this.accountSubject$.next(accounts[0]);
                } else {
                    this.disconnect();
                }
            });
        };

        const handleChainChanged = async (chainId: string | number) => {
            const localNetwork = this.networkSubject$.getValue();
            const updatedNetwork = getNetworkByChainId(chainId, this.config);

            // Network is unsupported in app
            if (!updatedNetwork) {
                console.warn(
                    'Unsupported network. Please use ethereum, binance or polygon network.',
                );
                await this.disconnect();
                await this.reloadMainPage();
                return;
            }

            if (localNetwork !== updatedNetwork) {
                try {
                    await this.switchNetwork(updatedNetwork);
                } catch (error: any) {
                    if (error?.message === 'rejected') {
                        return;
                    }
                    console.error('Switch network error: ' + error);
                    return;
                }
            }
        };

        const handleDisconnect = async (code, reason) => {
            this.ngZone.run(() => {
                this.disconnect();
            });
        };

        connector.on('accountsChanged', handleAccountsChanged);
        connector.on('chainChanged', handleChainChanged);
        connector.on('disconnect', handleDisconnect);
    }

    private validateCacheProvider() {
        const isMetamaskExtensionExist = !!this.document.defaultView.ethereum;
        const isWalletConnectBridgeExist = !!getFromLocalStorage(
            this.WALLETCONNECT_LOCAL_PROP,
        );
        const cacheProvider = this.web3Modal
            ? this.web3Modal.cachedProvider
            : undefined;

        if (
            (!isMetamaskExtensionExist &&
                cacheProvider === this.WEB3_METAMASK_CACHE_PROVIDER) ||
            (!isWalletConnectBridgeExist &&
                cacheProvider === this.WALLETCONNECT_LOCAL_PROP)
        ) {
            this.web3Modal.clearCachedProvider();
        }
    }

    private getWeb3Modal(): Web3Modal {
        const network = this.networkSubject$.getValue();
        const web3ModalNetwork =
            network === 'bsc'
                ? WEB3_MODAL_NETWORKS.bsc
                : network === 'polygon'
                ? WEB3_MODAL_NETWORKS.polygon
                : WEB3_MODAL_NETWORKS.ethereum;

        return new Web3Modal({
            network: web3ModalNetwork,
            cacheProvider: true,
            providerOptions: this.getProviderOptions(),
        });
    }

    private getProviderOptions(): IProviderOptions {
        const ethereum = {
            chainId: this.config.chainId || Number(MAINNET),
            rpc: this.config.rpcUrl || MAINNET_RPC,
        };

        const polygon = {
            chainId: this.config.polygonChainId || Number(POLYGON),
            rpc: this.config.polygonRpcUrl || POLYGON_RPC_URL,
        };

        const bsc = {
            chainId: this.config.bscChainId || Number(BSC),
            rpc: this.config.bscRpcUrl || BSC_RPC_URL,
        };

        return {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    rpc: {
                        [ethereum.chainId]: ethereum.rpc,
                        [bsc.chainId]: bsc.rpc,
                        [polygon.chainId]: polygon.rpc,
                    },
                },
            },
        };
    }

    private getCacheProvider(): string {
        return this.web3Modal.cachedProvider;
    }

    private setNetwork(network: NetworkType) {
        this.configurationService.setValue('network', network);
        this.networkSubject$.next(network);
    }

    private isMetamaskMobileUserConnected(): boolean {
        return (
            this.ethereum &&
            this.ethereum?.wc?._peerMeta?.name === 'MetaMask' &&
            this.isWalletConnectUserConnected()
        );
    }

    private isWalletConnectUserConnected(): boolean {
        const cacheProvider = this.getCacheProvider();
        const isWalletConnectBridgeExist = !!getFromLocalStorage(
            this.WALLETCONNECT_LOCAL_PROP,
        );
        return (
            cacheProvider &&
            cacheProvider === this.WALLETCONNECT_LOCAL_PROP &&
            isWalletConnectBridgeExist
        );
    }

    private async isMetamaskUserConnected(): Promise<boolean> {
        if (!this.ethereum) return false;

        const cacheProvider = this.getCacheProvider();
        const network = this.networkSubject$.getValue();

        const ethereumAccounts = await this.ethereum.request({
            method: 'eth_accounts',
        });

        const ethereumChainId = await this.ethereum.request({
            method: 'eth_chainId',
        });

        return (
            cacheProvider &&
            // User connected through Metamask
            cacheProvider === this.WEB3_METAMASK_CACHE_PROVIDER &&
            // Wallet is unlocked
            ethereumAccounts[0] &&
            // App & Metamask on the same network
            isConnectedByChainId(ethereumChainId, network, this.config)
        );
    }

    private handleConnectError(error: any) {
        const message = error instanceof Error ? error.message : String(error);
        if (this.USER_CLOSED_MODAL_MESSAGES.includes(message)) {
            return;
        }
        return console.error('Connect error: ' + message);
    }

    private handleSwitchNetworkError(error: any) {
        const message = error instanceof Error ? error.message : String(error);
        if (message === 'rejected') {
            return;
        }
        return console.error('Switch network error: ' + message);
    }

    private async reloadMainPage() {
        const tradingPath = '/trading';

        if (this.router.url !== tradingPath) {
            await this.router.navigate([tradingPath]);
        }
        this.document.location.reload();
    }
}
