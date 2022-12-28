import { ethers } from 'ethers';
import { sumBigNumbers } from './sumBigNumbers';

describe('Sum Big Numbers Utility', () => {
    it('should sum big numbers', () =>
        expect(
            sumBigNumbers([
                ethers.BigNumber.from(2),
                ethers.BigNumber.from(4),
                ethers.BigNumber.from(6),
            ]),
        ).toEqual(ethers.BigNumber.from(12)));
});
