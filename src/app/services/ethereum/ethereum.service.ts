import { Inject, Injectable, NgZone } from '@angular/core';

import { Router } from '@angular/router';

import { DOCUMENT } from '@angular/common';

import { tap } from 'rxjs/operators';

import { EthereumCore } from './ethereum-core/ethereum-core';
import { ConfigurationService } from '../configuration/configuration.service';

import { NetworkType } from './ethereum.network.type';

import { Contract, providers, Signer } from 'ethers';

import { pancakeRouterAbi } from '../../../abis/pancake';
import { uniswapV3quoterAbi } from '../../../abis/uniswapV3';

import {
    ASSET_BSCDAI,
    ASSET_BSCETH,
    ASSET_BSCUSDC,
    BSC_ASSETS,
    BSC_DEFAULT_EXCHANGE,
    BSC_PLATFORMS,
    MIN_CONFIRMATIONS_BSC,
    PANCAKESWAP_ROUTER,
    PLATFORM_VENUS,
} from '../../constants/networks/bsc';

import {
    ASSET_POLYDAI,
    ASSET_POLYUSDC,
    ASSET_POLYWETH,
    MIN_CONFIRMATIONS_POLYGON,
    PLATFORM_POLYAAVE,
    POLYGON_ASSETS,
    POLYGON_DEFAULT_EXCHANGE,
    POLYGON_PLATFORMS,
} from '../../constants/networks/polygon';

import {
    ASSET_DAI,
    ASSET_USDC,
    ASSET_WETH,
    ASSETS,
    MIN_CONFIRMATIONS_ETHEREUM,
    PLATFORM_COMPOUND,
    PLATFORMS,
    UNISWAP_V3_QUOTER,
} from '../../constants/networks/ethereum';

import {
    AllConnectors,
    AllConnectors__factory,
    AllConnectorsBSC,
    AllConnectorsBSC__factory,
} from '@0xb1/fodl-typechain';

import {
    IHardcodedAsset,
    IPlatformWithAssets,
} from '../../interfaces/platform.interface';

@Injectable({
    providedIn: 'root',
})
export class EthereumService extends EthereumCore {
    private network: NetworkType;
    private account: string;

    constructor(
        @Inject(DOCUMENT) document: Document,
        configService: ConfigurationService,
        router: Router,
        ngZone: NgZone,
    ) {
        super(document, configService, router, ngZone);

        this.network$
            .pipe(tap((network) => (this.network = network)))
            .subscribe();

        this.account$
            .pipe(tap((account) => (this.account = account)))
            .subscribe();
    }

    isEthereumNetwork(): boolean {
        return this.network === 'ethereum';
    }

    isPolygonNetwork(): boolean {
        return this.network === 'polygon';
    }

    isLoopRequired(): boolean {
        return this.network === 'bsc';
    }

    setAccount(account: string) {
        if (account) {
            this.accountSubject$.next(account);
        }
    }

    getAccount(): string {
        return this.account;
    }

    getEthereum(): any {
        return this.ethereum;
    }

    getBaseProvider(): providers.BaseProvider {
        return this.web3Provider;
    }

    getSigner(): Signer {
        return this.web3Provider?.getSigner();
    }

    getNetwork(): NetworkType {
        return this.network;
    }

    getMinimumConfirmations(): number {
        return this.network === 'bsc'
            ? MIN_CONFIRMATIONS_BSC
            : this.network === 'polygon'
            ? MIN_CONFIRMATIONS_POLYGON
            : MIN_CONFIRMATIONS_ETHEREUM;
    }

    getNetworkSimplePositionLens(): string {
        return this.network === 'bsc'
            ? this.config.bscSimplePositionLens
            : this.network === 'polygon'
            ? this.config.polygonSimplePositionLens
            : this.config.simplePositionLens;
    }

    getNetworkLendingLens(): string {
        return this.network === 'bsc'
            ? this.config.bscLendingPlatformLens
            : this.network === 'polygon'
            ? this.config.polygonLendingPlatformLens
            : this.config.lendingPlatformLens;
    }

    getNetworkFoldingRegistry(): string {
        return this.network === 'bsc'
            ? this.config.bscFoldingRegistry
            : this.network === 'polygon'
            ? this.config.polygonFoldingRegistry
            : this.config.foldingRegistry;
    }

    getNetworkFoldingRewardsDistributor(): string {
        return this.network === 'bsc'
            ? this.config.bscRewardsDistributor
            : this.network === 'polygon'
            ? this.config.polygonRewardsDistributor
            : this.config.rewardsDistributor;
    }

    getNetworkPlatforms(): IPlatformWithAssets[] {
        return this.network === 'bsc'
            ? BSC_PLATFORMS
            : this.network === 'polygon'
            ? POLYGON_PLATFORMS
            : PLATFORMS;
    }

    getNetworkAssets(): IHardcodedAsset[] {
        return this.network === 'bsc'
            ? BSC_ASSETS
            : this.network === 'polygon'
            ? POLYGON_ASSETS
            : ASSETS;
    }

    getNetworkSpecificUSDC(): IHardcodedAsset {
        return this.network === 'bsc'
            ? ASSET_BSCUSDC
            : this.network === 'polygon'
            ? ASSET_POLYUSDC
            : ASSET_USDC;
    }

    getNetworkSpecificDefaultPlatform(): string {
        return this.network === 'bsc'
            ? PLATFORM_VENUS
            : this.network === 'polygon'
            ? PLATFORM_POLYAAVE
            : PLATFORM_COMPOUND;
    }

    getNetworkSpecificDefaultSupplyAsset(): IHardcodedAsset {
        return this.network === 'bsc'
            ? ASSET_BSCETH
            : this.network === 'polygon'
            ? ASSET_POLYWETH
            : ASSET_WETH;
    }

    getNetworkSpecificDefaultBorrowAsset(): IHardcodedAsset {
        return this.network === 'bsc'
            ? ASSET_BSCDAI
            : this.network === 'polygon'
            ? ASSET_POLYDAI
            : ASSET_DAI;
    }

    getNetworkQuoter(): Contract {
        return this.network === 'bsc'
            ? new Contract(
                  PANCAKESWAP_ROUTER,
                  pancakeRouterAbi,
                  this.getBaseProvider(),
              )
            : this.network === 'polygon'
            ? new Contract(
                  UNISWAP_V3_QUOTER,
                  uniswapV3quoterAbi,
                  this.getBaseProvider(),
              )
            : new Contract(
                  UNISWAP_V3_QUOTER,
                  uniswapV3quoterAbi,
                  this.getBaseProvider(),
              );
    }

    getNetworkAllConnectors(account: string): AllConnectors | AllConnectorsBSC {
        return this.network === 'bsc'
            ? AllConnectorsBSC__factory.connect(account, this.getSigner())
            : AllConnectors__factory.connect(account, this.getSigner());
    }

    getNetworkDefaultExchange(): string {
        return this.network === 'bsc'
            ? BSC_DEFAULT_EXCHANGE
            : this.network === 'polygon'
            ? POLYGON_DEFAULT_EXCHANGE
            : '';
    }
}
