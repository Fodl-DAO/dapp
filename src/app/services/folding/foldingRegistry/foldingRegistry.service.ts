import { Injectable } from '@angular/core';

import { hexZeroPad } from '@ethersproject/bytes';

import {
    AllConnectors,
    AllConnectorsBSC,
    AllConnectorsPolygon,
    FodlNFT,
    FodlNFT__factory,
    FoldingRegistry,
    FoldingRegistry__factory,
} from '@0xb1/fodl-typechain';

import { EthereumService } from '../../ethereum/ethereum.service';

@Injectable({
    providedIn: 'root',
})
export class FoldingRegistryService {
    allConnectors: AllConnectors | AllConnectorsBSC | AllConnectorsPolygon;

    foldingRegistry: FoldingRegistry;
    fodlNFT: FodlNFT;

    constructor(private ethereumService: EthereumService) {}

    async connect(signer = true) {
        const foldingRegistry =
            this.ethereumService.getNetworkFoldingRegistry();

        this.foldingRegistry = FoldingRegistry__factory.connect(
            foldingRegistry,
            signer
                ? this.ethereumService.getSigner()
                : this.ethereumService.getBaseProvider(),
        );

        this.allConnectors =
            this.ethereumService.getNetworkAllConnectors(foldingRegistry);

        this.fodlNFT = FodlNFT__factory.connect(
            await this.foldingRegistry.callStatic.fodlNFT(),
            signer
                ? this.ethereumService.getSigner()
                : this.ethereumService.getBaseProvider(),
        );
    }

    async getFoldingAccounts(walletAddress: string): Promise<string[]> {
        await this.connect();

        const accounts: string[] = [];

        try {
            for (
                let i = 0;
                i <
                (
                    await this.fodlNFT.callStatic.balanceOf(walletAddress)
                ).toNumber();
                i++
            ) {
                accounts.push(
                    hexZeroPad(
                        (
                            await this.fodlNFT.callStatic.tokenOfOwnerByIndex(
                                walletAddress,
                                i,
                            )
                        ).toHexString(),
                        20,
                    ).toLowerCase(),
                );
            }
        } catch (e) {
            console.error('getFoldingAccounts Error:', e);
        }

        return accounts;
    }

    async createFoldingAccount(simulate?: boolean): Promise<string | Object> {
        await this.connect();

        if (simulate) {
            return await this.foldingRegistry.callStatic.createAccount();
        } else {
            return await this.foldingRegistry.createAccount();
        }
    }
}
