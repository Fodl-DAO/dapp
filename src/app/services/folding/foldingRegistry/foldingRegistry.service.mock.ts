import { ethers } from 'ethers';

import { IErrorMessageData } from '../../../interfaces/errorMessageData.interface';

export class FoldingRegistryServiceMock {
    foldingRegistry: ethers.Contract;

    connect() {}

    async getFoldingAccounts(walletAddress: string): Promise<string[]> {
        const accounts: string[] = [];

        return accounts;
    }

    async createFoldingAccount(): Promise<Object | IErrorMessageData> {
        return {};
    }
}
