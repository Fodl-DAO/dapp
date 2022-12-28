import { ethers } from 'ethers';

import { ETH_DECIMALS } from '../constants/blockchain';

export const convertToBigNumber = (
    number: number | string,
    decimals: number = ETH_DECIMALS,
): ethers.BigNumber =>
    ethers.utils.parseUnits(
        typeof number === 'number' ? number.toFixed(decimals) : number,
        decimals,
    );

export const reduceBigNumber = (
    bigNumber: ethers.BigNumber,
    decimals: number = ETH_DECIMALS,
): ethers.BigNumber => bigNumber.div(ethers.utils.parseUnits('1', decimals));

export const parseBigNumber = (
    bigNumber: ethers.BigNumber,
    decimals = ETH_DECIMALS,
): number => parseFloat(ethers.utils.formatUnits(bigNumber, decimals));
