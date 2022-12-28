import { GAS_MULTIPLIER } from '../constants/blockchain';

import { convertToBigNumber } from './bigNumber';

import { multiplyEstimatedGas } from './multiplyEstimatedGas';

describe('Multiply Estimated Gas Utility', () => {
    it('should multiply estimated gas by constant multiplier', () => {
        const gas = 100;

        expect(multiplyEstimatedGas(convertToBigNumber(gas))).toEqual(
            convertToBigNumber(gas * GAS_MULTIPLIER),
        );
    });
});
