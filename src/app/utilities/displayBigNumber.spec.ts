import { displayBigNumber } from './displayBigNumber';

import { ETH_DECIMALS } from '../constants/networks/ethereum';

import { ethers } from 'ethers';

describe('Get Format Big Number Utility', () => {
    it('should format bigNumber', () => {
        expect(
            displayBigNumber(
                ethers.BigNumber.from('0000000000000000000000'),
                ETH_DECIMALS,
            ),
        ).toBe('0');

        expect(
            displayBigNumber(
                ethers.BigNumber.from('000000007555555555555'),
                ETH_DECIMALS,
            ),
        ).toBe('0.000007');

        expect(
            displayBigNumber(
                ethers.BigNumber.from('400342411242423224242'),
                ETH_DECIMALS,
            ),
        ).toBe('400.342411');

        expect(
            displayBigNumber(
                ethers.BigNumber.from('780342411242423224242'),
                ETH_DECIMALS,
                10,
            ),
        ).toBe('780.3424112424');

        expect(
            displayBigNumber(
                ethers.BigNumber.from('780342411242423224242'),
                6,
                4,
            ),
        ).toBe('780342411242423.2242');
    });
});
