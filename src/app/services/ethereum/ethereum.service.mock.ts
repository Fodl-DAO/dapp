import { Contract, providers, Signer } from 'ethers';

import { NetworkType } from './ethereum.network.type';

import { EthereumCoreMock } from './ethereum-core/ethereum-core.mock';

import {
    AllConnectors,
    AllConnectors__factory,
    AllConnectorsBSC,
} from '@0xb1/fodl-typechain';

export class EthereumServiceMock extends EthereumCoreMock {
    private network: NetworkType;
    private account: string;

    constructor() {
        super();
    }

    getAccount(): string {
        return this.account;
    }

    getEthereum(): any {
        return this.ethereum;
    }

    getStaticJsonRpcProvider(): providers.StaticJsonRpcProvider {
        return undefined;
    }

    getBaseProvider(): providers.BaseProvider {
        return this.provider;
    }

    getSigner(): Signer {
        return super.provider.getSigner();
    }

    getNetwork(): string {
        return this.network;
    }

    getMinimumConfirmations(): number {
        return 1;
    }

    getNetworkSimplePositionLens(): string {
        return '';
    }

    getNetworkLendingLens(): string {
        return '';
    }

    getNetworkFoldingRegistry(): string {
        return '';
    }

    getNetworkFoldingRewardsDistributor(): string {
        return '';
    }

    getNetworkPlatforms(): any {
        return {};
    }

    getNetworkAssets(): any {
        return {};
    }

    getNetworkSpecificUSDC(): any {
        return {};
    }

    getNetworkSpecificDefaultPlatform(): any {
        return {};
    }

    getNetworkSpecificDefaultSupplyAsset(): any {
        return {};
    }

    getNetworkSpecificDefaultBorrowAsset() {
        return {};
    }

    getNetworkQuoter(): Contract {
        return new Contract('', '', this.getBaseProvider());
    }

    getNetworkAllConnectors(account: string): AllConnectors | AllConnectorsBSC {
        return AllConnectors__factory.connect(account, this.getSigner());
    }

    getNetworkDefaultExchange(): string {
        return '';
    }
}
