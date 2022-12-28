import { convertToBigNumber, reduceBigNumber } from './bigNumber';

describe('BigNumber Utility', () => {
    it('should convert number to BigNumber', () => {
        expect(convertToBigNumber(0).toHexString()).toEqual('0x00');

        expect(convertToBigNumber(3.14).toHexString()).toEqual(
            '0x2b93855d12ba007c',
        );

        expect(convertToBigNumber(100).toHexString()).toEqual(
            '0x056bc75e2d63100000',
        );
    });

    it('should reduce BigNumber by default 18 decimals', () => {
        expect(reduceBigNumber(convertToBigNumber(1000)).toHexString()).toEqual(
            '0x03e8',
        );
    });

    it('should reduce BigNumber by set decimals', () => {
        expect(
            reduceBigNumber(convertToBigNumber(1000), 8).toHexString(),
        ).toEqual('0x09184e72a000');
    });
});
