import {
    BLOCK_EXPLORER,
    BLOCK_EXPLORER_NAME,
    BSC_BLOCK_EXPLORER,
    BSC_BLOCK_EXPLORER_NAME,
    POLYGON_BLOCK_EXPLORER,
    POLYGON_BLOCK_EXPLORER_NAME,
} from '../constants/assets';

export const getBlockExplorerRoot = (network = 'ethereum') => {
    switch (network) {
        case 'bsc':
            return BSC_BLOCK_EXPLORER;

        case 'polygon':
            return POLYGON_BLOCK_EXPLORER;

        default:
            return BLOCK_EXPLORER;
    }
};

export const getBlockExplorerLink = (
    txHash: string,
    network = 'ethereum',
): string => `${getBlockExplorerRoot(network)}/tx/${txHash}`;

export const getBlockExplorerAddressLink = (
    address: string,
    network = 'ethereum',
): string => `${getBlockExplorerRoot(network)}/address/${address}`;

export const getBlockExplorerName = (network = 'ethereum'): string => {
    switch (network) {
        case 'bsc':
            return BSC_BLOCK_EXPLORER_NAME;

        case 'polygon':
            return POLYGON_BLOCK_EXPLORER_NAME;

        default:
            return BLOCK_EXPLORER_NAME;
    }
};
