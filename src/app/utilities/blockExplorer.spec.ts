import { getBlockExplorerLink } from './blockExplorer';

describe('BlockExplorer Utility', () => {
    it('should get etherscan link', () => {
        expect(getBlockExplorerLink('hash')).toBe(
            'https://etherscan.io/tx/hash',
        );
    });

    it('should get bscscan link', () => {
        expect(getBlockExplorerLink('hash', 'bsc')).toBe(
            'https://bscscan.com/tx/hash',
        );
    });
});
