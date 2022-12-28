import { IConfig } from '../../../interfaces/config.interface';
import { INetworkParams } from '../../../interfaces/networkParams.interface';

import { NetworkType } from '../ethereum.network.type';

import {
    BSC,
    POLYGON,
    MAINNET,
    BSC_RPC_URL,
    BSC_SYMBOL,
    ETH_DECIMALS,
    BSC_BLOCK_EXPLORER,
    POLYGON_RPC_URL,
    POLYGON_SYMBOL,
    POLYGON_BLOCK_EXPLORER,
    BSC_NAME,
    POLYGON_NAME,
} from '../../../constants/blockchain';

export const getLocalChainId = (
    network: NetworkType,
    config: IConfig,
): string => {
    return network === 'bsc'
        ? config.bscChainId || BSC
        : network === 'polygon'
        ? config.polygonChainId || POLYGON
        : config.chainId || MAINNET;
};

export const getNetworkParams = (
    network: NetworkType,
    config: IConfig,
): INetworkParams | undefined => {
    if (network === 'ethereum') {
        return {
            chainName: config.rpcUrl.replace(/(^\w+:|^)\/\//, ''),
            chainId: config.chainId,
            rpcUrls: [config.rpcUrl],
        };
    }

    if (network === 'bsc') {
        return {
            chainId: config.bscChainId || BSC,
            chainName: BSC_NAME,
            nativeCurrency: {
                name: BSC_SYMBOL,
                symbol: BSC_SYMBOL,
                decimals: ETH_DECIMALS,
            },
            rpcUrls: [config.bscRpcUrl || BSC_RPC_URL],
            blockExplorerUrls: [BSC_BLOCK_EXPLORER],
        };
    }

    if (network === 'polygon') {
        return {
            chainId: config.polygonChainId || POLYGON,
            chainName: POLYGON_NAME,
            nativeCurrency: {
                name: POLYGON_SYMBOL,
                symbol: POLYGON_SYMBOL,
                decimals: ETH_DECIMALS,
            },
            rpcUrls: [config.polygonRpcUrl || POLYGON_RPC_URL],
            blockExplorerUrls: [POLYGON_BLOCK_EXPLORER],
        };
    }

    return undefined;
};

export const isConnectedByChainId = (
    chainId: string | number,
    network: NetworkType,
    config: IConfig,
) => {
    if (!chainId) {
        return false;
    }

    const chainIdHex =
        typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;

    if (network === 'bsc') {
        return chainIdHex === (config.bscChainId || BSC);
    }

    if (network === 'polygon') {
        return chainIdHex === (config.polygonChainId || POLYGON);
    }

    return (
        chainIdHex === (config.chainId || MAINNET) ||
        chainIdHex === '0x31337' ||
        chainIdHex === '0x1337'
    );
};

export const getNetworkByChainId = (
    chainId: string | number,
    config: IConfig,
): NetworkType | undefined => {
    const chainIdHex =
        typeof chainId === 'number' ? `0x${chainId.toString(16)}` : chainId;

    return chainIdHex === (config.bscChainId || BSC)
        ? 'bsc'
        : chainIdHex === (config.polygonChainId || POLYGON)
        ? 'polygon'
        : chainIdHex === (config.chainId || MAINNET)
        ? 'ethereum'
        : undefined;
};
