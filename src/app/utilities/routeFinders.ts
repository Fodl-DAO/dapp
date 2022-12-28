import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { BaseProvider } from '@ethersproject/providers';

import axios from 'axios';

import { ethers } from 'ethers';

import { first, last } from 'lodash';

import { uniswapV3factoryAbi } from '../../abis/uniswapV3';

import {
    ASSET_BAT,
    ASSET_COMP,
    ASSET_DAI,
    ASSET_LINK,
    ASSET_TUSD,
    ASSET_UNI,
    ASSET_USDC,
    ASSET_WBNB,
    ASSET_WBTC,
    ASSET_POLYDAI,
    ASSET_POLYUSDC,
    ASSET_WMATIC,
    ASSET_POLYWETH,
    ASSET_POLYWBTC,
    ASSET_POLYUSDT,
    BSC,
    BSC_DEFAULT_EXCHANGER,
    ETH_ADDRESS,
    MAINNET,
    POLYGON,
    POLYGON_DEFAULT_EXCHANGER,
    UNISWAP_V3_FACTORY,
    WETH_ADDRESS,
    ZERO_ADDRESS,
} from '../constants/blockchain';

const FEE_SIZE = 3;
const FEE_AMOUNT_LOWEST = 100;
const FEE_AMOUNT_LOW = 500;
const FEE_AMOUNT_MEDIUM = 3000;
const FEE_AMOUNT_HIGH = 10000;

export enum PROTOCOL {
    UNISWAP_V2 = 'UNISWAP_V2',
    UNISWAP_V3 = 'UNISWAP_V3',
    SUSHI = 'SUSHI',
    PANCAKESWAP_V2 = 'PANCAKESWAP_V2',
    POLYGON_QUICKSWAP = 'POLYGON_QUICKSWAP',
    POLYGON_UNISWAP_V3 = 'POLYGON_UNISWAP_V3',
}

interface IOneInchResponseToken {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    logoUri: string;
}

interface IOneInchResponseRoutePart {
    name: string;
    part: number;
    fromTokenAddress: string;
    toTokenAddress: string;
}

interface IOneInchResponse {
    fromToken: IOneInchResponseToken;
    toToken: IOneInchResponseToken;
    toTokenAmount: string;
    fromTokenAmount: string;
    protocols: IOneInchResponseRoutePart[][][];
    estimatedGas: number;
    tx: { data: string };
}

export function encodePath(path: string[], fees: number[]): string {
    if (path.length != fees.length + 1) {
        throw new Error('path/fee lengths do not match');
    }

    let encoded = '0x';
    for (let i = 0; i < fees.length; i++) {
        // 20 byte encoding of the address
        encoded += path[i].slice(2);
        // 3 byte encoding of the fee
        encoded += fees[i].toString(16).padStart(2 * FEE_SIZE, '0');
    }
    // encode the final token
    encoded += path[path.length - 1].slice(2);

    return encoded.toLowerCase();
}

export async function queryOneInch(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string | BigNumber,
    slippage: number,
    protocol: PROTOCOL[],
    network,
) {
    amount = amount.toString();

    try {
        let networkId;

        switch (network) {
            case 'bsc':
                networkId = parseInt(BSC);
                break;

            case 'polygon':
                networkId = parseInt(POLYGON);
                break;

            default:
                networkId = parseInt(MAINNET);
        }

        const query =
            `https://api.1inch.exchange/v3.0/${networkId}/swap?` +
            `fromTokenAddress=${fromTokenAddress.toLowerCase()}` +
            `&toTokenAddress=${toTokenAddress.toLowerCase()}` +
            `&amount=${amount}` +
            `&fromAddress=${ZERO_ADDRESS}` +
            `&protocols=${protocol.join(',')}` +
            `&slippage=${slippage}` +
            `&disableEstimate=true` +
            `&mainRouteParts=1` + // disallow parallel swaps, make it all linear
            `&parts=1`; // disallow parallel swaps, make it all linear

        const response = await axios.get<IOneInchResponse>(query);

        if (response.status != 200) {
            throw new Error(JSON.stringify(response));
        }

        return response.data;
    } catch (error) {
        console.error(error);

        return undefined;
    }
}

export function findBestFlashPair(token: string) {
    token = token.toLowerCase();

    let tokenPath: string[];
    let feePath: number[];

    switch (token) {
        case WETH_ADDRESS.toLowerCase():
        case ASSET_USDC.address.toLowerCase():
            tokenPath = [WETH_ADDRESS, ASSET_USDC.address];
            feePath = [FEE_AMOUNT_LOW];

            return encodePath(tokenPath, feePath);
        case ASSET_WBTC.address.toLowerCase():
            tokenPath = [ASSET_WBTC.address, WETH_ADDRESS];
            feePath = [FEE_AMOUNT_LOW];

            return encodePath(tokenPath, feePath);
        case ASSET_DAI.address.toLowerCase():
            tokenPath = [ASSET_USDC.address, ASSET_DAI.address];
            feePath = [FEE_AMOUNT_LOW];

            return encodePath(tokenPath, feePath); // DAI-USDC-0.05%
        case ASSET_LINK.address.toLowerCase():
            tokenPath = [WETH_ADDRESS, ASSET_LINK.address];
            feePath = [FEE_AMOUNT_MEDIUM];

            return encodePath(tokenPath, feePath); // LINK-WETH-0.3%
        case ASSET_COMP.address.toLowerCase():
            tokenPath = [WETH_ADDRESS, ASSET_COMP.address];
            feePath = [FEE_AMOUNT_MEDIUM];

            return encodePath(tokenPath, feePath); // COMP-WETH-0.3%
        case ASSET_BAT.address.toLowerCase():
            tokenPath = [WETH_ADDRESS, ASSET_BAT.address];
            feePath = [FEE_AMOUNT_MEDIUM];

            return encodePath(tokenPath, feePath); // BAT-WETH-0.3%
        case ASSET_UNI.address.toLowerCase():
            tokenPath = [WETH_ADDRESS, ASSET_UNI.address];
            feePath = [FEE_AMOUNT_MEDIUM];

            return encodePath(tokenPath, feePath); // UNI-WETH-0.3%

        case ASSET_POLYDAI.address.toLowerCase():
        case ASSET_POLYUSDC.address.toLowerCase():
            tokenPath = [ASSET_POLYDAI.address, ASSET_POLYUSDC.address];
            feePath = [FEE_AMOUNT_LOWEST];

            return encodePath(tokenPath, feePath);
        case ASSET_WMATIC.address.toLowerCase():
        case ASSET_POLYWETH.address.toLowerCase():
            tokenPath = [ASSET_WMATIC.address, ASSET_POLYWETH.address];
            feePath = [FEE_AMOUNT_LOW];

            return encodePath(tokenPath, feePath);
        case ASSET_POLYWBTC.address.toLowerCase():
            tokenPath = [ASSET_POLYWBTC.address, ASSET_POLYWETH.address];
            feePath = [FEE_AMOUNT_LOW];

            return encodePath(tokenPath, feePath);
        case ASSET_POLYUSDT.address.toLowerCase():
            tokenPath = [ASSET_POLYUSDT.address, ASSET_POLYUSDC.address];
            feePath = [FEE_AMOUNT_LOWEST];

            return encodePath(tokenPath, feePath);
        case ASSET_TUSD.address.toLowerCase():
        default:
            throw new Error(`Invalid token ${token}`);
    }
}

export async function findBestUniswapV3Route(
    tokenIn: string,
    tokenOut: string,
    amountIn: BigNumber,
    provider: BaseProvider,
    slippage: number,
    network = 'ethereum',
): Promise<string> {
    if (amountIn.isNegative()) return undefined;

    let protocols = [];

    switch (network) {
        case 'polygon':
            protocols = [PROTOCOL.POLYGON_UNISWAP_V3];

            break;

        default:
            protocols = [PROTOCOL.UNISWAP_V3];
    }

    const oneInchResponse = await queryOneInch(
        tokenIn,
        tokenOut,
        amountIn,
        slippage,
        protocols,
        network,
    );

    let tokenPath: string[] = [tokenIn];
    let feePath: number[] = [];

    for (let [{ fromTokenAddress, toTokenAddress }] of oneInchResponse
        .protocols[0]) {
        if (fromTokenAddress === ETH_ADDRESS)
            fromTokenAddress = WETH_ADDRESS.toLowerCase();
        if (toTokenAddress === ETH_ADDRESS)
            toTokenAddress = WETH_ADDRESS.toLowerCase();

        const factory = new Contract(
            UNISWAP_V3_FACTORY,
            uniswapV3factoryAbi,
            provider,
        );

        const pools: string[] = await Promise.all([
            factory.getPool(
                fromTokenAddress.toLowerCase(),
                toTokenAddress.toLowerCase(),
                FEE_AMOUNT_LOWEST,
            ),
            factory.getPool(
                fromTokenAddress.toLowerCase(),
                toTokenAddress.toLowerCase(),
                FEE_AMOUNT_LOW,
            ),
            factory.getPool(
                fromTokenAddress.toLowerCase(),
                toTokenAddress.toLowerCase(),
                FEE_AMOUNT_MEDIUM,
            ),
            factory.getPool(
                fromTokenAddress.toLowerCase(),
                toTokenAddress.toLowerCase(),
                FEE_AMOUNT_HIGH,
            ),
        ]);

        const pool = pools.find(
            (pool) =>
                pool !== ZERO_ADDRESS &&
                oneInchResponse.tx.data.includes(pool.toLowerCase().substr(2)),
        );

        if (!pool)
            throw new Error(
                `Invalid 1inch response: no valid pool in tx calldata, looking for one of: ${pools.join(
                    ',',
                )}`,
            );

        const feeTier =
            pools[0] === pool
                ? FEE_AMOUNT_LOWEST
                : pools[1] === pool
                ? FEE_AMOUNT_LOW
                : pools[2] === pool
                ? FEE_AMOUNT_MEDIUM
                : FEE_AMOUNT_HIGH;

        tokenPath.push(toTokenAddress);
        feePath.push(feeTier);
    }

    // Since we are doing this with exact outputs, we need to reverse the path
    tokenPath = tokenPath.reverse();
    feePath = feePath.reverse();

    if (tokenPath[0].toLowerCase() != tokenOut.toLowerCase())
        throw new Error(
            `Token mismatch: start of path must be ${tokenOut}. Got ${tokenPath[0]}`,
        );

    return encodePath(tokenPath, feePath);
}

export async function findBestL2Route(
    tokenIn: string,
    tokenOut: string,
    amountIn: BigNumber,
    slippage: number,
    network: string,
): Promise<{ exchangeData: string; expectedAmountOut: BigNumber }> {
    if (amountIn.isNegative()) throw new Error(`amountIn cannot be negative`);

    let protocols = [];

    switch (network) {
        case 'bsc':
            protocols = [PROTOCOL.PANCAKESWAP_V2];
            break;

        case 'polygon':
            protocols = [PROTOCOL.POLYGON_QUICKSWAP];
            break;
    }

    const oneInchResponse = await queryOneInch(
        tokenIn,
        tokenOut,
        amountIn,
        slippage,
        protocols,
        network,
    );

    if (!oneInchResponse || oneInchResponse.protocols.length != 1)
        throw new Error(`Invalid oneInch response`);

    const expectedAmountOut = BigNumber.from(oneInchResponse.toTokenAmount);
    let tokenPath: string[] = [tokenIn];

    for (let [{ fromTokenAddress, toTokenAddress }] of oneInchResponse
        .protocols[0]) {
        if (fromTokenAddress === ETH_ADDRESS)
            fromTokenAddress = ASSET_WBNB.address.toLowerCase();
        if (toTokenAddress === ETH_ADDRESS)
            toTokenAddress = ASSET_WBNB.address.toLowerCase();
        tokenPath.push(toTokenAddress.toLowerCase());

        if (toTokenAddress.toLowerCase() === tokenOut.toLowerCase()) break;
    }

    if (first(tokenPath)?.toLowerCase() != tokenIn.toLowerCase())
        throw new Error(
            `Token mismatch: start of path must be ${tokenIn}. Got ${first(
                tokenPath,
            )}`,
        );

    if (last(tokenPath)?.toLowerCase() != tokenOut.toLowerCase())
        throw new Error(
            `Token mismatch: end of path must be ${tokenOut}. Got ${last(
                tokenPath,
            )}`,
        );

    let exchanger;

    switch (network) {
        case 'bsc':
            exchanger = BSC_DEFAULT_EXCHANGER;
            break;

        case 'polygon':
            exchanger = POLYGON_DEFAULT_EXCHANGER;
            break;
    }

    const exchangeData = ethers.utils.defaultAbiCoder.encode(
        ['bytes1', 'address[]'],
        [exchanger, tokenPath],
    );

    return { exchangeData, expectedAmountOut };
}
