import { ethers } from 'ethers';

import { GAS_MULTIPLIER } from '../constants/blockchain';

import { convertToBigNumber } from './bigNumber';

export const multiplyEstimatedGas = (
    estimatedGas: ethers.BigNumber,
): ethers.BigNumber =>
    estimatedGas
        .mul(convertToBigNumber(GAS_MULTIPLIER))
        .div(convertToBigNumber(1));
