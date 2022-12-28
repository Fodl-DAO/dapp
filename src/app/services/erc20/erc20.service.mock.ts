import { ethers } from 'ethers';

import { convertToBigNumber } from '../../utilities/bigNumber';

import { ETH_DECIMALS } from '../../constants/blockchain';

export const USDC_ADDRESS_MOCK = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'; // 6 decimals
export const WBTC_ADDRESS_MOCK = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'; // 8 decimals

export const getMockTokenDecimals = (address: string): number => {
    if (address === USDC_ADDRESS_MOCK) {
        return 6;
    }

    if (address === WBTC_ADDRESS_MOCK) {
        return 8;
    }

    return ETH_DECIMALS;
};

export class ERC20ServiceMock {
    getContract(address: string) {
        return {
            decimals: (): number => getMockTokenDecimals(address),
        };
    }

    async getBalance(address: string) {
        return 0;
    }

    async getAllowance(account: string, token: string) {
        return 0;
    }

    async approveAllowance(account: string, token: string, amount: number) {
        return {};
    }

    async getTokenAmount(token: string, amount: ethers.BigNumber) {
        return convertToBigNumber(0, getMockTokenDecimals(token));
    }

    getDecimals(address: string) {
        return this.getContract(address).decimals();
    }
}
